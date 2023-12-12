<script>
    import { onMount } from 'svelte';

    import Bar from '$lib/charts/bar/+page.svelte'
    import BarGrouped from '$lib/charts/grouped-bar2/App.svelte'
    import StackedBar from '$lib/charts/stacked-bar/+page.svelte'
    import Line from '$lib/charts/line/+page.svelte'

    var prc_raw, prc, types, type_data, types_bar_data, manual_data, data_line;

    // Helper function to find an object by date in the transformed array
    function findByDate(arr, date) {
        return arr.find(item => item.date === date);
    }

    // Function to transform the array
    function transformArray(arr) {
        const result = [];
        arr.forEach(record => {
            const existingDateObj = findByDate(result, record.release_date);
            if (existingDateObj) {
                existingDateObj[record.ensemble] = (existingDateObj[record.ensemble] || 0) + 1;
            } else {
                const newObj = {
                date: record.release_date,
                [record.ensemble]: 1
                };
                result.push(newObj);
            }
        });
        return result;
    }

    function transformDateFormat(dateStr) {
        // Parse the date string to a Date object
        const date = new Date(dateStr);

        // const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', timeZoneName: 'short' };
        // const formattedDate = date.toLocaleDateString('en-GB', options) + " " + date.toLocaleTimeString('en-GB', { timeZone: 'GMT', hour12: false }) + " GMT+0000 (Greenwich Mean Time)";
        const formattedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;


        return formattedDate


        const [day, month, year] = dateStr.split(" ");
        return `${year}-${month}-${day}`;
    }

    function formatData(arr) {
        arr.sort((a, b) => new Date(a.date) - new Date(b.date));

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

        console.log("arr", arr)

        return arr
    }


    onMount(async() => {
        prc_raw = await fetch(`./data/prc.json`).then( res => res.json());
        prc_raw = prc_raw.filter(e => e['sections'].length > 0 );
        // prc_raw.forEach(e => {
        //     if (Object.keys(e).includes('release_date')) {
        //         e.release_date = e.release_date.split("—")[0].trim();
        //     }
        // });
        console.log("prc_raw", prc_raw)
        type_data = countElementsType(prc_raw.map(e => e.offence_type_map));
        prc = prc_raw;
        types = prc.map(e => e.offence_type_map);
        types = [...new Set(types)];
        types_bar_data = types.map(e => ({type: e, value: type_data[e]}));
        types_bar_data.sort((a, b) => b.value - a.value);
        manual_data = prc_raw.filter(e => e.manual != "None");

        // let prc_forline = prc_raw
        // prc_forline.forEach(e => {
        //     e.ensemble = ens_lu[e.ensemble]
        // })

        data_line = transformArray(prc_raw);
        data_line = formatData(data_line);

        console.log("data_line", data_line)
    })

    var selected = "All";
    function clicked(type) {
        if (type==selected) {
            type = "All"
        }
        selected = type
        if (type=="All") {
            prc = prc_raw
        } else {
            prc = prc_raw.filter(e => e['offence_type_map'] == type)
        }
    }

    const keyColors = ['#FC76A690', '#92D2E990', '#AECD7090'];

    var ensemble_lookup = {
        "1": "1. Poor", 
        "2": "2. Moderate", 
        "3": "3. Good"
    }

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

    let manual = false
    function makeManual() {
        manual = !manual
        if (manual) {
            prc = prc_raw.filter(e => e.manual != "None")
        }
        else {
            prc = prc_raw
        }
    }

    function countElements(arr) {
        // Create an empty object to store the counts
        const counts = {
            "1. Poor": 0,
            "2. Moderate": 0,
            "3. Good": 0            
        };

        // Iterate through the array
        for (const element of arr) {
            // If the element is not in the counts object, initialize it with a count of 1
            if (!counts[element]) {
            counts[element] = 1;
            } else {
            // If the element is already in the counts object, increment its count
            counts[element]++;
            }
        }

        return counts;
    }

    function countElementsType(arr) {
        // Create an empty object to store the counts
        const counts = {}

        // Iterate through the array
        for (const element of arr) {
            // If the element is not in the counts object, initialize it with a count of 1
            if (!counts[element]) {
            counts[element] = 1;
            } else {
            // If the element is already in the counts object, increment its count
            counts[element]++;
            }
        }

        return counts;
    }


    var summary, sources_summary;


    $: if (prc) {
        summary = {
            "Actual": countElements(prc.map(e => data_qual_lu[e.offence_type_map])),
            "Reported": countElements(prc.map(e => ensemble_lookup[e.ensemble]))
        }
        let sources_summary_counts = countElementsType(prc.map(e => e.site));
        let sources_summary_counts_p = countElementsType(prc.filter(e => e.ensemble == 1).map(e => e.site));
        let sources_summary_counts_m = countElementsType(prc.filter(e => e.ensemble == 2).map(e => e.site));
        let sources_summary_counts_g = countElementsType(prc.filter(e => e.ensemble == 3).map(e => e.site));
        let sources_summary_counts_keys = Object.keys(sources_summary_counts);

        sources_summary = []
        sources_summary_counts_keys.forEach(e => {
            sources_summary.push({
                type: e, 
                value: sources_summary_counts[e], 
                Poor: (sources_summary_counts_p[e])?sources_summary_counts_p[e]:0, 
                Moderate: (sources_summary_counts_m[e])?sources_summary_counts_m[e]:0,
                Good: (sources_summary_counts_g[e])?sources_summary_counts_g[e]:0, 
            })
        })

        sources_summary.sort((a, b) => b.value - a.value);
        sources_summary = sources_summary.filter(e => e.type.length>0);
        sources_summary = sources_summary.slice(0,12);
    }

    let perc_good;
    let in_reality;
    $: if (summary) {
        perc_good = Math.round(100 * summary.Reported['3. Good']/ (summary.Reported['1. Poor']+summary.Reported['2. Moderate']+summary.Reported['3. Good']))
        in_reality = Math.round(100 * summary.Actual['3. Good']/ (summary.Actual['1. Poor']+summary.Actual['2. Moderate']+summary.Actual['3. Good']))
    }

    let pub1, pub1_perc, pub2, pub2_perc;
    $: if (sources_summary) {
        pub1 = sources_summary[0];
        pub1_perc = Math.round(100*pub1.Good/pub1.value);
        pub2 = sources_summary[1];
        pub2_perc = Math.round(100*pub2.Good/pub2.value);
    }

    var dispAll = false;


