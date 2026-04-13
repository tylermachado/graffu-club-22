<script>
	import { LayerCake, Svg } from 'layercake';
	import { scaleLinear } from 'd3-scale';
	import StackedBar from './charts/StackedBar.svelte';
	import Labels from './charts/Labels.svelte';

	/** @type {{data: Array<{label: string, value: number}>, title: string}} */
	let { data = [], title = 'Proportion Bar Chart' } = $props();

	// Calculate total for proportions
	const total = $derived(data.reduce((sum, d) => sum + d.value, 0));

	// Calculate cumulative percentages for stacked segments
	const stackedData = $derived.by(() => {
		let cumulative = 0;
		return data.map((d, i) => {
			const percentage = (d.value / total) * 100;
			const start = cumulative;
			cumulative += percentage;
			return {
				...d,
				percentage,
				start,
				end: cumulative,
				index: i
			};
		});
	});

	/** @param {any} d */
	const xAccessor = (d) => d.start;
</script>

<div class="chart-container">
	<h2>{title}</h2>
	<LayerCake
		data={stackedData}
		x={xAccessor}
		xDomain={[0, 100]}
	>
		<Svg>
			<StackedBar {stackedData} />
		</Svg>
	</LayerCake>
	<!-- <Labels {data} {total} /> -->
</div>

<style>
	.chart-container {
		width: 100%;
		max-width: 800px;
		padding: 1rem;
	}

	:global(.layercake-container) {
		height: 60px !important;
	}

	h2 {
		margin-top: 0;
		font-size: 1.5rem;
		margin-bottom: 1rem;
	}
</style>
