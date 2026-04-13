<script>
	/** @type {{data: Array<{label: string, value: number}>, total: number}} */
	let { data = [], total = 0 } = $props();
</script>

<div class="labels">
	{#each data as d, i}
		<div class="label-row" style="background-color: hsl({(i * 360) / data.length}, 70%, 60%)">
			<span class="label-text">{d.label}</span>
			<span class="label-value">{d.value} ({((d.value / total) * 100).toFixed(1)}%)</span>
		</div>
	{/each}
</div>

<style>
	.labels {
		margin-top: 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.label-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem 1rem;
		border-radius: 4px;
		color: white;
		font-weight: 500;
		font-size: 14px;
	}

	.label-text {
		flex: 1;
	}

	.label-value {
		margin-left: 1rem;
		white-space: nowrap;
	}
</style>