</script>

<h1>Online Reporting of Police Recorded Crime</h1>
<div style="max-width: 820px;margin:auto;">
    <p>Crimes relating to sexual offences were the most frequently reported of Police Recorded Crime (PRC) statistics between January 2019 and August 2023. Of 240 instances of PRC statistics that were identified in online articles in this time period, 61 records relate to sexual offences.</p>
    <p>Homicide was next most prevelant type of offence (with 51 records) followed by offences involving knives or sharp instruments (45) and overall numbers of Police Recorded Crime (42).</p>
    <p>Of the 240 articles that were collected, 18 included a link back to the original ONS publication.</p>
</div>

{#if types_bar_data}
<h2>Number of media reports by offence type</h2>
<div style="width: max-content; margin: auto;">
    <h3 style="width: max-content; margin: auto;">
        Underlying Data Quality
    </h3>
    <div style="display: flex; align-items: center;">
        <div style="display: flex; align-items: center; margin:5px;">
            <div style="width:10px; height: 10px; border: black solid 1px; border-radius: 10px;background: #FC76A690"></div><p style="margin:5px;">1. Poor</p>
        </div>
        <div style="display: flex; align-items: center;margin:5px;">
           <div style="width:10px; height: 10px; border: black solid 1px; border-radius: 10px;background: #92D2E990"></div> <p style="margin:5px;">2. Moderate</p>
        </div>
        <div style="display: flex; align-items: center;margin:5px;">
            <div style="width:10px; height: 10px; border: black solid 1px; border-radius: 10px;background: #AECD7090"></div><p style="margin:5px;">3. Good</p>
        </div>
    </div>    
</div>
<br>
<div style="width:90%;max-width:720px;margin:auto;height:500px;">
    <Bar data={types_bar_data} {types}/>
</div>
<br>
<br>
<br>
<div style="max-width: 820px;margin:auto;">
    <p>According to the data quality framework outlined in ONS's <a href="https://www.ons.gov.uk/peoplepopulationandcommunity/crimeandjustice/methodologies/userguidetocrimestatisticsforenglandandwalesmeasuringcrimeduringthecoronaviruscovid19pandemic#offence-types">User guide to crime statistics for England and Wales</a>, sexual offence statistics have a "poor" reliability rating and the Crime Survey for England and Wales (CSEW) is identified as the preferred source of statistics for these types of crime.</p>
    <p>Homicide statistics are marked as "Good" on the three point reliability rating, while statistics on offences involving knives or sharp instruments are considered "moderate".</p>
    <p>To quantify the degree to which online articles were accurately explaining the reliability of different statsistics, I developed a model that uses GPT-4 to attribute each article excerpt with a score using the same data quality framework. More details about the method can be found at the <a href="/PRC#method">end of this report</a>.</p>
</div>
{/if}

{#if prc}
<br>
{#if summary}

{#if types}
    <br>
    <!-- <h1>Types of offence</h1> -->
    <h1>Data Quality vs Reported Quality</h1>
    <div class="container">
        {#each types as type}
            <div class="typesdiv" on:click={clicked(type)} class:clickedDiv={selected==type}>
                <p style="margin: 0;">
                    {type}
                </p>
            </div>
        {/each}
        <div class="typesdiv" on:click={() => clicked("All")} class:clickedDiv={selected=="All"}>
            <p style="margin: 0;">
                All
            </p>
        </div>
    </div>
{/if}



<!-- {#if selected}
    <h2>Offence Type: {selected}</h2>
{/if} -->

{#if summary}
    <div style="max-width: 820px;margin:auto;">
        <br>
        <p>The chart on the left shows the numbers of online articles reporting PRC broken down by the underlying data quality of the statistics. The right chart shows same records broken down by the level of data quality conveyed in the online article.</p>
        <p>As we can see, when looking at <i>{selected.toLowerCase()}</i> data, statistics are communicated as being "Good" {perc_good}% of the time. In reality, the underlying data quality is "Good" in {in_reality}% of records.</p>
    </div>
    <h2>Distribution of Data Quality</h2>
    <div style="width:90%;max-width:720px;margin: 0 auto 50px;">
        <BarGrouped data_new={summary}/>
    </div>
{/if}
<table style="width: 600px; margin: auto;">
    <thead>
      <tr>
        <th></th> <!-- Empty cell for row labels -->
        {#each Object.keys(summary) as category}
          <th>{category}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each ["1. Poor", "2. Moderate", "3. Good"] as label, i}
        <tr style="background: {keyColors[i]};">
          <td>{label}</td> <!-- Row label -->
          {#each Object.keys(summary) as category}
            <td>{(summary[category][label]) ? summary[category][label] : 0}</td> <!-- Data cell -->
          {/each}
        </tr>
      {/each}
    </tbody>
</table>
{/if}

    {#if sources_summary}
        <br>
        <h2>Crime Reportage by Publication</h2>

        <div style="max-width: 820px;margin:auto;">
            <br>
            <p>Among <i>{selected.toLowerCase()}</i> data records, <i>{pub1.type}</i> is the most represented publication with {pub1.value} articles, of which {pub1_perc}% described the data in such a way that suggested the statistics were of good quality.</p>
            <p>The next most represented publication is <i>{pub2.type}</i> with {pub2.value} articles and {pub2_perc}% describing the data as being of good quality.</p>
        </div>

        <br>

        <h3>Bar colour represents the level of data quality conveyed in media reports</h3>
        <br>
        <br>
        <!-- <div style="width:90%;max-width:720px;margin:auto;height:500px;">
            <Bar data={sources_summary}/>
        </div> -->
        <div class="stackedbar-cont" style="width:90%;max-width:720px;margin:auto;height:500px;">
            <StackedBar {sources_summary}/>
        </div>
    {/if}

    <h2>No discernable changes over time</h2>
    <h3 style="width:1100px;">The number of articles conveying PRC as either "Poor", "Moderate" or "Good" at each quarter since the start of 2019</h3>

    <br>

    <Line data={data_line} prc={true}/>

    <br>
    <br>

    <div style="max-width: 820px;margin:auto;">
        <p>Both the overall number of articles reporting on PRC and the numbers broken down by level of data quality conveyed in the reporting fluctuated at a relatively stable rate across the time span measured.</p>
    </div>

    <br>

    <h1>Data Table</h1>
    {#if (dispAll)}
        <div>
            <p style="text-align: center;text-decoration:underline;cursor:pointer;" on:click={() => dispAll = !dispAll}>Display fewer rows</p>
        </div>
    {/if}
    <table style="font-size: small;width:95%;margin:auto;">
        <thead>
            <tr>
                <th>
                    Media Claim
                </th>
                <th>
                    Type
                </th>
                <th>
                    Link
                </th>
                <th>
                    Base
                </th>
                <th>
                    Ensemble
                </th>
                <th>
                    Backlink
                </th>
                <th>
                    Source
                </th>
            </tr>
        </thead>
        <tbody>
            {#if dispAll}
                {#each prc as item}
                    <tr>
                        <td>
                            {item.sections.slice(0,200)+"..."}
                        </td>
                        <td>
                            {item.offence_type_map}
                        </td>
                        <td>
                            <a href="{item.link}">{item.site + ", " + item.media_date}</a>
                        </td>
                        <td>
                            {data_qual_lu[item.offence_type_map]}
                        </td>
                        <td>
                            {ensemble_lookup[item.ensemble]}
                        </td>
                        <td>
                            {(item.linksBack.length>0)?"Yes":"No"}
                        </td>
                        <td>
                            <a href="{item.sourceLink}">{"ONS: "+item.release_date}</a>
                        </td>
                    </tr>
                {/each}
            {:else}
                {#each prc.slice(0,5) as item}
                    <tr>
                        <td>
                            {item.sections.slice(0,200)+"..."}
                        </td>
                        <td>
                            {item.offence_type_map}
                        </td>
                        <td>
                            <a href="{item.link}">{item.site + ", " + item.media_date}</a>
                        </td>
                        <td>
                            {data_qual_lu[item.offence_type_map]}
                        </td>
                        <td>
                            {ensemble_lookup[item.ensemble]}
                        </td>
                        <td>
                            {(item.linksBack.length>0)?"Yes":"No"}
                        </td>
                        <td>
                            <a href="{item.sourceLink}">{"ONS: "+item.release_date}</a>
                        </td>
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
    {#if (!dispAll)}
        {#if prc.length-5>0}
            <div>
                <p style="text-align: center;text-decoration:underline;cursor:pointer;" on:click={() => dispAll = !dispAll}>{prc.length-5} more records not displayed. Click to see all records.</p>
            </div>
        {/if}
    {:else}
        <div>
            <p style="text-align: center;text-decoration:underline;cursor:pointer;" on:click={() => dispAll = !dispAll}>Display fewer rows</p>
        </div>
    {/if}




    <div style="max-width: 820px;margin:auto;">
        <h1 id="method">Method</h1>
        <h2>Data Collection</h2>
        <p>Constructing a dataset focussed on online articles that reported on PRC statistics posed challenges as such articles comprise only a small percentage of the UK media's crime reporting.</p>
        <p>To target relavant articles, I developed an automated search tool that using Selenium with Python to search Google for articles that include figures from each of ONS's quartely PRC releases going back to the start of 2019.</p>
        <p>The search tool initially scrapes the ONS site for PRC releases and then uses GPT-4 (OpenAI API) to extract key figures and their associated offence type.</p>
        <p>Each of these figures are then used to construct a Google search query, such as:</p>
        <div style="padding: 5px;background: white;font-family: system-ui;">"670" homicides in England and Wales</div>
        <p>Each article is retrieved from the search and the key figure is extracted, along with relevant context, and pre-processed for analysis.</p>
        <br>
        <h2>Data Analysis</h2>
        <p>Each record is assigned the appropriate reliability score based on the crime statistics data quality framework to represent the underlying quality of the statistic that is being reported, e.g. a record reporting on a homicide statistic will be assigned a "Base" value of "Good".</p>
        <p>Whether of not the online article includes backlinks to the original ONS report is identified. It's useful to understand which publications provide links, as it provides readers with an accessible route to read more about the wider context and caveats associated with the data.</p>
        <p>We also assign each record with a score that represents the degree of data quality communicated in the article according to the output of an ensemble model. For example, a news report about sexual offence statistics that describes the data as somewhat reliable would be assigned an "Ensemble" value of "Moderate", even though the underlying data quality is actually "Poor".</p>
        <h2>Ensemble Model</h2>
        <p>The model uses GPT-4 to generate three different labels assessing the data quality (either "Poor", "Moderate" or "Good"), as conveyed by the writer of each online article. These three labels are then used to vote on an overall ensemble score for eacg record.</p>
        <p>The three labels are generated using slightly difference prompts and slightly different hyperparameters, for instance adjusting 'temperature' in order to affect the degree of randomness in the GPT output.</p>
        <p>All of the prompts provide the relevant article extract along with the following context about the data quality framework:</p>
        <div style="padding: 5px;background: white;font-family: system-ui;">
            <p>
                We are assessing how well news reports explain data quality issues.
            </p>
            <p>
                Using the following framework, we want to know whether the report presents the statistic as:
            </p>
            <p>
                1. Poor: This category denotes situations where data is largely incomplete, inadequately reported, or hampered by significant margins of error, thus offering low reliability for solid conclusions or insights.
            </p>
            <p>
                2. Moderate: This category signifies situations where data is more comprehensive and reliable than the poor category, but still features a level of uncertainty or limitations that might affect interpretation and usage of the information.
            </p>
            <p>
                3. Good: This category represents situations where data is reliable, well-reported, and thoroughly validated, offering a high level of reliability for strong conclusions and insights. It also indicates a low likelihood of significant changes in the data recording practice.
            </p>
        </div>
        <br>
        <h2>Model Evaluation</h2>
        <p>
            To understand how effective the ensemble model was at assessing the data quality communicated in the online article, 12 records were ramdomly selected and manually assessed.
        </p>
        <p>Based on the manual assessment, the ensemble model correctly identified the data quality level communicated in each of the 12 records.</p>
        <table style="font-size: small;">
            <thead>
                <tr>
                    <th>
                        Media Claim
                    </th>
                    <th>
                        Manual
                    </th>
                    <th>
                        Ensemble
                    </th>
                </tr>
            </thead>
            <tbody>
                {#each manual_data as item}
                    <tr>
                        <td>
                            {item.sections.slice(0,200)+"..."}
                        </td>
                        <td>
                            {item.manual}
                        </td>
                        <td>
                            {ensemble_lookup[item.ensemble]}
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
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