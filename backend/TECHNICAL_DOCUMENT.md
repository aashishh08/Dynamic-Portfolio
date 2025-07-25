# Technical Document: Portfolio Backend

## Overview
This backend powers a dynamic portfolio dashboard, providing real-time stock data and sector-based summaries. It is designed to be robust, maintainable, and easy to integrate with a React/Next.js frontend.

---

## API Strategy
- **Excel as Source of Truth:**
  - The portfolio is read from `portfolio.xlsx`, which uses sector headers and stock rows in the "Particulars" column. The backend auto-assigns the sector to each stock row below a sector header.
- **Live Data Fetching:**
  - **NSE stocks:** CMP (Current Market Price), P/E Ratio, and Latest Earnings are fetched from Yahoo Finance using the `yahoo-finance2` npm package.
  - **BSE stocks:** CMP, P/E Ratio, and Latest Earnings are scraped from Screener.in using Puppeteer (with fallback to Axios/Cheerio).
  - **Google Finance** is only used for the `/api/test/google/:symbol` endpoint (not for main portfolio data).
- **Sector Grouping:**
  - The backend parses sector headers and assigns each stock to a sector, then computes sector-level summaries.
- **API Endpoints:**
  - `GET /api/portfolio` returns all stocks (with live data, errors, and sector summaries).
  - `GET /api/test/yahoo/:symbol` returns live data for a single NSE symbol (debugging).
  - `GET /api/test/google/:symbol` returns P/E and earnings for a single NSE symbol from Google Finance (debugging only).

---

## Scraping & Data Fetching Approach
- **Yahoo Finance (NSE):**
  - Uses the `yahoo-finance2` library for reliable, structured data.
  - Symbol formatting is handled to support both NSE (`.NS`) and BSE (`.BO`).
- **Screener.in (BSE):**
  - Uses Puppeteer for robust scraping, with fallback to Axios/Cheerio if Puppeteer fails.
  - Extracts CMP, P/E, EPS, and other key ratios from the Screener.in company page.
- **Google Finance:**
  - Used only for the `/api/test/google/:symbol` endpoint for debugging.

---

## Error Handling
- **Service-Level:**
  - Both Yahoo and Screener services return objects with value and error fields (e.g., `{ cmp, error }`).
  - If a fetch fails, the error is logged and included in the API response.
- **Controller-Level:**
  - The API response includes error fields for each stock, so the frontend can display partial data and user-friendly messages.
  - New fields: `unsupported` (boolean) and `unsupportedReason` (string) indicate if a symbol could not be found on Yahoo or Screener.
- **Partial Failures:**
  - If some stocks fail to fetch live data, the rest of the portfolio is still returned.

---

## Rate Limiting, Concurrency & Caching
- **Caching:**
  - Yahoo and Screener data are cached for 15 seconds per symbol using `node-cache`.
  - This reduces API calls and helps avoid rate limits.
- **Concurrency Limits:**
  - Uses `p-limit` and `p-queue` to limit concurrent external API calls (max 2 parallel Yahoo/Screener calls).
  - This helps avoid bans and rate-limiting from data sources.

---

## Key Challenges & Solutions
- **Unofficial APIs:**
  - Both Yahoo and Screener.in do not offer official APIs. The backend uses a maintained npm package for Yahoo and robust scraping for Screener.
- **HTML Structure Changes:**
  - Scraping is brittle; selectors are chosen to be as robust as possible, and errors are handled gracefully.
- **Sector Grouping from Excel:**
  - The Excel reader tracks the current sector as it parses rows, assigning it to each stock.
- **Error Transparency:**
  - All errors and unsupported cases are surfaced in the API response for easy debugging and UI display.

---

## Extensibility
- To add new data sources or metrics, create a new service in `/services` and update the controller.
- To support new Excel formats, adjust the reader logic in `/utils/excelReader.js`.

---

## Troubleshooting & Notes
- Yahoo and Screener.in are unofficial sources and may break if their sites change.
- Caching and concurrency limits are used to avoid rate limits and bans.
- If Puppeteer fails to launch (e.g., on some Linux servers), try installing missing dependencies or running with `--no-sandbox`.
- For best results, keep your Excel file up to date and check logs for errors.

---

## Contact
For questions or improvements, please contact the project maintainer. 