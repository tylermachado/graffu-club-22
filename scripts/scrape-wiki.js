import { load } from "cheerio";
import fs from "fs/promises";

const URL = "https://en.wikipedia.org/wiki/2022_FIFA_World_Cup_squads";

// Maps the flag alt text (e.g. "German Football Association") to a clean country name
function parseCountryFromAlt(altText) {
  const overrides = {
    "The Football Association": "England",
    "Football Federation of Ukraine": "Ukraine",
    "Football Federation Australia": "Australia",
    "United States Soccer Federation": "USA",
    "Royal Belgian Football Association": "Belgium",
    "Royal Spanish Football Association": "Spain",
    "Korean Football Association": "South Korea",
    "Football Federation of Bosnia and Herzegovina": "Bosnia and Herzegovina",
    "Iranian Football Federation": "Iran",
    "Serbian Football Association": "Serbia",
    "Welsh Football Association": "Wales",
    "Football Federation of the Kyrgyz Republic": "Kyrgyzstan",
  };

  if (overrides[altText]) return overrides[altText];

  // Generic stripping of "Football Association/Federation/etc."
  return altText
    .replace(/\b(Royal|The|Football|Soccer|Association|Federation|Union|of|de|des|del|da|van|den)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function scrape() {
  const response = await fetch(URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; research-scraper/1.0)" },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

  const html = await response.text();
  const $ = load(html);
  const result = {};
  let currentCountry = null;

  $("h3, table.wikitable").each((_, el) => {
    const tag = el.name;

    // Each country section is preceded by an <h3> heading
    if (tag === "h3") {
      const headingText = $(el).text().trim();
      if (headingText) {
        currentCountry = headingText;
        result[currentCountry] = [];
      }
      return;
    }

    // Only process squad tables (they have nat-fs-player rows)
    if (!currentCountry) return;
    const rows = $(el).find("tr.nat-fs-player");
    if (rows.length === 0) return;

    rows.each((_, row) => {
      const cells = $(row).find("td, th");

      const number     = $(cells[0]).text().trim();
      const position   = $(cells[1]).text().trim();
      const name       = $(cells[2]).text().trim();
      const dob        = $(cells[3]).find(".bday").text().trim() ||
                         $(cells[3]).text().replace(/\(.*?\)/g, "").trim();
      const caps       = $(cells[4]).text().trim();
      const goals      = $(cells[5]).text().trim();

      // Club cell: last <a> is the club name; flag <img> alt gives the nation
      const clubCell   = $(cells[6]);
      const clubName   = clubCell.find("a").last().text().trim();
      const flagAlt    = clubCell.find("img").attr("alt") || "";
      const clubNation = parseCountryFromAlt(flagAlt);

      result[currentCountry].push({
        number:      parseInt(number, 10),
        position,
        name,
        dob,
        caps:        parseInt(caps, 10),
        goals:       parseInt(goals, 10),
        club:        clubName,
        club_nation: clubNation,
      });
    });
  });

  // Filter out countries with no players (captures non-country h3 headings)
  const filteredResult = Object.fromEntries(
    Object.entries(result).filter(([_, players]) => players.length > 0)
  );

  const countryCount = Object.keys(filteredResult).length;
  const playerCount  = Object.values(filteredResult).reduce((sum, p) => sum + p.length, 0);

  await fs.writeFile("src/data/squads.json", JSON.stringify(filteredResult, null, 2));
  console.log(`Done! ${countryCount} countries, ${playerCount} players → squads.json`);
}

try {
  await scrape();
} catch (error) {
  console.error("Scrape failed:", error.message);
  process.exit(1);
}