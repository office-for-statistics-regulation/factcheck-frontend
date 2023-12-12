<script>

  import Line from '$lib/charts/line/+page.svelte'

	export let data;
  console.log("data", data)

  // Helper function to find an object by date in the transformed array
  function findByDate(arr, date) {
    return arr.find(item => item.date === date);
  }

  // Use a reducer to count topics by date
  var data_line = data.rows_merged_all_30[0];

  // Function to transform the array
  function transformArray(arr) {
    const result = [];
    arr.forEach(tweet => {
      const existingDateObj = findByDate(result, tweet.date_created);
      if (existingDateObj) {
        existingDateObj[tweet.topic] = (existingDateObj[tweet.topic] || 0) + 1;
      } else {
        const newObj = {
          date: tweet.date_created,
          [tweet.topic]: 1
        };
        result.push(newObj);
      }
    });
    return result;
  }

  data_line = transformArray(data_line);

  function transformDateFormat(dateStr) {
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
  }

  function formatData(arr) {
    let all_topics = arr.map(e => Object.keys(e)).flat();
    let uniques = [...new Set(all_topics)].filter(e => e != "date");

    arr.forEach(e => {
      e['date'] = transformDateFormat(e['date'])
      let e_keys = Object.keys(e);
      uniques.forEach(u => {
        if (!e_keys.includes(u)) {
          e[u] = 0;
        }
      })
    })

    arr.sort((a, b) => new Date(a.date) - new Date(b.date));

    return arr
  }

  data_line = formatData(data_line);

  console.log("data_line", data_line)

</script>


<!-- 
<h1>Twitter Dashboard</h1>


<div style="width: 90%; max-width: fit-content; margin: 0 auto; display:flex;">
  <a href="/dashboard/retweets" style="text-decoration: none;">
    <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/retweets")}>Recent Retweets</div>
  </a>
  <a href="/dashboard/topics" style="text-decoration: none;">
    <div class="dash-link" class:shadedBox={(currentPath=="/dashboard/topics")}>30 Day Topic Trends</div>
  </a>
</div> -->

<br>

<Line data={data_line} />
<br>

<style>

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