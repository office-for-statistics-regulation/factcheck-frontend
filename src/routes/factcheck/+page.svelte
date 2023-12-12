<script>
	import { enhance } from "$app/forms";
  let loading = false;
  let summary = false;
  let documents = false;
  let meta = false;
  let t_f_u = false;
  let snips = false;
  let text_check=''
  let error = false;
  let direction = `Verify whether the statement is true and accurate based on the provided snippets, and if the claim is not confirmed by the snippets, say "I don't know".`

	let questions = [
		`Verify a statement`,
		`Ask a question`,
		`Assess the quality`
	];

	let selected;
	let answer = '';

	const options = [{
		value: '1. Rough estimate',
		label: 'Rough estimate',
	}, {
		value: '2. Satisfactory estimate',
		label: 'Satisfactory estimate',
	}, {
		value: '3. Suitable estimate',
		label: 'Suitable estimate',
	}, {
		value: '4. Good estimate',
		label: 'Good estimate',
	}, {
		value: '5. Excellent estimate',
		label: 'Excellent estimate',
	}]
	const slugify = (str = "") =>
    	str.toLowerCase().replace(/ /g, "-").replace(/\./g, "");

	let userSelected = options[0].value;

  const sources = [
    {
      value: "Department for Work and Pensions",
      label: "Department for Work and Pensions"
    },
    {
      value: "Office for National Statistics",
      label: "Office for National Statistics"
    }
  ]
  let sourceSelected = ["Department for Work and Pensions", "Office for National Statistics"];

</script>

<div style="width: 70%;max-width: 820px; margin: 50px auto;">
<!-- <a href="/">Back</a> -->
<h1>
	Check a Statistic
</h1>
<h2>
  This system queries a database of publications that are in the public domain before connecting with a third party API. Please do not input any sensitive data.
