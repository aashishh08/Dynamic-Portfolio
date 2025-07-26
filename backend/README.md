# Portfolio Backend

This backend powers a dynamic portfolio dashboard. It reads your portfolio from an Excel file, fetches live stock data from Yahoo Finance (for NSE) and Screener.in (for BSE), and provides a sector-grouped API for use with a frontend (e.g., Next.js).

## Features
- Reads portfolio from `portfolio.xlsx` (Excel file)
- Fetches live CMP (Current Market Price), P/E Ratio, and Latest Earnings:
  - **NSE stocks:** Yahoo Finance (via `yahoo-finance2` library)
  - **BSE stocks:** Screener.in (via Puppeteer scraping)
- Groups stocks by sector and provides sector-level summaries
- Robust error handling and 15-second caching for API calls
- Concurrency limits for external API calls to avoid rate-limiting
- Returns detailed error and unsupported fields for each stock
- Test endpoints for debugging individual stock data

## Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
   - Key dependencies: `express`, `axios`, `cheerio`, `puppeteer`, `node-cache`, `p-limit`, `p-queue`, `xlsx`, `yahoo-finance2`
3. **Place your portfolio Excel file:**
   - Name it `portfolio.xlsx` and put it in the backend root.
   - The file should have sector headers (e.g., `Financial Sector`) and stock rows under each sector in the "Particulars" column. The backend will auto-assign the sector to each stock row below a sector header.
   - Example:
     | Particulars        | Symbol    | Purchase Price | Qty |
     |--------------------|-----------|---------------|-----|
     | Financial Sector   |           |               |     |
     | HDFC Bank         | HDFCBANK  | 1500          | 10  |
     | ICICI Bank        | ICICIBANK | 900           | 5   |
     | Tech Sector       |           |               |     |
     | Infosys           | INFY      | 1400          | 8   |
4. **Start the server:**
   ```bash
   npm start
   ```
   The server runs on `http://localhost:4000` by default (or use `PORT` env variable).

## API Usage

### `GET /api/portfolio`
Returns your portfolio with live data and sector summaries.

**Response format:**
```json
{
  "data": [
    {
      "stockName": "HDFC Bank",
      "symbol": "HDFCBANK",
      "fullSymbol": "HDFCBANK.NS",
      "purchasePrice": 1500,
      "quantity": 10,
      "investment": 15000,
      "cmp": 1550.5,
      "cmpError": null,
      "presentValue": 15505,
      "gainLoss": 505,
      "peRatio": "18.2",
      "latestEarnings": "120 Cr",
      "portfolioPercent": "10.00",
      "sector": "Financial",
      "unsupported": false,
      "unsupportedReason": ""
    }
    // ...more stocks
  ],
  "sectorSummaries": [
    {
      "sector": "Financial",
      "totalInvestment": 30000,
      "totalPresentValue": 32000,
      "totalGainLoss": 2000,
      "stocks": [ /* stocks in this sector */ ]
    }
    // ...more sectors
  ]
}
```
- If fetching live data fails, `cmpError` will contain the error message.
- If a symbol is unsupported (e.g., not found on Yahoo or Screener), `unsupported` will be true and `unsupportedReason` will explain why.

### `GET /api/test/yahoo/:symbol`
Fetches live data for a single NSE symbol from Yahoo Finance (for debugging).

### `GET /api/test/google/:symbol`
Fetches P/E and earnings for a single NSE symbol from Google Finance (for debugging only). **Note:** This endpoint is for testing purposes only. The main portfolio API uses Yahoo Finance for NSE stocks and Screener.in for BSE stocks, as Google Finance scraping is less reliable and resource-intensive.

## Data Sources & Strategy

### Primary Data Sources (Used in Main Portfolio API):
- **NSE Stocks:** Yahoo Finance via `yahoo-finance2` library
  - Provides reliable, structured data
  - Fetches CMP, P/E Ratio, and Latest Earnings
  - Uses official npm package for stability
- **BSE Stocks:** Screener.in via Puppeteer scraping
  - Scrapes company pages for comprehensive financial data
  - Extracts CMP, P/E, EPS, Market Cap, ROE, ROCE, and more
  - Has fallback to Axios/Cheerio if Puppeteer fails

### Test Data Source (Debugging Only):
- **Google Finance:** Used only for `/api/test/google/:symbol` endpoint
  - Scrapes Google Finance pages using Puppeteer
  - Less reliable due to frequent UI changes
  - Resource-intensive (heavy on server)
  - **Not used in main portfolio data**

## Environment Variables
- No API keys are required. All data is fetched from public sources.
- You can set `PORT` to change the server port.

## Notes & Troubleshooting
- Yahoo Finance and Screener.in are unofficial sources and may break if their sites change.
- Caching is used to avoid rate limits (15 seconds per symbol for Yahoo/Screener).
- Concurrency is limited (max 2 parallel Yahoo/Screener calls) to avoid bans.
- If Puppeteer fails to launch (e.g., on some Linux servers), try installing missing dependencies or running with `--no-sandbox`.
- For best results, keep your Excel file up to date and check logs for errors.
- Google Finance API is available for testing but not recommended for production use due to reliability issues.

## Extensibility
- To add new data sources or metrics, create a new service in `/services` and update the controller.
- To support new Excel formats, adjust the reader logic in `/utils/excelReader.js`.

---

## License
MIT 