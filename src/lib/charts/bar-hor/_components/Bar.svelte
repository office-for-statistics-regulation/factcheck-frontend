<!--
  @component
  Generates an SVG bar chart.
 -->
<script>
  import { getContext } from 'svelte';

  export var zDomain;
  export var seriesColors;



  const { data, xGet, yGet, xScale, yScale } = getContext('LayerCake');

  console.log("$data", $data)
  console.log("$xGet(d)", $xGet({
    "word": "#soced",
    "n": 1,
    "topic": "Children Education and Skills",
    "date_created": "27/10/2023"
}))

  /** @type {String} [fill='#00bbff'] - The shape's fill color. This is technically optional because it comes with a default value but you'll likely want to replace it with your own color. */
  export let fill = '#38A3A5';
</script>

<g class="bar-group">
  {#each $data as d, i}
    <rect
      class='group-rect'
      data-id="{i}"
      x="{$xScale.range()[0]}"
      y="{$yGet(d)}"
      height={$yScale.bandwidth()}
      width="{$xGet(d)}"
      fill="{seriesColors[zDomain.indexOf(d.topic)]}99"
    ></rect>
  {/each}
</g>