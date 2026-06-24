# API Research Results — Road Bike Wheel Specs

- Evolution: EVO-027
- Date: 2026-05-29
- Status: Complete

---

## 1. APIs Evaluated

| Name | Base URL | Data Available | Auth | Free Tier | Terms of Use | Viability |
|---|---|---|---|---|---|---|
| **Bike Index API v3** | bikeindex.org/documentation/api_v3 | Brand, model, frame material, generic component records, images | OAuth2 / API key | Yes — read is fully open | MIT open source; free for all use | Low — stolen bike registry, user-entered data, no structured wheel specs |
| **Channel3 Product Data API** | trychannel3.com | Product title, images, price, availability, merchant URL | API key | 1,000 req/month | Shopping aggregator; affiliate monetization built in | **Retained** — viable for price and image layer; no structured technical specs |
| **Awin Product Feeds (CSV)** | ui.awin.com | Product title, price, images, merchant URL — CSV feeds from cycling retailers (Wiggle, Ribble, Cyclestore…) | Free publisher account | Yes | Affiliate network rules; commercial use allowed | **Retained** — best real-world product coverage; CSV format, specs in free text only |
| **CycleSoftware API** | docs.cyclesoftware.nl | Articles, price, stock, barcode, wheel size | B2B credentials | Not public | Closed commercial B2B; European bike shops only | Low — no public signup |
| **Strava Gear API** | developers.strava.com | Brand name, model name, frame type; no wheel data | OAuth2 | Yes | Personal/non-commercial | Very low — no wheel or component specs |
| **Wheel-Size.com API** | developer.wheel-size.com | Rim dimensions, bolt pattern, offset — for automobiles | API key | Sandbox only | Commercial | Irrelevant — automotive only |
| **Freespoke Rim Database** | kstoerz.com/freespoke/rims | ERD, ISO diameter, tire type | None | Yes | No formal API | Low — HTML only, no REST endpoint |
| **BikeExchange** | b2b.bikeexchange.de | Internal retailer inventory sync | B2B agreement | Not public | Closed B2B | Dead end |
| **Manufacturer sites** (Shimano, DT Swiss, Mavic, Zipp, Roval, Campagnolo, Fulcrum) | Various | Full specs on product pages | N/A | N/A | N/A | No public API exposed by any of them |

---

## 2. Retained Sources

### Channel3 Product Data API
REST API, JSON, 1,000 free requests/month. Returns product title, images, current retail price, availability, and merchant URL for bicycle parts. Does not expose technical specs (rim depth, width, weight) as structured fields — these may appear in unstructured product descriptions.

**Use:** price and image layer of the catalog.

### Awin Product Feeds
CSV product feeds from cycling retailers in the Awin affiliate network (Wiggle, Ribble, Cyclestore, and others). Free to access with an approved publisher account. Covers a broad range of road bike wheels with real retail prices and product images. Technical specs are absent as structured fields but sometimes present in free-text descriptions.

**Use:** bulk product listing, retail price coverage, images.

---

## 3. Internal Brand Endpoint Investigation (EVO-027)

- **Investigation date:** 2026-05-29
- **Method:** Browser devtools (Chrome), Network tab, Fetch/XHR filter — product listing page + product detail page for each brand
- **Outcome:** No viable internal JSON endpoint found for any brand

| Brand | URL inspected | Viable endpoint | Verdict |
|---|---|---|---|
| DT Swiss | dtswiss.com/en/wheels | No | Spec data not exposed via accessible JSON endpoint |
| Zipp | zipp.com/wheels | No | Spec data not exposed via accessible JSON endpoint |
| Roval | rovalcomponents.com/en-us/collections/wheels | No | Spec data not exposed via accessible JSON endpoint |
| Fulcrum | fulcrumwheels.com/en/wheels | No | Spec data not exposed via accessible JSON endpoint |

**Conclusion:** All four brands serve product specs as static HTML or via methods not accessible as public JSON. No ingestion script will be produced for any of these brands in EVO-027.

---

## 4. Data Field Coverage

| Field | Channel3 | Awin Feeds | Any known API |
|---|---|---|---|
| Brand and model name | Partial (title) | Partial (title) | No structured API |
| Weight (grams) | No | No | No |
| Rim depth (mm) | No | No | No |
| Rim internal width (mm) | No | No | No |
| Rim external width (mm) | No | No | No |
| Rim material | No | No | No |
| Hookless compatibility | No | No | No |
| Diameter (700C / 650B) | Partial (title) | Partial (title) | No |
| Hub brand / model | No | No | No |
| Spoke brand / model / material | No | No | No |
| Price (retail) | Yes | Yes | — |
| Product images | Yes | Yes | — |

---

## 5. Conclusion

No public API provides structured technical specs for road bike wheels. The cycling industry has no equivalent to the automotive ACES/PIES standard.

**For EVO-027:** Channel3 and Awin are retained for the ingestion script. They will populate the price and image fields. Technical specs (rim depth, weight, width, material, hookless) have no API source and must come from manual entry, scraping, or community contribution.

**Next steps after EVO-027:**
- Plan a scraping evolution for manufacturer product pages (HTML sources not covered by any API or internal endpoint)
