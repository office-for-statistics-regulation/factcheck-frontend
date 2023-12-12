<script>
  import { LayerCake, Svg, Html, groupLonger, flatten } from 'layercake';

  import { scaleOrdinal } from 'd3-scale';
  import { timeParse, timeFormat } from 'd3-time-format';
  import { format, precisionFixed } from 'd3-format';

  import MultiLine from './_components/MultiLine.svelte';
  import AxisX from './_components/AxisX.svelte';
  import AxisY from './_components/AxisY.svelte';
  import Labels from './_components/GroupLabels.html.svelte';
  import SharedTooltip from './_components/SharedTooltip.html.svelte';

  export var data;
  export var prc = false;
  console.log("Line data", data)


  // This example loads csv data as json using @rollup/plugin-dsv
  // import data from './_data/fruit.csv';
  // var data = [
  // {
  //   month: '2015-03-31',
  //   apples: '3840',
  //   bananas: '1920',
  //   cherries: '960',
  //   dates: '400'
  // },
  // {
  //   month: '2015-02-28',
  //   apples: '1600',
  //   bananas: '1440',
  //   cherries: '960',
  //   dates: '400'
  // }]

  /* --------------------------------------------
   * Set what is our x key to separate it from the other series
   */
  const xKey = 'date';
  const yKey = 'value';
  const zKey = 'fruit';

  const xKeyCast = timeParse('%Y-%m-%d');

  const seriesNames = Object.keys(data[0]).filter(d => d !== xKey);
  var seriesColors = ['#F49097', '#DFB2F4', '#38A3A5', '#55D6C2', '#ED1C24','#235789', '#8E4162', '#ffb3c0', '#ff7ac7', '#F00699', '#2E933C', '#FAB2EA', '#C95D63', '#EE8434', '#A3B4A2', '#545643', '#A7C957', '#454E9E'];
  if (prc) {
    seriesColors = ['#FC76A690', '#92D2E990', '#AECD7090'];
  }

  /* --------------------------------------------
   * Cast values
   */
  data.forEach(d => {
    d[xKey] = typeof d[xKey] === 'string'
      ? xKeyCast(d[xKey])
      : d[xKey];

    seriesNames.forEach(name => {
      d[name] = +d[name];
    });
  });

  // const formatTickX = timeFormat('%b. %e');
  const formatTickX = timeFormat('%B %Y');

  const formatTickY = d => format(`.${precisionFixed(d)}s`)(d);

  const groupedData = groupLonger(data, seriesNames, {
    groupTo: zKey,
    valueTo: yKey
  });

  console.log("seriesNames", seriesNames)

  var selected = seriesNames.slice(0,3)

  function remove_el(ar, el) {
    const index = ar.indexOf(el);
    if (index > -1) {
        ar.splice(index, 1);
    }
    return ar
  }


  var ens_lu = {
        1: "1. Poor",
        2: "2. Moderate",
        3: "3. Good"
    }
</script>

<div style="width: 90%; max-width: 1200px;text-align: center;margin: auto;">
  {#each seriesNames as n, i}
    <div style="width: max-content;display: inline-block;border: {(selected.includes(n))?seriesColors[i]: "grey"} 2px solid;padding: 10px;margin: 10px;border-radius: 10px;cursor: pointer;background: {(selected.includes(n))?seriesColors[i]+"20":"#cccccc20"}"
    on:click={() => { (selected.includes(n))?  remove_el(selected, n) : selected.push(n) ; selected = selected; }}
    >
      {#if prc}
        {ens_lu[n]}
      {:else}
        {n}
      {/if}
      <!-- {i} -->
    </div>
  {/each}
</div>

<div class="chart-container">
  <LayerCake
    padding={{ top: 7, right: 10, bottom: 20, left: 25 }}
    x={xKey}
    y={yKey}
    z={zKey}
    yDomain={[0, null]}
    zScale={scaleOrdinal()}
    zRange={seriesColors}
    flatData={flatten(groupedData, 'values')}
    data={groupedData}
  >
    <Svg>
      <AxisX
        gridlines={false}
        ticks={data.map(d => d[xKey]).sort((a, b) => a - b)}
        formatTick={formatTickX}
        snapTicks={true}
        tickMarks={true}
      />
      <AxisY
        ticks={4}
        formatTick={formatTickY}
      />
      <MultiLine
        {selected}
        {seriesNames}
        {seriesColors}
      />
    </Svg>

    <Html>
      <SharedTooltip
        formatTitle={formatTickX}
        dataset={data}
        {selected}
      />
    </Html>
  </LayerCake>
</div>

<style>
  /*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
  .chart-container {
    width: 90%;
    max-width: 1000px;
    margin: auto;
    height: 450px;
  }
</style>
