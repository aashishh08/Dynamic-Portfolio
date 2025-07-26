# Technical Document: Portfolio Backend

## Overview
This backend powers a dynamic portfolio dashboard, providing real-time stock data and sector-based summaries. It is designed to be robust, maintainable, and easy to integrate with a React/Next.js frontend.

---

## API Strategy
- **Excel as Source of Truth:**
  - The portfolio is read from `portfolio.xlsx`, which uses sector headers and stock rows in the "Particulars" column. The backend auto-assigns the sector to each stock row below a sector header.
- **Live Data Fetching Strategy:**
  - **NSE stocks:** CMP (Current Market Price), P/E Ratio, and Latest Earnings are fetched from Yahoo Finance using the `yahoo-finance2` npm package.
  - **BSE stocks:** CMP, P/E Ratio, and Latest Earnings are scraped from Screener.in using Puppeteer (with fallback to Axios/Cheerio).
  - **Google Finance:** Used only for the `/api/test/google/:symbol` endpoint for debugging purposes. Not used in main portfolio data due to reliability and performance concerns.
- **Sector Grouping:**
  - The backend parses sector headers and assigns each stock to a sector, then computes sector-level summaries.
- **API Endpoints:**
  - `GET /api/portfolio` returns all stocks (with live data, errors, and sector summaries).
  - `GET /api/test/yahoo/:symbol` returns live data for a single NSE symbol (debugging).
  - `GET /api/test/google/:symbol` returns P/E and earnings for a single NSE symbol from Google Finance (debugging only).

---

## Data Sources Architecture

### Primary Data Sources (Production Use):

#### Yahoo Finance (NSE Stocks)
- **Library:** `yahoo-finance2` npm package
- **Advantages:** 
  - Official, maintained library
  - Structured, reliable data
  - No scraping required
  - Fast response times
- **Data Fetched:** CMP, P/E Ratio, Latest Earnings (EPS)
- **Symbol Format:** Automatically adds `.NS` suffix for NSE stocks
- **Error Handling:** Graceful fallbacks with detailed error messages

#### Screener.in (BSE Stocks)
- **Method:** Puppeteer web scraping with Axios/Cheerio fallback
- **Advantages:**
  - Comprehensive financial data
  - Good coverage of BSE stocks
  - Additional metrics (ROE, ROCE, Market Cap, etc.)
- **Data Fetched:** CMP, P/E, EPS, Market Cap, Book Value, Dividend Yield, ROE, ROCE, Face Value
- **Fallback Strategy:** If Puppeteer fails, falls back to Axios/Cheerio scraping
- **Error Handling:** Returns "N/A" values with error details

### Test Data Source (Debugging Only):

#### Google Finance
- **Method:** Puppeteer web scraping
- **Usage:** Only for `/api/test/google/:symbol` endpoint
- **Limitations:**
  - Frequent UI changes make scraping unreliable
  - Resource-intensive (heavy on server)
  - Not recommended for production use
- **Purpose:** Alternative data source for testing and comparison

---

## Scraping & Data Fetching Implementation

### Yahoo Finance Service (`yahooService.js`)
```javascript
// Key features:
- Uses yahoo-finance2 library for structured data
- Supports both NSE (.NS) and BSE (.BO) symbols
- Fetches multiple modules: price, summaryDetail, defaultKeyStatistics, financialData
- 15-second caching per symbol
- Extracts values from nested objects with fallback logic
```

### Screener.in Service (`yahooService.js` - BSE function)
```javascript
// Key features:
- Puppeteer-based scraping with 4-second page load wait
- Extracts data from #top-ratios and #profit-loss tables
- Fallback to Axios/Cheerio if Puppeteer fails
- 5-minute caching for BSE data
- Comprehensive error handling with detailed logging
```

### Google Finance Service (`googleService.js`)
```javascript
// Key features:
- Puppeteer scraping with 20-second timeout
- Queue-based concurrency limiting (max 2 parallel requests)
- 15-second caching
- Multiple selector fallbacks for data extraction
- Used only for testing/debugging endpoints
```

---

## Error Handling Strategy

### Service-Level Error Handling
- **Yahoo Finance:** Returns `{ cmp, peRatio, latestEarnings, error }` objects
- **Screener.in:** Returns comprehensive data objects with error fields
- **Google Finance:** Returns `{ peRatio, latestEarnings, error }` objects
- **Graceful Degradation:** All services return "N/A" values when data is unavailable

### Controller-Level Error Handling
- **Partial Failures:** Individual stock failures don't affect the entire portfolio
- **Unsupported Symbols:** New `unsupported` and `unsupportedReason` fields
- **Error Transparency:** All errors are included in API response for frontend display
- **User-Friendly Messages:** Errors are formatted for end-user consumption

