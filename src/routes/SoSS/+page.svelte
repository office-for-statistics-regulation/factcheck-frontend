<script>
    import { onMount } from 'svelte';

    import Bar from '$lib/charts/bar-soss/+page.svelte'
    import BarGrouped from '$lib/charts/grouped-bar2/App.svelte'
    import StackedBar from '$lib/charts/stacked-bar/+page.svelte'
    import Line from '$lib/charts/line/+page.svelte'

    var soss_raw, pub_number, cats, bar_data, line_data, highest_month;

    function roundTo10(x) {
        return Math.round( x / 10 ) * 10;
    }

    function renameKey(array, oldKey, newKey) {
        array.forEach(obj => {
            if (oldKey in obj) {
                obj[newKey] = obj[oldKey];
                delete obj[oldKey];
            }
        });
        return array;
    }

    function transformDateFormat(dateStr) {
        const date = new Date(dateStr);
        const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        return formattedDate
    }


    function findHighestOverallMonth(data) {
        let highestValue = 0;
        let highestMonth = '';
        
        data.forEach(item => {
            if (item.Overall && item.Overall > highestValue) {
                highestValue = item.Overall;
                highestMonth = item.date;
            }
        });

        // Convert the date to a more readable format (e.g., "April 2023")
        const date = new Date(highestMonth);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        return [month, year, highestValue];
    }



    onMount(async() => {
        soss_raw = await fetch(`./data/soss.json`).then( res => res.json());
        console.log("soss_raw", soss_raw);
        pub_number = soss_raw.filenames.length
        cats = soss_raw.cat_count;
        let entries = Object.entries(cats);
        entries.sort((a, b) => b[1] - a[1]);
        cats = Object.fromEntries(entries);

        bar_data = []
        Object.keys(cats).forEach(e => {
            bar_data.push({'type': e, 'value': cats[e]})
        })

        line_data = soss_raw.months;
        line_data = renameKey(line_data, "month", "date")
        line_data.forEach(e => {
            e['date'] = transformDateFormat(e['date'])
        })

        line_data.sort((a, b) => new Date(a.date) - new Date(b.date));

        highest_month = findHighestOverallMonth(line_data)
        
        console.log("highest_month", highest_month)

    })


</script>

<h1>State of the Statistical System</h1>

<h2>ONS publications in 2023</h2>

{#if cats}
    <div style="max-width: 820px;margin:0 auto;">
        <p>
            There have been approximately {roundTo10(pub_number)} ONS publications in the financial year 2023-2024 so far.
        </p>
        <p>
            There were around {roundTo10(cats[Object.keys(cats)[0]])} publications categorised as {Object.keys(cats)[0]}, making it the largest category of publication. The second largest category was {Object.keys(cats)[1]} with {roundTo10(cats[Object.keys(cats)[1]])} publications. These figures are based on a GPT classification as the original ONS website taxonomy is not saved to the database of publications.
        </p>
        <br>
        <h3>Number of publication by type of statistic in the financial year 2023-2024</h3>
        <div style="width:90%;max-width:900px;margin:50px auto 200px;">
            <Bar data={bar_data}></Bar>
        </div>
        <p>
            The month with the highest number of publications was {highest_month[0]} {highest_month[1]} with {highest_month[2]} publications.
        </p>
        <div style="width:100%;max-width:900px;margin:50px auto 200px;">
            <Line data={line_data} />
        </div>
    </div>

{/if}









<style>
    .clickedDiv {
        background: #b7ecff60;
    }
    :global(main) {
        max-width: none !important;
    }
    .container {
        width: 80%; /* Adjust the container width as needed */
        margin: 0 auto; /* Center the container on the page */
        text-align: center;
    }


    .typesdiv {
        width: fit-content;
        padding: 10px;
        border: #ccc 1px solid; /* Set the background color as needed */
        margin: 10px; /* Add some margin between the boxes */
        display: inline-block;
        border-radius: 10px;
        cursor: pointer;
    }

    :global(rect) {
        stroke: black;
        stroke-width: 1px;
    }
</style>