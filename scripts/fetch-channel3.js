'use strict';

const fs = require('fs');
const path = require('path');
require('dotenv').config();

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const API_KEY = process.env.CHANNEL3_API_KEY;
if (!API_KEY) {
  console.error('Missing CHANNEL3_API_KEY');
  process.exit(1);
}

const SEARCH_ENDPOINT = 'https://api.trychannel3.com/v1/search';

// Category ID for "Bicycle Wheel Parts" in the Channel3 taxonomy.
// Verified from the product-data page at:
// https://trychannel3.com/product-data/sporting-goods-outdoor-recreation-cycling-bicycle-parts-bicycle-wheel-parts
// If this returns too few results, also add the parent category "va0"
// (Bicycle Parts) or broaden the query string.
const BICYCLE_WHEEL_CATEGORY_ID = '3Yx';

const RESULTS_PER_PAGE = 30; // API maximum is 30
const OUTPUT_PATH = path.join(__dirname, 'data', 'channel3-raw.json');

// ---------------------------------------------------------------------------
// Pure helpers
// ---------------------------------------------------------------------------

/**
 * Build the request body for a given page token.
 * Returns a plain object — no side effects.
 *
 * @param {string|null} pageToken  Opaque pagination token from the previous response.
 * @returns {object}
 */
function buildRequestBody(pageToken) {
  const body = {
    query: 'bicycle wheel',
    filters: {
      category_ids: [BICYCLE_WHEEL_CATEGORY_ID],
    },
    limit: RESULTS_PER_PAGE,
  };

  if (pageToken !== null) {
    body.page_token = pageToken;
  }

  return body;
}

/**
 * Persist accumulated records to disk as formatted JSON.
 * Separated from the fetch loop so it can be called both on success
 * and on partial-data exit (e.g. rate-limit).
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
 * Perform a single POST to the Channel3 search endpoint.
 * Returns the parsed JSON body on HTTP 2xx.
 * Throws a structured error for HTTP 4xx/5xx, with the status code attached.
 *
 * @param {object} requestBody
 * @returns {Promise<object>}
 */
async function fetchOnePage(requestBody) {
  const response = await fetch(SEARCH_ENDPOINT, {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const responseText = await response.text();
    const error = new Error(
      `HTTP ${response.status} from Channel3 API: ${responseText}`
    );
    error.statusCode = response.status;
    error.responseBody = responseText;
    throw error;
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// Orchestration
// ---------------------------------------------------------------------------

async function main() {
  const accumulatedProducts = [];
  let pageToken = null;
  let pageNumber = 0;

  do {
    pageNumber += 1;
    const requestBody = buildRequestBody(pageToken);

    let pageData;
    try {
      pageData = await fetchOnePage(requestBody);
    } catch (error) {
      if (error.statusCode === 429) {
        // Rate limited — persist whatever was already fetched before stopping.
        console.error(
          `Rate limited by Channel3 API (HTTP 429). ` +
          `Writing ${accumulatedProducts.length} partial records to disk.`
        );
        if (accumulatedProducts.length > 0) {
          writeOutput(accumulatedProducts);
          console.log(
            `Partial data written → ${OUTPUT_PATH}`
          );
        }
        process.exit(1);
      }

      // Any other HTTP error: log status + body, then exit.
      console.error(
        `Channel3 API error (status ${error.statusCode}):\n${error.responseBody}`
      );
      process.exit(1);
    }

    const pageProducts = pageData.products || [];
    accumulatedProducts.push(...pageProducts);

    pageToken = pageData.next_page_token || null;

    // Stop if the page returned no products (safety guard against infinite loops
    // in case the API returns an empty page with a non-null next_page_token).
    if (pageProducts.length === 0) {
      break;
    }
  } while (pageToken !== null);

  writeOutput(accumulatedProducts);
  console.log(`Fetched ${accumulatedProducts.length} records → ${OUTPUT_PATH}`);
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