### Error Categories
1. **Network Errors:** API timeouts, connection failures
2. **Data Source Errors:** Changes in website structure, rate limiting
3. **Symbol Errors:** Invalid or unsupported stock symbols
4. **Processing Errors:** Excel parsing, data transformation issues

---

## Performance & Optimization

### Caching Strategy
- **Yahoo Finance:** 15-second cache per symbol
- **Screener.in:** 5-minute cache per BSE symbol
- **Google Finance:** 15-second cache per symbol
- **Cache Keys:** Include symbol and data type for precise invalidation

### Concurrency Management
- **Yahoo Finance:** `p-limit` with max 2 concurrent requests
- **Screener.in:** Built-in delays (2-second intervals) to avoid rate limiting
- **Google Finance:** `p-queue` with max 2 concurrent requests
- **Queue Management:** Prevents overwhelming external APIs

### Resource Optimization
- **Puppeteer:** Headless mode with minimal arguments
- **Memory Management:** Proper browser cleanup and error handling
- **Timeout Handling:** Configurable timeouts for different operations
- **Fallback Mechanisms:** Multiple data extraction strategies

---

## Key Challenges & Solutions

### Challenge 1: Unofficial Data Sources
**Problem:** Yahoo Finance and Screener.in don't provide official APIs
**Solution:** 
- Use maintained npm package for Yahoo Finance
- Robust scraping with multiple fallback strategies
- Comprehensive error handling and monitoring

### Challenge 2: HTML Structure Changes
**Problem:** Scraping is brittle and breaks when websites change
**Solution:**
- Multiple selector strategies for data extraction
- Fallback mechanisms (Puppeteer → Axios/Cheerio)
- Regular monitoring and quick fixes for breaking changes

### Challenge 3: Rate Limiting & Bans
**Problem:** External APIs may rate-limit or ban excessive requests
**Solution:**
- Aggressive caching (15 seconds to 5 minutes)
- Concurrency limiting (max 2 parallel requests)
- Request spacing and delays

### Challenge 4: Excel Format Flexibility
**Problem:** Different Excel formats and column structures
**Solution:**
- Flexible Excel reader that handles multiple column names
- Sector auto-assignment based on headers
- Robust parsing with error handling

---

## Monitoring & Debugging

### Logging Strategy
- **Error Logging:** Detailed error messages with context
- **Performance Logging:** Request times and success rates
- **Data Quality Logging:** Missing or invalid data detection

### Debug Endpoints
- `/api/test/yahoo/:symbol` - Test Yahoo Finance data fetching
- `/api/test/google/:symbol` - Test Google Finance data fetching
- Response includes raw data and error information

### Health Checks
- API response includes error states for each stock
- Frontend can display partial data when some stocks fail
- Unsupported symbols are clearly identified

---

## Extensibility & Maintenance

### Adding New Data Sources
1. Create new service in `/services` directory
2. Implement standard interface: `{ cmp, peRatio, latestEarnings, error }`
3. Add caching and error handling
4. Update controller to use new service
5. Add test endpoint for debugging

### Supporting New Excel Formats
1. Modify `/utils/excelReader.js`
2. Add column name mappings
3. Update sector detection logic
4. Test with sample data

### Performance Improvements
1. Optimize caching strategies
2. Implement data prefetching
3. Add background data updates
4. Consider WebSocket for real-time updates

---

## Troubleshooting & Best Practices

### Common Issues
- **Puppeteer Launch Failures:** Install missing dependencies or use `--no-sandbox`
- **Rate Limiting:** Increase cache duration or reduce concurrency
- **Data Inconsistencies:** Check for website structure changes
- **Memory Leaks:** Ensure proper browser cleanup in error cases

### Maintenance Tasks
- **Regular Monitoring:** Check API response quality and error rates
- **Cache Optimization:** Adjust cache durations based on data volatility
- **Error Analysis:** Review error logs for patterns and improvements
- **Performance Tuning:** Monitor response times and optimize bottlenecks

### Best Practices
- **Error Transparency:** Always include error information in API responses
- **Graceful Degradation:** Partial failures shouldn't break the entire system
- **Resource Management:** Proper cleanup of external resources (browsers, connections)
- **Monitoring:** Regular health checks and performance monitoring

---

## Future Enhancements

### Potential Improvements
1. **WebSocket Support:** Real-time data updates
2. **Multiple Data Sources:** Redundancy for critical data
3. **Advanced Caching:** Redis-based distributed caching
4. **Data Validation:** Schema validation for external data
5. **Analytics Dashboard:** Performance monitoring and metrics

### Scalability Considerations
1. **Horizontal Scaling:** Load balancing for multiple instances
2. **Database Integration:** Store historical data and trends
3. **Background Jobs:** Scheduled data updates and processing
4. **API Rate Limiting:** Protect against abuse

---

## Contact
For questions or improvements, please contact the project maintainer. 