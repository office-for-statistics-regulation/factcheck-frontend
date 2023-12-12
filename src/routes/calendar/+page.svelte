<script>

	export let data
    let table = [];
    console.log("table", table)

    $: if (data) {
        data.rows[0].forEach(e => {
            if (!table.map(f => f['Link']).includes(e['Link'])) {
                table.push(e)
            }
        })
    }

    // import { onMount } from "svelte";
	// onMount(async () => {
	// });

    $: console.log("table", table)
</script>

<h1>Statistics Release Calendar</h1>
<br>
<table>
    <thead>
      <tr>
        <th>Publication</th>
        <th>Description</th>
        <th>Date</th>
        <th>Document Type</th>
        <th>Organisation</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      {#each table as item (item.Publication)}
        <tr>
            <td>
                <a href={item.Link} target="_blank">
                    {item.Publication}
                </a>
            </td>
            <td>{item.Description}</td>
            <td>{item.Date}</td>
            <td>{item.Document_type}</td>
            <td>{item.Organisation}</td>
            <td>{item.Status}</td>
        </tr>
      {/each}
    </tbody>
</table>
