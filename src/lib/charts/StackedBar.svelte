<script>
	import { getContext } from 'svelte';
	import { schemeSet1 } from 'd3-scale-chromatic';

	/** @type {{stackedData: Array<{label: string, value: number, percentage: number, start: number, end: number, index: number, confederation?: string}>}} */
	let { stackedData } = $props();

	const { xScale, height } = getContext('LayerCake');

	const barHeight = 40;

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
		// Fallback to HSL if confederation is unknown
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
		/>
	{/each}
</g>

<style>
	:global(.segment) {
		transition: all 300ms ease-in-out;
		stroke: white;
		stroke-width: 2;
	}

	:global(.segment:hover) {
		filter: brightness(1.2);
		stroke-width: 3;
	}
</style>
