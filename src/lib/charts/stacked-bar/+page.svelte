<script>
  import { LayerCake, Svg, flatten, uniques, stack } from 'layercake';

  import { scaleBand, scaleOrdinal } from 'd3-scale';
  import { format, precisionFixed } from 'd3-format';

  import ColumnStacked from './_components/ColumnStacked.svelte';
  import AxisX from './_components/AxisX.svelte';
  import AxisY from './_components/AxisY.svelte';

  // This example loads csv data as json using @rollup/plugin-dsv
  // import data from './_data/fruitOrdinal.csv';
  // var data = [
  //   {
  //     year: 2019,
  //     apples: 3840,
  //     bananas: 1920,
  //     cherries: 960,
  //     dates: 400
  //   },
  //   {
  //     year: 2020,
  //     apples: 3040,
  //     bananas: 120,
  //     cherries: 460,
  //     dates: 700
  //   }
  // ]

  
  export var sources_summary;
  var data = sources_summary;

  const xKey = 'type';
  const yKey = [0, 1];
  const zKey = 'key';

  const seriesNames = Object.keys(data[0]).filter(d => d !== xKey).filter(d => d !== "value");
  const seriesColors = ['#FC76A690', '#92D2E990', '#AECD7090'];

  /* --------------------------------------------
   * Cast data
   */

  var formatTickY = d => format(`.${precisionFixed(d)}s`)(d);

  var stackedData;

  $: if (sources_summary) {
    data = sources_summary;
    data.forEach(d => {
      seriesNames.forEach(name => {
        d[name] = +d[name];
      });
    });
    stackedData = stack(data, seriesNames);
  }
</script>

<style>
  /*
    The wrapper div needs to have an explicit width and height in CSS.
    It can also be a flexbox child or CSS grid element.
    The point being it needs dimensions since the <LayerCake> element will
    expand to fill it.
  */
  .chart-container {
    width: 100%;
    height: 350px;
  }
</style>

<div class="chart-container">
  <LayerCake
      padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
      x={d => d.data[xKey]}
      y={yKey}
      z={zKey}
      xScale={scaleBand().paddingInner(0.02).round(true)}
      xDomain={uniques(data, xKey)}
      zScale={scaleOrdinal()}
      zDomain={seriesNames}
      zRange={seriesColors}
      flatData={flatten(stackedData)}
      data={stackedData}
  >
    <Svg>
      <AxisX
        gridlines={false}
      />
      <AxisY
        ticks={4}
        gridlines={false}
        formatTick={formatTickY}
      />
      <ColumnStacked/>
    </Svg>
  </LayerCake>
</div>