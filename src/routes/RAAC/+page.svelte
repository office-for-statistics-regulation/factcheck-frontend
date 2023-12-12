<script>
    import { onMount } from 'svelte';

    var raac;
    $: console.log("raac", raac)
    onMount(async() => {
        raac = await fetch(`./data/raac.json`).then( res => res.json());
        raac = raac.filter(e => Object.keys(e).includes('stats') )
        raac.forEach(e => {
            e['date'] = "1 month ago"
        })
        console.log("raac", raac)
    })

</script>

{#if raac}
<br>
<h1>
    RAAC Media Reporting
</h1>
<br>
    <table>
        <thead>
            <tr>
                <th>
                    Source
                </th>
                <!-- <th>
                    Date
                </th> -->
                <th>
                    Link
                </th>
                <th>
                    Claims
                </th>

            </tr>
        </thead>
        <tbody>
            {#each raac as item (item.text)}
                <tr>
                    <td>
                        {item.text.split(" || ")[0] + ": " + item.text.split(" || ")[5]}
                    </td>
                    <!-- <td>
                        {}
                    </td> -->
                    <td>
                        <a href="{item.link}">{item.text.split(" || ")[2]}</a>
                    </td>
                    <td>
                        <ul>
                            {#each item.stats as claim}
                                <li>{claim}</li>
                            {/each}
                        </ul>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
{/if}