</h2>
<form action="?/summarize" method="post" use:enhance={async () => {
	loading = true;
	return async ({ result, update }) => {
	  if(result.status === 200){
		if (selected == "Assess the quality") {
			console.log("result.data", result.data)
			summary = JSON.parse(result.data).text;
		} else {
			console.log("ELSE", result.data)
			summary = JSON.parse(result.data).text;
			t_f_u = JSON.parse(result.data).t_f_u;
			documents = JSON.parse(result.data).documents;
			meta = JSON.parse(result.data).meta;
			snips = JSON.parse(result.data).snips;
		}
	  } else {
		error = true;
	  }
	  loading = false;
	};
  }}>
  <!-- <label for="direction">Command</label>
  <textarea name="direction"  bind:value={direction} style="width:100%; margin: 5px 0;"></textarea><br> -->

  	<select name="text_select" bind:value={selected} on:change={() => (answer = '')}>
		{#each questions as question}
			<option value={question}>
				{question}
			</option>
		{/each}	
	</select>
  <br>
  <br>
  <hr>
  <br>
  <label for="text_check">Query</label>
  <input name="text_check"  bind:value={text_check} style="width:100%; margin: 5px 0;">
  <br>


  <!-- {#if selected != "Assess the quality"}
    <br>
    <div role="radiogroup" 
    class="group-container"
    aria-labelledby={`label-1`}
    style="font-size:14px; flex-direction:column" 
    id={`group-1`}>


      <div class="legend" 
        id={`label-1`}>Source
      </div>


      {#each sources as { value, label }}
        <label for={slugify(label)}> 
          <input
            class="box-select"
            type="checkbox"
            name="box_check"
            id={slugify(label)}
            bind:group={sourceSelected}
            value={value} />
          {label} 
        </label>

      {/each}
    </div>
  {/if} -->


  {#if selected == "Assess the quality"}
    <br>
  	<div role="radiogroup" 
		class="group-container"
		aria-labelledby={`label-1`}
		style="font-size:14px; flex-direction:column" 
		id={`group-1`}>
			<div class="legend" 
				id={`label-1`}>What level of quality is supposed to be conveyed
			</div>
			{#each options as { value, label }}
				<input
					class="sr-only"
					type="radio"
					name="radio_check"
					id={slugify(label)}
					bind:group={userSelected}
					value={value} />
				<label for={slugify(label)}> {label} </label>
			{/each}
		</div>
	{/if}

  <br>
  <button  aria-busy={loading} type="submit" value={direction}>{loading ? "Please Wait..." : "Check"}  </button>
</form>
<br>

{#if selected == "Assess the quality"}
	{#if summary}
		<p>
			{summary}
		</p>
	{/if}
{/if}

<!-- {#if meta}
	<div style="background: {(selected=="Verify a statement")?((t_f_u=="True")?"#8FD694":(t_f_u=="False")?"#FE5F55":"silver"):"hsl(224, 44%, 95%)"}; border-radius: 10px; padding: 5px;">
	  <p>{summary}</p>
	  <a href="{meta.URL}">{meta.Filename.replace(".txt", "")}</a>
	</div>
	{#each snips.split("\n") as s}
		<p>{s}</p>
	{/each}
{/if} -->
{#if meta}
	<div style="background: {(selected=="Verify a statement")?((t_f_u=="True")?"#8FD694":(t_f_u=="False")?"#FE5F55":"silver"):"hsl(224, 44%, 95%)"}; border-radius: 10px; padding: 5px;">
	  <p>{summary}</p>
	</div>
	{#each snips.split("\n\n") as s, i}
    {#if s.trim().length>1}
      <p>{s}</p>
      <a href="{meta[i].URL}" target="_blank">{meta[i].Filename.replace(".txt", "")}</a>
      <hr>
    {/if}
	{/each}
{/if}
</div>

<style>
input {
  /* max-width: 720px; */
}
select {
	padding: 5px;
    font-size: 18px;
}


:root {
		--accent-color: CornflowerBlue;
		--gray: #ccc;
	}
	
   .group-container {
      border-radius: 2px;
      display: flex;
      flex-direction: row;
    }

  .legend {
    font-weight: bold;
  }
  label {
    user-select: none;
    line-height: 1.2em;
  }

  .sr-only {
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    padding: 0;
    border: 0;
    height: 1px;
    width: 1px;
    overflow: hidden;
  }

  input[type="radio"] {
    position: absolute;
  }

  input[type="radio"] + label {
    display: block;
    position: relative;
    text-align: left;
  }

  input[type="radio"] + label::before {
      content: "";
      position: relative;
      display: inline-block;
      margin-right: 0.5em;
      width: 1em;
      height: 1em;
      background: transparent;
      border: 1px solid var(--gray, #ccc);
      border-radius: 50%;
      top: 0.2em;
  }

  input[type="radio"]:checked + label::before {
    border: 1px solid var(--gray, #ccc);
    border-radius: 50%;
  }

  input[type="radio"] + label::after {
    content: "";
    position: absolute;
    display: inline-block;
    width: 0.5em;
    height: 0.5em;
    top: 0.45em;
    left: 0.25em;
    background: var(--accent-color, #282828);
    border: 1px solid var(--accent-color, #282828);
    border-radius: 50%;
    transform: scale(0);
  }

  input[type="radio"]:checked + label::after {
    opacity: 1;
    transform: scale(1);
  }

  input[type="radio"]:focus + label::before {
    box-shadow: 0 0 0 1px var(--accent-color, #282828);
    border-radius: 50%;
  }  
  
  input[type="radio"]:disabled + label {
    color: darken(var(--gray, #ccc), 10);
  }

  input[type="radio"]:disabled + label::before {
    background: var(--gray, #ccc);
  } 
  /* gravy */


  input[type="radio"] + label::before {
      transition: background 0.3s ease-out;
  }

  input[type="radio"]:checked + label::before {
    transition: background 0.3s ease-in;
  }

  input[type="radio"] + label::after {
    transition: transform 0.2s ease-out;
  }

  input[type="radio"]:checked + label::after {
    transition: transform 0.2s ease-in;
  }

  input[type="radio"]:focus + label::before {
    box-shadow: 0 0px 8px var(--accent-color, #282828);
    border-radius: 50%;
  }
  a {
	color: blue;
	text-decoration: underline;
  }

</style>