# Portfolio Backend

This is the backend for a dynamic portfolio dashboard. It reads your portfolio from an Excel file, fetches live stock data from Yahoo Finance and Google Finance, and provides a sector-grouped API for use with a frontend (e.g., Next.js).

## Features
- Reads portfolio from `portfolio.xlsx`
- Fetches live CMP (Current Market Price) from Yahoo Finance
- Fetches P/E Ratio and Latest Earnings from Google Finance (scraping)
- Groups stocks by sector and provides sector-level summaries
- Robust error handling and 15-second caching for API calls

## Setup

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Place your portfolio Excel file:**
   - Name it `portfolio.xlsx` and put it in the project root.
   - The file should have sector headers (e.g., `Financial Sector`) and stock rows under each sector in the "Particulars" column.
4. **Start the server:**
   ```bash
   npm start
   ```
   The server runs on `http://localhost:4000` by default.

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
      "googleError": null,
      "portfolioPercent": "10.00",
      "sector": "Financial"
    },
    // ...more stocks
  ],
  "sectorSummaries": [
    {
      "sector": "Financial",
      "totalInvestment": 30000,
      "totalPresentValue": 32000,
      "totalGainLoss": 2000,
      "stocks": [ /* stocks in this sector */ ]
    },
    // ...more sectors
  ]
}
```

- If fetching live data fails, `cmpError` or `googleError` will contain the error message.

## Environment Variables
- No API keys are required. All data is fetched from public sources.

## Notes
- Yahoo and Google Finance APIs are unofficial and may break if their sites change.
- Caching is used to avoid rate limits (15 seconds per symbol).
- For best results, keep your Excel file up to date and check logs for errors.

---

## License
MIT 