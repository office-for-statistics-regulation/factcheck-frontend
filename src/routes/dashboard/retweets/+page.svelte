<script>
	export let data;
  console.log("data", data)
  let table_merged_24 = [];
  let table_merged_all = [];

  $: if (data) {
    data.rows_merged_24[0].forEach(e => {
      if (!table_merged_24.map(f => f['text']).includes(e['text'])) {
        table_merged_24.push(e)
      }
    })
    table_merged_24.sort((obj1, obj2) => obj2.retweets - obj1.retweets);
    table_merged_24 = table_merged_24;


    data.rows_merged_all[0].forEach(e => {
      if (!table_merged_all.map(f => f['text']).includes(e['text'])) {
        table_merged_all.push(e)
      }
    })
    table_merged_all.sort((obj1, obj2) => obj2.retweets - obj1.retweets);
    table_merged_all = table_merged_all;

  }

</script>


  <div class="table-flex">
    <div class="table-cont">
      <h2>Last 48 Hours</h2>
      <br>
      <table>
          <thead>
            <tr>
              <th>Text</th>
              <th>Topic</th>
              <th>Date</th>
              <th>Fav</th>
              <th>Retwe</th>
            </tr>
          </thead>
          <tbody>
            {#each table_merged_24 as item (item.text)}
              <tr>
                  <td>{item.text}</td>
                  <td>{item.topic}</td>
                  <td>{item.date_created}</td>
                  <td>{item.favourites}</td>
                  <td>{item.retweets}</td>
              </tr>
            {/each}
          </tbody>
      </table>
    </div>
    <div class="table-cont">
      <h2>Last 7 Days</h2>
      <br>
      <table>
          <thead>
            <tr>
              <th>Text</th>
              <th>Topic</th>
              <th>Date</th>
              <th>Fav</th>
              <th>Retwe</th>
            </tr>
          </thead>
          <tbody>
            {#each table_merged_all as item (item.text)}
              <tr>
                  <td>{item.text}</td>
                  <td>{item.topic}</td>
                  <td>{item.date_created}</td>
                  <td>{item.favourites}</td>
                  <td>{item.retweets}</td>
              </tr>
            {/each}
          </tbody>
      </table>
    </div>
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