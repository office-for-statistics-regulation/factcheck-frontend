<!--
  @component
  Generates an SVG multi-series line chart. It expects your data to be an array of objects, each with a `values` key that is an array of data objects.
 -->
<script>
  import { getContext } from 'svelte';
  export var selected;
  export var seriesColors;
  export var seriesNames;

  const { data, xGet, yGet, zGet } = getContext('LayerCake');

  function zGetNew(d) {
    return seriesColors[seriesNames.indexOf(d)]
  }

  zGetNew("Gaps")

  $: path = values => {
    return 'M' + values
      .map(d => {
        return $xGet(d) + ',' + $yGet(d);
      })
      .join('L');
  };
</script>

<g class="line-group">
  {#each $data as group, i}
    <!-- {console.log("group", group)} -->
    <path
      class='path-line'
      d='{path(group.values)}'
      stroke="{(selected.includes(group.fruit)) ? zGetNew(group.fruit) : "#cccccc70" }"
    ></path>
  {/each}
</g>

<style>
  .path-line {
    fill: none;
    stroke-linejoin: round;
    stroke-linecap: round;
    stroke-width: 3px;
  }
</style>