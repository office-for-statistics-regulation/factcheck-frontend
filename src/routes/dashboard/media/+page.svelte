<script>

  import Line from '$lib/charts/line/+page.svelte'

	export let data;
  var table = data.rows[0];

  console.log("table 1", table)

  function transformDateFormat(dateStr) {
    console.log("dateStr", dateStr)
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
  }

  function groupAndTally(arr) {
    const result = arr.reduce((acc, item) => {
      let t_date = transformDateFormat(item.date);
        // Check if an object for this 'a' value already exists in the accumulator
        let group = acc.find(g => g.date === t_date);

        // If it doesn't exist, create a new object and add it to the accumulator
        if (!group) {
            group = { date: t_date };
            acc.push(group);
        }

        // Tally the occurrences of 'b' values
        if (!group[item.domain]) {
            group[item.domain] = 0;
        }
        group[item.domain] += 1;

        return acc;
    }, []);
    result.sort((a, b) => new Date(a.date) - new Date(b.date));
    return result;
  }

  table = groupAndTally(table)

  console.log("table 2", table)

</script>


  <div class="table-cont">
    <h2>Last 7 Days</h2>
    <br>
    <br>
    {#if data}
      <Line data={table}/>
    {/if}
  </div>

<style>
  .shadedBox {
    background-color: rgba(215, 215, 215, 0.572);
  }
  .dash-link {
    text-decoration: none;
    border: #ccc 1px solid;
    padding: 10px;
    margin: 5px;
  }
  .table-flex {
    display: flex;
    flex-direction: row;
  }
  .table-cont {
    margin: 5px;
  }
  h2 {
    font-size: large;
    width: max-content;
    margin: auto;
  }
  .choose-but {
    background-color: transparent;
    margin: 10px;
    cursor: pointer;
  }
  .but-flex {
    display: flex;
    width: max-content;
    margin: auto;
  }


  @media (max-width: 1400px) {
    .table-flex {
      flex-direction: column;
    }
  }
</style>