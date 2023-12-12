<script>
  import { LayerCake, Svg } from 'layercake';
  import { scaleBand } from 'd3-scale';

  import Bar from './_components/Bar.svelte';
  import AxisX from './_components/AxisX.svelte';
  import AxisY from './_components/AxisY.svelte';

  export var data;

  // This example loads csv data as json using @rollup/plugin-dsv
  // import data from './_data/groups.csv';
  // var data = [
  //   {
  //     "year": 1979,
  //     "value": 2
  //   },
  //   {
  //     "year": 1980,
  //     "value": 2
  //   },
  //   {
  //     "year": 1981,
  //     "value": 2
  //   }
  // ]

  const xKey = 'n';
  const yKey = 'word';

  var yDomain = data.map(e => e.word);
  var zDomain = [...new Set(data.map(e => e.topic))];
  console.log("zDomain", zDomain)

  const seriesColors = ['#F49097', '#DFB2F4', '#38A3A5', '#55D6C2', '#ED1C24','#235789', '#8E4162', '#ffb3c0', '#ff7ac7', '#F00699', '#2E933C', '#FAB2EA', '#C95D63', '#EE8434', '#A3B4A2', '#545643', '#A7C957', '#454E9E'];



  // data.forEach(d => {
  //   d[xKey] = +d[xKey];
  // });
</script>

<div style="width: 90%; max-width: 1200px;text-align: center;margin: auto;">
  {#each zDomain as topic, i}
    <div style="width: max-content;display: inline-block; margin: 0 10px;">
      <div style="display: flex;">
        <div style="background: {seriesColors[i]}; width:10px;height:10px;border-radius:10px;align-self: center;margin:10px;"></div>
        <p>{topic}</p>  
      </div>
    </div>
  {/each}
</div>

<div class="chart-container">
  <LayerCake
    padding={{ top: 0, bottom: 20, left: 35 }}
    x={xKey}
    y={yKey}
    xDomain={[0, null]}
    yScale={scaleBand().paddingInner(0.05)}
    {yDomain}
    data={data}
  >
    <Svg>
      <AxisX
        gridlines={true}
        baseline={true}
        snapTicks={true}
      />
      <AxisY
        gridlines={false}
      />
      <Bar
      {seriesColors}
      {zDomain}
      />
    </Svg>
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
    max-width: 840px;
    margin: auto;
    height: 1400px;
  }
</style>