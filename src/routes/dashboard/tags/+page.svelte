<script>
	export let data;
  var table = data.rows[0];

  // function tally(data) {
  //     return data.reduce((acc, item) => {
  //         // Find an item in acc (accumulator) that has the same word
  //         const found = acc.find(x => x.user_screen_name === item.user_screen_name);
          
  //         if (found) {
  //             // If found, add to its 'n'
  //             found.n += item.n;
  //         } else {
  //             // If not found, push a new item
  //             acc.push({ ...item }); // Using spread to avoid mutating the original data
  //         }
          
  //         return acc;
  //     }, []);
  // }

  // table = tally(table)
  // table = table.sort((a, b) => b.n - a.n)
  // table = table.filter(e => e.n>0)

  console.log("table", table)

</script>


  <div class="table-cont">
    <h2>Last 7 Days</h2>
    <br>
    <br>
    <table style="margin: auto;">
        <thead>
          <tr>
            <th>Screen Name</th>
            <th>Date</th>
            <th>Text</th>
            <th>Topic</th>
          </tr>
        </thead>
        <tbody>
          {#each table as item}
            <tr>
                <td>{item.user_screen_name}</td>
                <td>{item.date_created}</td>
                <td>{item.text}</td>
                <td>{item.topic}</td>
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
    margin: 5px auto;
    max-width: 1200px;
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