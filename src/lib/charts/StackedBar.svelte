<script>
	import { getContext, onMount } from 'svelte';
	import { schemeSet1 } from 'd3-scale-chromatic';

	/** @type {{stackedData: Array<{label: string, value: number, percentage: number, start: number, end: number, index: number, confederation?: string}>}} */
	let { stackedData } = $props();

	const { xScale, height } = getContext('LayerCake');

	const barHeight = 40;

	let hoveredSegment = $state(null);
	let tooltipEl;

	onMount(() => {
		tooltipEl = document.createElement('div');
		Object.assign(tooltipEl.style, {
			position: 'fixed',
			background: 'white',
			border: '1px solid #ccc',
			borderRadius: '4px',
			padding: '8px 12px',
			boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
			pointerEvents: 'none',
			zIndex: '1000',
			transform: 'translate(-50%, -100%)',
			whiteSpace: 'nowrap',
			fontSize: '12px',
			fontFamily: 'sans-serif',
			display: 'none',
		});
		document.body.appendChild(tooltipEl);
		return () => tooltipEl.remove();
	});

	$effect(() => {
		if (!tooltipEl) return;
		if (hoveredSegment) {
			const s = hoveredSegment;
			let html = `<div style="font-weight:bold;margin-bottom:4px;border-bottom:1px solid #eee;padding-bottom:4px">${escape(s.label)}</div>`;
			html += `<div style="display:flex;justify-content:space-between;gap:12px"><span>Value:</span><span>${s.value}</span></div>`;
			html += `<div style="display:flex;justify-content:space-between;gap:12px"><span>Share:</span><span>${s.percentage.toFixed(1)}%</span></div>`;
			if (s.confederation) {
				html += `<div style="display:flex;justify-content:space-between;gap:12px"><span>Confederation:</span><span>${escape(s.confederation)}</span></div>`;
			}
			tooltipEl.innerHTML = html;
			tooltipEl.style.display = 'block';
		} else {
			tooltipEl.style.display = 'none';
		}
	});

	function escape(str) {
		return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
	}

	function handleMouseEnter(segment, event) {
		hoveredSegment = segment;
		const rect = event.target.getBoundingClientRect();
		if (tooltipEl) {
			tooltipEl.style.left = `${rect.left + rect.width / 2}px`;
			tooltipEl.style.top = `${rect.top - 10}px`;
		}
	}

	function handleMouseLeave() {
		hoveredSegment = null;
	}

	const confederationIndices = {
		'AFC': 'red',
		'CAF': 'green',
		'CONCACAF': 'blue',
		'CONMEBOL': 'orange',
		'OFC': 'brown',
		'UEFA': 'purple',
	};

	const getSegmentColor = (segment) => {
		if (segment.confederation && confederationIndices[segment.confederation] !== undefined) {
			return confederationIndices[segment.confederation];
		}
		return 'gainsboro';
	};
</script>

<g class="stacked-bar">
	{#each stackedData as segment}
		<rect
			x={$xScale(segment.start)}
			y={($height - barHeight) / 2}
			width={$xScale(segment.end) - $xScale(segment.start)}
			height={barHeight}
			fill={getSegmentColor(segment)}
			class="segment"
			onmouseenter={(e) => handleMouseEnter(segment, e)}
			onmouseleave={handleMouseLeave}
		/>
	{/each}
</g>

<style>
	:global(.segment) {
		transition: all 300ms ease-in-out;
		stroke: white;
		stroke-width: 2;
		cursor: pointer;
	}

	:global(.segment:hover) {
		filter: brightness(1.2);
		stroke-width: 3;
	}
</style>
