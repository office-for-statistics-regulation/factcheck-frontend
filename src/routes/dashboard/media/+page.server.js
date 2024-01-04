import { error } from '@sveltejs/kit';
export const prerender = false;

import { BigQuery } from "@google-cloud/bigquery";

var credentials = {
    "type": "service_account",
    "project_id": "osr-dashboard",
    "client_id": "117093491286790458609",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/new-svelte%40osr-dashboard.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

const private_key_id = import.meta.env.VITE_GCP_PRIVATEID;
const private_key = import.meta.env.VITE_GCP_PRIVATE;
const client_email = import.meta.env.VITE_GCP_CLIENTEMAIL;

credentials['private_key_id'] = private_key_id
credentials['private_key'] = private_key
credentials['client_email'] = client_email

/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {

    const bigquery = new BigQuery({
        projectId: "osr-dashboard",
        credentials: credentials,
    });

    // const query_merged_24 = "SELECT * FROM `osr-dashboard.twitter.merged_24` LIMIT 100";
    const query = `
        SELECT *
        FROM \`osr-dashboard.media.media_analysis\`
        WHERE 
            SAFE.PARSE_DATE('%Y-%m-%d', Published_Date) IS NOT NULL
            AND DATE(TIMESTAMP(SAFE.PARSE_DATE('%Y-%m-%d', Published_Date))) >= DATE_SUB(CURRENT_DATE(), INTERVAL 100 DAY)
`;

    var rows = await bigquery.query({
        query: query,
    });

    if (true) {
        return {
            rows
          };
    } else {
        throw error(404, 'Not found');
    }
}
