<script>
  import { LayerCake, Svg, Html } from 'layercake';
  import { scaleBand } from 'd3-scale';

  import Column from './_components/Column.svelte';
  import AxisX from './_components/AxisX.svelte';
  import AxisY from './_components/AxisY.svelte';
  import Annotations from './_components/Annotations.html.svelte';
  import Arrows from './_components/Arrows.svelte';
  import ArrowheadMarker from './_components/ArrowheadMarker.svelte';

  export var data
  
  // This example loads csv data as json using @rollup/plugin-dsv
  // import data from './_data/groups.csv';

  // var data = [
  //   {
  //     "year": 1979,
  //     "group": 1,
  //     "value": 2
  //   },
  //   {
  //     "year": 1979,
  //     "group": 2,
  //     "value": 3
  //   },
  //   {
  //     "year": 1989,
  //     "group": 1,
  //     "value": 3
  //   },
  //   {
  //     "year": 1989,
  //     "group": 2,
  //     "value": 3
  //   },
  //   {
  //     "year": 1999,
  //     "group": 1,
  //     "value": 1
  //   },
  //   {
  //     "year": 1999,
  //     "group": 2,
  //     "value": 3
  //   }
  // ];

  const xKey = 'type';
  const yKey = 'value';

  data.forEach(d => {
    d[yKey] = +d[yKey];
  });

  let xDomain = data.map(e => e[xKey])

  const groupBy = 'group';

</script>


<div class="chart-container">
  <LayerCake
    padding={{ top: 0, right: 0, bottom: 20, left: 20 }}
    _custom={{ groupBy }}
    x={xKey}
    y={yKey}
    xScale={scaleBand().paddingInner(0.02).round(true)}
    {xDomain}
    yDomain={[0, null]}
    data={data}
  >
    <Svg>
      <Column />
      <AxisX
        gridlines={false}
      />
      <AxisY
        gridlines={false}
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
    width: 100%;
    height: 300px;
  }
</style>