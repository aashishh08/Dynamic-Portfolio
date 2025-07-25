# Technical Document: Portfolio Backend

## Overview
This backend powers a dynamic portfolio dashboard, providing real-time stock data and sector-based summaries. It is designed to be robust, maintainable, and easy to integrate with a React/Next.js frontend.

---

## API Strategy
- **Excel as Source of Truth:**
  - The portfolio is read from `portfolio.xlsx`, which uses sector headers and stock rows in the "Particulars" column.
- **Live Data Fetching:**
  - CMP (Current Market Price) is fetched from Yahoo Finance using the `yahoo-finance2` npm package.
  - P/E Ratio and Latest Earnings are scraped from Google Finance using Axios and Cheerio.
- **Sector Grouping:**
  - The backend parses sector headers and assigns each stock to a sector, then computes sector-level summaries.
- **API Endpoint:**
  - `GET /api/portfolio` returns all stocks (with live data and errors) and sector summaries.

---

## Scraping Approach
- **Yahoo Finance:**
  - Uses the `yahoo-finance2` library for reliable, structured data.
  - Symbol formatting is handled to support both NSE and BSE.
- **Google Finance:**
  - Uses Axios to fetch the HTML and Cheerio to parse it.
  - Extracts P/E Ratio and Latest Earnings from the summary tables.
  - If data is missing or the page structure changes, returns 'N/A' and an error message.

---

## Error Handling
- **Service-Level:**
  - Both Yahoo and Google services return objects with value and error fields (e.g., `{ cmp, error }`).
  - If a fetch fails, the error is logged and included in the API response.
- **Controller-Level:**
  - The API response includes error fields for each stock, so the frontend can display partial data and user-friendly messages.
- **Partial Failures:**
  - If some stocks fail to fetch live data, the rest of the portfolio is still returned.

---

## Rate Limiting & Caching
- **Caching:**
  - Both Yahoo and Google data are cached for 15 seconds per symbol using `node-cache`.
  - This reduces API calls and helps avoid rate limits.
- **No API Keys:**
  - All data is fetched from public sources; no sensitive keys are exposed.

---

## Key Challenges & Solutions
- **Unofficial APIs:**
  - Both Yahoo and Google Finance do not offer official APIs. The backend uses a maintained npm package for Yahoo and scraping for Google.
- **HTML Structure Changes:**
  - Scraping is brittle; selectors are chosen to be as robust as possible, and errors are handled gracefully.
- **Sector Grouping from Excel:**
  - The Excel reader tracks the current sector as it parses rows, assigning it to each stock.
- **Error Transparency:**
  - All errors are surfaced in the API response for easy debugging and UI display.

---

## Extensibility
- To add new data sources or metrics, create a new service in `/services` and update the controller.
- To support new Excel formats, adjust the reader logic in `/utils/excelReader.js`.

---

## Contact
For questions or improvements, please contact the project maintainer. 