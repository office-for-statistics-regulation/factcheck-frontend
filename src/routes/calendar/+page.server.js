import { error } from '@sveltejs/kit';
export const prerender = false;

import { BigQuery } from "@google-cloud/bigquery";


/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {

    const bigquery = new BigQuery({
        projectId: "osr-dashboard",
        credentials: {
            "type": "service_account",
            "project_id": "osr-dashboard",
            "private_key_id": "d9fc0cd1009d91f07618ef5bbdbd6d97727078c2",
            "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDUfPrhp1iwomQS\naVgGZYL/fRRvgEVBBrIrMAPcFiR7375aSiUo3tmVeaBQ68b0VoM3ugZ6yrM0LGio\nS2SfQzVg/IY4AI/z+tQGWK7I5KilIcIg0QjkqWsPr1zLq+/jm3IFxhNiMIC36G6H\nxZMvyzveT0cHO9MR2GaaC0WpYKCmbjctjWaC5nrUjQUsI1USeX2roK/e5A0UoodS\nX8ZlQdTq06awIjipSF8JwIsZ26yomg7DdRacOhqEaRHsaGvSrPi6qDR/beG5Xa5t\nwqS++bAkH5SANSLdDLH8MamYTqvEJ3K/hu4v6YT9kAYMAvA8myV12oWrwBkSKMag\n9pfD5QQdAgMBAAECggEANHW2qsdaCiHNew4vAUVGljUXOn/8mRVCH493JHsC/uI6\naKgtjG2YYmLoxZGwSNqjArsWpnIs1BCytfoHGZrKLuupZ2IcKCwg9IAohsiNKlev\nSdLR00JQgErXKiGE1DioaeyBFJjM7pqfzz1kHUSbv0LrUknezmUSz61AwZRtlSjl\nNHq+e55vhP6PZZYG0n8V8BATbTYqn0+begDQmFaDWIhRPi0eN+ecZEnmyefS5xif\nTguQXquXKQAp/E4owe7lDHYYKZSVRurxmEaCFo8IWrapGBdekjhzw24yKRNNGrTo\nIEwBElvtvTmgWJ2NmfdHPrL3iN1JLt5XzNU462PxAQKBgQD+ek2yADtnfPp44jiV\nDfKvAffcy/XiOnmYjWKQ1e59haGtIPuEOLpQGm7x7aWiBSm7Udhmh5Yn9RxpgV16\nSfM0vR/lAN4+h3afpnb8ECUFc1h4sE56UmJGeyNsV2aA9TddudAeVaXcWkdYGzo4\nmqQt8HorTb3uPfU8BMq/6OdI8QKBgQDVwmAf/9Zg0Myj5JIDiaeFMuY40hkkgACj\nLZl9T2s0uoNFl4f45q9HpHndNdpTDpfHmS9Z6QkdtnxEOc1pJZ9DltRfcrbk5VIR\n1CQxbnL3nwJpnOIvouujc9xX2JXLhzNgMH6nX8lCF86io8u4ViG6/INArMn/mctD\njPdJUjZN7QKBgQDOQFhKhc+f3/auFUQg4u4oE+NNrG28jwJQt38Evq+OQsm4JXxV\nPRkcpV/4a1GMkLyzGvHWn9v+xLXjeTtHSzp4KzT3iY2XhnmJigTz5S3sTgGNx+/D\nSpRmZZVfUTM+IAFg0KIyg95rSyx55493ozagGUEbaeYfe04Q+B1QD7etMQKBgD2e\nhq8yxM2r4xHrtdunNs9C2PLQPcczzvs7Dd/9oN3WVjkdcWjituxkEW0fNQx0THSR\nSAEXGDWkgTX5o6kH211UgWvyWZ6qLHpPOQ+20xVmlP905g7tXBgGMiJwoN3G35x+\n3kPJbO7MhhiENxmwWpDYcc2XAbPY1atnW3GbbWQRAoGBAInIsJp5IWHYJQkxYfCn\nyagBi/qYoQZULiaq5JeqYEpzDdu00sQXzNpgRs6bqVttin8Vd90Y1WiBeyybprKy\ntnIsGSEcZtkKspditpeAuSvO1Lc7z3Rnx7a725z3zw3ofJjrJdvoxtEqoAojzdxb\n+uvb8Ts66Kc2UHF0YbL95PS3\n-----END PRIVATE KEY-----\n",
            "client_email": "new-svelte@osr-dashboard.iam.gserviceaccount.com",
            "client_id": "117093491286790458609",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/new-svelte%40osr-dashboard.iam.gserviceaccount.com",
            "universe_domain": "googleapis.com"
        },
    });

    const query = `SELECT DISTINCT *
    FROM osr-dashboard.release_calendar.release_calendar
    WHERE date_collected >= CAST(DATE_SUB(CURRENT_DATE(), INTERVAL 10 DAY) AS STRING)
    LIMIT 100`;

    var rows = await bigquery.query({
        query,
    });


    if (true) {
        console.log("in")
        return {
            rows: rows,
          };
    } else {
        throw error(404, 'Not found');
    }
}
