let currentDate = new Date();
let formattedDate = currentDate.toDateString().slice(4);

import { VITE_OPENAI_API } from '$env/static/public'
console.log("VITE_OPENAI_API", VITE_OPENAI_API)

const secretKey = import.meta.env.VITE_OPENAI_API;
console.log("secretKey", secretKey)


import similarity from "compute-cosine-similarity";

import { ChromaClient } from 'chromadb';
const client = new ChromaClient({
        path: "http://35.234.129.115:80"
    });

import { OpenAIEmbeddingFunction } from 'chromadb';
const embedder = new OpenAIEmbeddingFunction({openai_api_key: secretKey})


import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: secretKey,
});
const openai = new OpenAIApi(configuration);

async function get_embedding(text) {
    const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: text,
    });
    return response.data.data[0].embedding;
}

var labels_key = ['True', 'False', 'Unconfirmed']
var labels = ['The statement is true, based on the provided snippets.', 'The statement is false, based on the provided snippets.', 'Unconfirmed. It is unclear whether the statement is true or false based on the snippets provided.']
// var  = labels.map(label => get_embedding(label))
var s_labels = ["Snippet 1", "Snippet 2", "Snippet 3", "Snippet 4", "Snippet 5"]



var s_label_embeddings, label_embeddings, collection;
async function runExample() {
    console.log("runExample")
    collection = await client.getCollection({name: "ons_pubs", embeddingFunction: embedder})
    label_embeddings = await Promise.all(labels.map(label => get_embedding(label)))
    s_label_embeddings = await Promise.all(s_labels.map(label => get_embedding(label)))
}

// runExample();

async function findContext(query, sources) {

    console.log("collection", collection)

    if (typeof label_embeddings === "undefined") {
        await runExample();
    }
    else if (typeof s_label_embeddings === "undefined") {
        await runExample();
    }
    else if (typeof collection === "undefined") {
        await runExample();
    }
    
    if (sources.length == 1) {
        console.log(" single")
        let context = await collection.query({
            nResults: 5, // n_results
            // where: {"Source": sources[0]},
            queryTexts: [query] // query_text
        })
        console.log(" == > context", await context['metadatas'][0].map(e => e['Source']))
        return await context

    } else {
        console.log(" multiple sources")
        let context = await collection.query({
            nResults: 5, // n_results
            queryTexts: [query] // query_text
        })
        console.log(" == > context", await context['metadatas'][0].map(e => e['Source']))
        return await context
    }
}

function createSnips(rs0) {
    console.log("createSnips")
    let snip = "SNIPPETS\n";
    for (let i = 0; i < rs0.length; i++) {
        snip += `[${i+1}] ${rs0[i].replace("\n\n", "\n").replace("\n\n", " ")}\n\n`;
    }
    return snip
}

async function true_or_false(claim, context, snip, direction) {
    console.log("true_or_false")
    let input_string = `${direction}

---
${snip}
---
STATEMENT
${claim}
`
    console.log("input_string", input_string)
    let response = await fetch('https://api.openai.com/v1/chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + secretKey
                },
            method: 'POST',
            body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {"role": "system", "content": "You are an AI assistant designed to help fact-check statistical claims."},
                // {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": input_string},
                ]
            })
        });
    let data = await response.json();
    let out = await data['choices'][0].message.content
    console.log("true_or_false out", out)
    return out
}

