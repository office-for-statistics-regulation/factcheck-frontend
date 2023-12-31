<script context="module">
	import { extent, max } from 'd3-array';
	import { stackOffsetNone, stackOffsetExpand } from 'd3-shape';
	
	import Rect from './Rect.svelte';
	
	export function getGroupExtents(data, keys) {
		const values = data.flatMap(d => keys.map(key => d[key]));
		return extent(values);
	}
	
	export function getStackExtents(data, groupBy, stackBy, offset) {
		const pivotData = pivot(data, groupBy, stackBy, items => sum(items, d => d.value));
		
		const stackKeys = Object.keys(pivotData[0]).filter(d => d !== groupBy);
		const stackData = stack()
  		.offset(offset)
			.keys(stackKeys)
			(pivotData);
		
		return extent(stackData.flat(2));
	}
	
	/**
	 * Function to offset each layer by the maximum of the previous layer
	 *   - see: https://observablehq.com/@mkfreeman/separated-bar-chart
	*/
	export function stackOffsetSeparated(series, order) {
		// TODO: Determine way to pass in as option (curry?)
		const gap = 100;
		
		if (!((n = series.length) > 1)) return;
		
		// Standard series
		for (var i = 1, s0, s1 = series[order[0]], n, m = s1.length; i < n; ++i) {
			(s0 = s1), (s1 = series[order[i]]);
			let base = max(s0, d => d[1]) + gap; // here is where you calculate the maximum of the previous layer
			for (var j = 0; j < m; ++j) {
				// Set the height based on the data values, shifted up by the previous layer
				let diff = s1[j][1] - s1[j][0];
				s1[j][0] = base;
				s1[j][1] = base + diff;
			}
		}
	}
</script>

<script>
	import { getContext } from 'svelte';
	import { cubicInOut as easing } from 'svelte/easing';
	import { scaleBand } from 'd3-scale';
	import { stack } from 'd3-shape';
	import { pivot } from './utils';
	import { sum } from 'd3-array';
	
	const { data, xGet, xScale, yScale, yRange, rGet } = getContext('LayerCake');

	export let groupBy;// = []; TODO: Support array
	export let stackBy;// = []; TODO: Support array
	export let layout = 'stacked';  // stacked or grouped
	export let offset = stackOffsetNone;
	export let delay = 300;
	
	$: pivotData = pivot($data, groupBy, stackBy, items => sum(items, d => d.value));
	$: stackKeys = Object.keys(pivotData[0]).filter(d => d !== groupBy);
	
	$: grouped = layout === 'grouped';
	
	$: stackData = stack()
	  .offset(offset)
		.keys(stackKeys)
		(pivotData);
	
	$: chartData = grouped
		? pivotData.flatMap(d => {
			return stackKeys.map(key => {
				return {
					key,
					values: [0, d[key]],
					data: d
				}
			})
		})
		: stackData.flatMap(series => {
				return series.map(d => {
					return {
						key: series.key,
						values: [d[0], d[1]],
						data: d.data
					}
				})
			})
	
	$: x1Scale = scaleBand()
			.domain(stackKeys)
			.range([0, $xScale.bandwidth()])
			.paddingInner(0.05)
	
	$: getDimensions = (item) => {
		return {
			x: $xGet(item.data) + (grouped ? x1Scale(item.key) : 0),
			y: $yScale(item.values[1]),
			width: grouped ? x1Scale.bandwidth() : $xScale.bandwidth(),
			height: $yScale(item.values[0]) - $yScale(item.values[1]),
		}
	}

</script>

<!-- TODO: Pass in top-level groupKey (or slice off of groupKeys) instead of using year directly -->
<g class="column-group">
  {#each chartData as item, i (`${item.data[groupBy]}-${item.key}`)}
    <Rect
      class='group-rect'
			fill={$rGet(item.key)}
			tweenOptions={{
				x: { easing, delay: grouped ? 0: delay },
				y: { easing, delay: grouped ? delay : 0 },
				width: { easing, delay: grouped ? 0 : delay },
				height: { easing, delay: grouped ? delay : 0 },
			}}
			{...getDimensions(item)}
			{...$$restProps}
    />
	{/each}
</g>