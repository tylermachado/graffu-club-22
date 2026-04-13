<script>
	import { getContext } from 'svelte';

	const { data, xScale, yScale } = getContext('LayerCake');
</script>

<g class="bars">
	{#each $data as d, i}
		<rect
			x="0"
			y={$yScale(d.label)}
			width={$xScale(d.percentage)}
			height={$yScale.bandwidth()}
			fill="hsl({(i * 360) / $data.length}, 70%, 60%)"
			class="bar"
		/>
	{/each}
</g>

<style>
	:global(.bar) {
		transition: all 300ms ease-in-out;
	}

	:global(.bar:hover) {
		filter: brightness(1.2);
	}
</style>