async function checkQuality(claim, direction, intended) {
    let input_string = `
1. Rough estimate
You can use these data as an approximate or early indicator of rough sizes and trends, being aware that figures are likely to change.
Quality is limited by factors such as: near-real time data, provisional data, seasonal variations, restricted time for quality assurance, broad uncertainty, higher potential risk of bias, relying on subjective assumptions, a new method undergoing testing.

2. Satisfactory estimate
You can use these data as a satisfactory approximation of key concepts and headline estimates but must be aware they have relatively broad uncertainty and may change.
There are notable quality issues that present a higher potential risk of bias and constrain the usefulness of detailed figures for hard to measure concepts.

3. Suitable estimate
You can use these data to provide a suitable representation of key concepts and reliable headline estimates with some uncertainty and small changes expected.
Some specific limitations (such as lower completeness for some variables) may constrain fitness for use in some settings.

4. Good estimate
You can use these data as a good measure of key concepts with relatively narrow ~~small~~ uncertainties that are well understood.
These estimates are based on appropriate data and methods for both high-level and detailed data. Uncertainty is quantified or described. Potential limitations are documented, highlighting known impact on use.

5. Excellent estimate
You can use these data as a very good measure of key concepts, knowing they are robust and appropriate for most use cases,
These estimates use known effective or well-established methods, characterised by narrow uncertainty that is quantified or described, a low risk of bias, and not impacted by any known appreciable limitations.

---
STATEMENT
${claim}

---
Please rewrite the above STATEMENT so that it converys a data quality that equates to "${intended}".
`

    let response = await fetch('https://api.openai.com/v1/chat/completions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + secretKey
                },
            method: 'POST',
            body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {"role": "system", "content": "You are an AI assistant designed to assess statistical communication."},
                // {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": input_string},
                ]
            })
        });
    let data = await response.json();
    let out = await data['choices'][0].message.content
    return out
}


async function label_score(response_embedding, label_embeddings) {
    let sims = [];
    for (let i of label_embeddings) {
        sims.push(similarity(response_embedding, i));
    }
    let max_sim = Math.max(...sims);
    let max_sim_index = sims.indexOf(max_sim);
    console.log("label_score", labels_key[max_sim_index])
    return labels_key[max_sim_index];
}
async function find_nearest_snip(rel_snip_embedding, s_label_embeddings) {
    let sims = [];
    for (let i of s_label_embeddings) {
        sims.push(similarity(rel_snip_embedding, i))
    }
    let max_sim = Math.max(...sims);
    let max_sim_index = sims.indexOf(max_sim);
    return max_sim_index
}

async function which_snip(t_f) {
    let input_string = `Statement: "${t_f}"

    The preceding statement has come from a fact-checker. What snippet might the fact-checker consider the most relevant?`

    let response = await fetch('https://api.openai.com/v1/chat/completions', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + secretKey
            },
        method: 'POST',
        body: JSON.stringify({
            model: 'gpt-4-turbo',
            messages: [
                {"role": "system", "content": `You are a helpful assistant.
    
        You must respond with just a single snippet.
    
        E.g. 'Snippet 6'`},
                {"role": "user", "content": input_string}
            ]
        })
    });

    let data = await response.json();
    let out = await data['choices'][0].message.content
    return out
}


let dir_lookup = {
    "Verify a statement": `Verify whether the statement is true and accurate (to the nearest percent) based on the context provided by the snippets. If the statement appears to contradict the context then say it is false, if the statement is supported by the snippets say it is true, and if the claim is not confirmed by the snippets say you don't know. Please explain how you have come to your opinion.`,
    "Ask a question": "Please answer the statement question based on the snippets provided.", 
    "Assess the quality": `empty text`
}
export const actions = {
	summarize: async ({ request }) => {

        const formData = await request.formData();

        const symbolKey = Object.getOwnPropertySymbols(formData)[0];
        const stateArray = formData[symbolKey];

        const firstObject = stateArray[0];
        const secondObject = stateArray[1];

        let direction_id = firstObject.value;
        const direction = dir_lookup[direction_id];


        if (direction_id == "Assess the quality") {
            let query = secondObject.value;
            const thirdObject = stateArray[2];
            let intended = thirdObject.value;

            let quality = await checkQuality(query, direction, intended)
            return JSON.stringify({text: quality});    
        }
        else {
            let query = `User [${formattedDate}]: `+secondObject.value;
            let sources = stateArray.filter(e => e.name == 'box_check').map(e => e.value)

            let context = await findContext(query, sources)
            let snips = createSnips(await context.documents[0])
            let t_f = await true_or_false(query, context, snips, direction)
            let response_embedding = get_embedding(await t_f)
            let t_f_u = label_score(await response_embedding, label_embeddings)
    
            // let rel_snip = which_snip(t_f)
            // let rel_snip_embedding = get_embedding(await rel_snip)
            // let s = find_nearest_snip(await rel_snip_embedding, s_label_embeddings)
    
            let returnload = {text: t_f, t_f_u: await t_f_u, snips: snips, documents: context['documents'][0], meta: context['metadatas'][0]}    

            return JSON.stringify(returnload);    
        }
    }
}
