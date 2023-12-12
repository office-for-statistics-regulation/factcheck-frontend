<script>

    import { LayerCake, Svg } from 'layercake';
	import { scaleBand, scaleOrdinal } from 'd3-scale';
	import { format, precisionFixed } from 'd3-format';
	import { sum } from 'd3-array';
	
	import Bar, { getStackExtents, stackOffsetSeparated } from './Bar.svelte';
	import AxisX from './AxisX.svelte';
	import AxisY from './AxisY.svelte';

	// import data from './fruitOrdinal.js';
	import { pivot } from './utils'

	export let data_new;

	var transformedData = [];

	for (const group in data_new) {
		for (const category in data_new[group]) {
			const value = data_new[group][category];
			transformedData.push({
				category,
				group,
				value
			});
		}
	}

	$: if (data_new) {
		transformedData = [];

		for (const group in data_new) {
			for (const category in data_new[group]) {
				const value = data_new[group][category];
				transformedData.push({
					category,
					group,
					value
				});
			}
		}
	}
	
	let layout = 'grouped';  // stacked, grouped, percent, or separated
	
	$: options = layout === 'grouped' ? { layout: 'grouped' }
		: layout === 'stacked' ? { layout: 'stacked' }
	  : layout === 'separated' ? { layout: 'stacked', offset: stackOffsetSeparated }
	  : layout === 'percent' ? { layout: 'stacked', offset: stackOffsetExpand }
		:	{}
	
	const groupBy = 'group';
	const stackBy = 'category';
	const pivotData = pivot(transformedData, groupBy, stackBy, items => sum(items, d => d.value));
	const stackKeys = Object.keys(pivotData[0]).filter(d => d !== groupBy);
    const keyColors = ['#FC76A690', '#92D2E990', '#AECD7090'];
	// const formatTickY = d => format(layout === 'percent' ? `.0%` : `.${precisionFixed(d)}s`)(d);
	
	$: extents = {
		y: getStackExtents(transformedData, groupBy, stackBy, options.offset)
	}
</script>

<div class="chart-container">
	<LayerCake
		data={transformedData}
		{extents}
		_custom={{ groupBy, stackBy }}

		x={groupBy}
		xScale={scaleBand().paddingInner(0.1)}
		xDomain={transformedData.map(d => d[groupBy])}

		y={d => d}
		yNice

		r={d => d}
		rScale={scaleOrdinal()}
		rDomain={stackKeys}
		rRange={keyColors}

		padding={{ top: 20, bottom: 20, left: 30 }}
	>
		<Svg>
			<AxisX
				gridlines={false}
			/>
			<AxisY
				ticks={4}
				gridlines={false}

			/>
			
			<Bar {groupBy} {stackBy} {...options} />
		</Svg>
	</LayerCake>
</div>

<style>
	.chart-container {
		width: 100%;
		height: 500px;
	}
</style>
