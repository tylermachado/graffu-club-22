import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const API_KEY = process.env.FOOTBALL_API_KEY;

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchData() {
	try {
		if (!API_KEY) {
			throw new Error('FOOTBALL_API_KEY not found in .env file');
		}

		const response = await fetch('https://v3.football.api-sports.io/teams?league=1&season=2022', {
			headers: {
				'x-apisports-key': API_KEY
			}
		});

		const data = await response.json();
		const teams = data.response;

		const teamData = teams.map(({ team }) => ({
			id: team.id,
			name: team.name
		}));

		const teamFilePath = path.join(__dirname, '../src/data/teams.json');
		fs.mkdirSync(path.dirname(teamFilePath), { recursive: true });
		fs.writeFileSync(teamFilePath, JSON.stringify(teamData, null, 2));

		console.log(`✓ Saved ${teamData.length} teams to src/data/teams.json`);
		console.log('Fetching players for each team...');

		for (const team of teamData) {
			const playerResponse = await fetch(
				`https://v3.football.api-sports.io/players?team=${team.id}&season=2022`,
				{
					headers: {
						'x-apisports-key': API_KEY
					}
				}
			);

			const playerData = await playerResponse.json();
			const players = playerData.response || [];

			team.players = players.map((player) => ({
				playerId: player.player.id,
				playerName: player.player.name
			}));

			console.log(`  ✓ Fetched ${team.players.length} players for ${team.name}`);

			await delay(3000);
		}

		const playerFilePath = path.join(__dirname, '../src/data/players.json');
		fs.writeFileSync(playerFilePath, JSON.stringify(teamData, null, 2));

		console.log(`✓ Saved all players to src/data/players.json`);
	} catch (error) {
		console.error('✗ Error fetching data:', error.message);
		process.exit(1);
	}
}

fetchData();
