import { error } from '@sveltejs/kit';
export const prerender = false;

import { BigQuery } from "@google-cloud/bigquery";

import fs from 'fs';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path'; // Importing the path module

// Get the directory of the current file
const __dirname = dirname(fileURLToPath(import.meta.url));

// Construct the absolute path to the credentials file
const credentialsPath = path.join(__dirname, '..', 'credentials.json');
// Synchronously read the credentials file
const credentialsJson = fs.readFileSync(credentialsPath, 'utf8');

const credentials = JSON.parse(credentialsJson);

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {

    const bigquery = new BigQuery({
        projectId: "osr-dashboard",
        credentials: credentials,
    });

    // const query_merged_24 = "SELECT * FROM `osr-dashboard.twitter.merged_24` LIMIT 100";
    const query = `
        SELECT * 
        FROM \`osr-dashboard.twitter.hashtag_count\`
        WHERE TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), TIMESTAMP(PARSE_DATE('%d/%m/%Y', date_created)), HOUR) <= 48
        LIMIT 100
    `;
    const query_24 = `
        SELECT * 
        FROM \`osr-dashboard.twitter.hashtag_count_24h\`
        WHERE TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), TIMESTAMP(PARSE_DATE('%d/%m/%Y', date_created)), DAY) <= 7
        LIMIT 100
    `;

    var rows = await bigquery.query({
        query: query,
    });
    var rows_24 = await bigquery.query({
        query: query_24,
    });


    if (true) {
        return {
            rows,
            rows_24
          };
    } else {
        throw error(404, 'Not found');
    }
}
