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

    const query_merged_all_30 = `
        SELECT * 
        FROM \`osr-dashboard.twitter.merged_24\`
        WHERE TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), TIMESTAMP(PARSE_DATE('%d/%m/%Y', date_created)), DAY) <= 30
    `;

    var rows_merged_all_30 = await bigquery.query({
        query: query_merged_all_30,
    });

    if (true) {
        console.log("in")
        return {
            rows_merged_all_30
          };
    } else {
        throw error(404, 'Not found');
    }
}
