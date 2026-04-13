<script>
	import { getContext } from 'svelte';

	const { yScale } = getContext('LayerCake');
</script>

<g class="axis y-axis">
	{#each $yScale.domain() as label}
		<g class="tick" transform="translate(0,{$yScale(label)})">
			<line x1="-6" x2="0" />
			<text x="-9" y={$yScale.bandwidth() / 2} dy="0.32em">{label}</text>
		</g>
	{/each}
</g>

<style>
	:global(.y-axis) {
		font-size: 12px;
	}

	:global(.y-axis .tick line) {
		stroke: #ccc;
		stroke-width: 1;
	}

	:global(.y-axis text) {
		text-anchor: end;
		fill: #666;
	}
</style>
