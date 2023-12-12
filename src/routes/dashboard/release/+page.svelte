<script>
	export let data;
  var table = data.rows[0];

  console.log("table", table)

  table = table.sort((a, b) => b.Date - a.Date)

  console.log("table", table)

</script>


  <div class="table-cont">
    <h2>Last 7 Days</h2>
    <br>
    <br>
    <table style="margin: auto;">
        <thead>
          <tr>
            <th>Publication</th>
            <th>Description</th>
            <th>Organisation</th>
            <th>Status</th>
            <th style="width:130px;">Date</th>
          </tr>
        </thead>
        <tbody>
          {#each table as item }
            <tr>
                <td>{item.Publication}</td>
                <td>{item.Description}</td>
                <td>{item.Organisation}</td>
                <td>{item.Status}</td>
                <td>{item.Date}</td>
            </tr>
          {/each}
        </tbody>
    </table>
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