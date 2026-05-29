'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
require('dotenv').config();

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const PUBLISHER_ID  = process.env.AWIN_PUBLISHER_ID;
const API_KEY       = process.env.AWIN_API_KEY;
const ADVERTISER_ID = process.env.AWIN_ADVERTISER_ID;

if (!PUBLISHER_ID)  { console.error('Missing AWIN_PUBLISHER_ID');  process.exit(1); }
if (!API_KEY)       { console.error('Missing AWIN_API_KEY');        process.exit(1); }
if (!ADVERTISER_ID) { console.error('Missing AWIN_ADVERTISER_ID'); process.exit(1); }

// Step 1 — feed list.
// Confirmed endpoint: GET https://productdata.awin.com/datafeed/list/apikey/{key}
// Returns a CSV where each row describes one available feed with a download URL.
// The API key is embedded in the URL path (not a Bearer header).
// NOTE: This is the data-feed API key, which may differ from the publisher API
//       OAuth token. Both are typically available from the Awin UI under
//       "API Keys" for your publisher account.
//
// Alternative: if your account uses the newer enhanced feeds, the direct
// download endpoint is:
//   GET https://api.awin.com/publishers/{publisherId}/awinfeeds/download/{advertiserId}-retail-en_GB.jsonl
//   with Authorization: Bearer {API_KEY}
// That endpoint returns JSONL, not CSV, so it is NOT used by this script.
const FEED_LIST_URL = `https://productdata.awin.com/datafeed/list/apikey/${API_KEY}`;

// Step 2 — product feed download.
// The download URL comes directly from the feed list CSV.
// The API key is passed as a query parameter or embedded in the URL — the
// exact form depends on what productdata.awin.com returns in the list CSV.
// No Authorization header is used for productdata.awin.com downloads.

const OUTPUT_PATH = path.join(__dirname, 'data', 'awin-raw.json');

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/**
 * Parse a CSV string into an array of row objects.
 * Column names are taken from the first row, preserved exactly as-is.
 *
 * @param {string} csvText
 * @returns {object[]}
 */
function parseCsv(csvText) {
  return parse(csvText, { columns: true, skip_empty_lines: true });
}

/**
 * Search the feed list rows for the one belonging to the target advertiser.
 * Awin's feed list CSV uses "advertiser_id" (snake_case) as the column name
 * for the programme identifier.
 *
 * Returns undefined if no matching row is found.
 *
 * @param {object[]} feedListRows  Parsed rows from the feed list CSV.
 * @param {string}   advertiserId  Target advertiser ID (string comparison).
 * @returns {object|undefined}
 */
function findFeedRow(feedListRows, advertiserId) {
  // Awin's documented column name for the advertiser identifier in the
  // feed list CSV is "advertiser_id". A secondary check on "merchant_id"
  // is included as a fallback for legacy feed list formats.
  return feedListRows.find(row =>
    String(row.advertiser_id) === advertiserId ||
    String(row.merchant_id)   === advertiserId
  );
}

/**
 * Extract the download URL from a feed list row.
 * The column name for the download URL in Awin's feed list CSV is "url"
 * (based on community SDK inspection and official documentation excerpts).
 * Returns null if no URL is found.
 *
 * @param {object} feedRow
 * @returns {string|null}
 */
function extractDownloadUrl(feedRow) {
  // Primary candidate: "url" — most widely referenced in community implementations.
  // Fallback candidates reflect naming variants seen in unofficial SDK code.
  const candidateFields = ['url', 'download_url', 'downloadUrl', 'feed_url', 'feedUrl'];
  for (const field of candidateFields) {
    if (feedRow[field] && feedRow[field].trim() !== '') {
      return feedRow[field].trim();
    }
  }
  return null;
}

/**
 * Persist records to disk as formatted JSON.
 * Separated from the download logic so it can be called both on success
 * and on partial-data exit paths.
 *
 * @param {object[]} records
 */
function writeOutput(records) {
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(records, null, 2));
}

// ---------------------------------------------------------------------------
// Network layer
// ---------------------------------------------------------------------------

/**
 * Perform a GET request and return the response body as text.
 * On HTTP 4xx/5xx, throws a structured error with status and body attached.
 *
 * @param {string} url
 * @param {object} [headers]  Optional additional request headers.
 * @returns {Promise<string>}
 */
async function fetchText(url, headers = {}) {
  const response = await fetch(url, { method: 'GET', headers });

  if (!response.ok) {
    const responseText = await response.text();
    const error = new Error(
      `HTTP ${response.status} from ${url}: ${responseText}`
    );
    error.statusCode  = response.status;
    error.responseBody = responseText;
    throw error;
  }

  return response.text();
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

async function main() {
  // ------------------------------------------------------------------
  // Step 1 — Fetch the feed list and locate the target advertiser entry
  // ------------------------------------------------------------------

  let feedListText;
  try {
    feedListText = await fetchText(FEED_LIST_URL);
  } catch (error) {
    console.error(
      `Awin feed list request failed (status ${error.statusCode}):\n${error.responseBody}`
    );
    process.exit(1);
  }

  const feedListRows = parseCsv(feedListText);

  if (feedListRows.length === 0) {
    console.error('Awin feed list returned no rows — check API key and publisher account access.');
    process.exit(1);
  }

  const targetFeedRow = findFeedRow(feedListRows, ADVERTISER_ID);

  if (!targetFeedRow) {
    console.error(
      `No feed found for AWIN_ADVERTISER_ID=${ADVERTISER_ID}. ` +
      `Verify the advertiser ID and confirm your publisher account has joined their program.`
    );
    process.exit(1);
  }

  const downloadUrl = extractDownloadUrl(targetFeedRow);

  if (!downloadUrl) {
    console.error(
      `Feed row found for advertiser ${ADVERTISER_ID} but no download URL could be extracted. ` +
      `Available columns: ${Object.keys(targetFeedRow).join(', ')}`
    );
    process.exit(1);
  }

  // ------------------------------------------------------------------
  // Step 2 — Download the product feed CSV
  // ------------------------------------------------------------------
  // productdata.awin.com download URLs do not require an Authorization
  // header — the API key is embedded in the URL returned by the list endpoint.

  let productCsvText;
  try {
    productCsvText = await fetchText(downloadUrl);
  } catch (error) {
    console.error(
      `Awin product feed download failed (status ${error.statusCode}):\n${error.responseBody}`
    );
    process.exit(1);
  }

  // ------------------------------------------------------------------
  // Step 3 — Parse CSV
  // ------------------------------------------------------------------

  const records = parseCsv(productCsvText);

  if (records.length === 0) {
    console.warn(
      `Warning: product feed CSV for advertiser ${ADVERTISER_ID} produced zero records.`
    );
    writeOutput(records);
    process.exit(1);
  }

  // ------------------------------------------------------------------
  // Step 4 — Write output
  // ------------------------------------------------------------------

  writeOutput(records);
  console.log(`Fetched ${records.length} records → ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
