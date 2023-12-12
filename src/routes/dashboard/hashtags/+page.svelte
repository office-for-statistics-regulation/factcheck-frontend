<script>
    import Bar from '$lib/charts/bar-hor/+page.svelte'
  	export let data;
    let rows = data.rows_24[0];

    function tally(data) {
      return data.reduce((acc, item) => {
          // Find an item in acc (accumulator) that has the same word
          const found = acc.find(x => x.word === item.word);
          
          if (found) {
              // If found, add to its 'n'
              found.n += item.n;
          } else {
              // If not found, push a new item
              acc.push({ ...item }); // Using spread to avoid mutating the original data
          }
          
          return acc;
      }, []);
    }

  let tallied_rows = tally(rows)
  let sorted_rows = tallied_rows.sort((a, b) => b.n - a.n)


    console.log("sorted_rows", sorted_rows)
</script>
<Bar data={sorted_rows}/>
