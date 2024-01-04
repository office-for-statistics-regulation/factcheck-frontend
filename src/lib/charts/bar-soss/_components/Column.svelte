<!--
  @component
  Generates an SVG column chart.
 -->
<script>
  import { getContext } from 'svelte';

  const { data, xGet, yGet, x, yRange, xScale, y, height, zGet, zScale, z } = getContext('LayerCake');

  /** @type {String} [fill='#00e047'] - The shape's fill color. */
  export let fill = '#00e047';

  /** @type {String} [stroke='#000'] - The shape's stroke color. */
  export let stroke = '#000';

  /** @type {Number} [strokeWidth=0] - The shape's stroke width. */
  export let strokeWidth = 0;

  /** @type {Boolean} [false] - Show the numbers for each column */
  export let showLabels = false;

  $: columnWidth = d => {
    const vals = $xGet(d);
    return Math.abs(vals[1] - vals[0]);
  };

  $: columnHeight = d => {
    return $yRange[0] - $yGet(d);
  };

  const keyColors = {"1. Poor": '#FC76A690', "2. Moderate": '#92D2E990', "3. Good": '#AECD7090'};
  var data_qual_lu = {
        "Homicide": "3. Good",
        "Offences involving knives or sharp instruments": "2. Moderate",
        "Offences involving firearms": "2. Moderate",
        "Criminal damage and arson": "2. Moderate",
        "Vehicle theft offences": "2. Moderate",
        "Burglary": "2. Moderate",
        "Theft from the person": "2. Moderate",
        "Shoplifting": "2. Moderate",
        "All other theft offences": "2. Moderate",
        "Robbery": "3. Good",
        "Fraud": "1. Poor",
        "Computer misuse": "1. Poor",
        "Public order offences": "1. Poor",
        "Drug offences": "1. Poor",
        "Possession of weapons offences": "2. Moderate",
        "Other violent crime (including domestic abuse)": "1. Poor",
        "Overall Police Recorded Crime": "2. Moderate",
        "Sexual offences": "1. Poor"
    }
</script>

<g class="column-group">
  {#each $data as d, i}
    {@const colHeight = columnHeight(d)}
    {@const xGot = $xGet(d)}
    {@const xPos = Array.isArray(xGot) ? xGot[0] : xGot}
    {@const colWidth = $xScale.bandwidth ? $xScale.bandwidth() : columnWidth(d)}
    {@const yValue = $y(d)}
    <rect
      class='group-rect'
      data-id="{i}"
      data-range="{$x(d)}"
      data-count="{yValue}"
      x="{xPos}"
      y="{$yGet(d)}"
      width="{colWidth}"
      height="{colHeight}"
      fill={(data_qual_lu[d.type]) ? keyColors[data_qual_lu[d.type]] : "#92D2E990"}
      {stroke}
      stroke-width="{strokeWidth}"
    />
    {#if showLabels && yValue}
      <text x="{xPos + colWidth / 2}" y="{$height - colHeight - 5}" text-anchor="middle">{yValue}</text>
    {/if}
  {/each}
</g>

<style>
  text {
    font-size: 12px;
  }
</style>