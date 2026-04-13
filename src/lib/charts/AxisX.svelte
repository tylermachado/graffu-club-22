<script>
	import { getContext } from 'svelte';

	const { xScale, height, width } = getContext('LayerCake');
</script>

<g class="axis x-axis">
	{#each $xScale.ticks(5) as tick}
		<g class="tick" transform="translate({$xScale(tick)},0)">
			<line y1={$height} y2={$height + 6} />
			<text y={$height + 20}>{tick}%</text>
		</g>
	{/each}
	<line class="baseline" y1={$height} y2={$height} x1="0" x2={$width} />
</g>

<style>
	:global(.x-axis) {
		font-size: 12px;
	}

	:global(.x-axis .tick line) {
		stroke: #ccc;
		stroke-width: 1;
	}

	:global(.x-axis text) {
		text-anchor: middle;
		fill: #666;
	}
</style>
