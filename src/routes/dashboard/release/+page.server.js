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
        SELECT 
            Publication, Description, Document_type, Organisation, Status, Date, Time, MAX(date_collected) as max_date_collected
        FROM \`osr-dashboard.release_calendar.release_calendar\`
        WHERE 
            SAFE.PARSE_DATE('%d-%m-%Y', Date) IS NOT NULL
            AND DATE(TIMESTAMP(SAFE.PARSE_DATE('%d-%m-%Y', Date))) >= CURRENT_DATE()
            AND DATE(TIMESTAMP(SAFE.PARSE_DATE('%d-%m-%Y', Date))) <= DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY)
        GROUP BY Publication, Description, Document_type, Organisation, Status, Date, Time
`;

    var rows = await bigquery.query({
        query: query,
    });
    console.log("rows", rows)

    if (true) {
        return {
            rows
          };
    } else {
        throw error(404, 'Not found');
    }
}
