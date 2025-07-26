// Portfolio controller: Handles portfolio API requests, reads Excel, fetches live data, and computes sector summaries.
const { readPortfolioFromExcel } = require('../utils/excelReader');
const { getYahooStockData, getScreenerBseStockData } = require('../services/yahooService');
const { getGoogleFinanceData } = require('../services/googleService');
const pLimit = require('p-limit').default;


async function getPortfolioData(req, res) {
  try {
    // Read all stocks from the Excel file (with sector assignment)
    const rawData = readPortfolioFromExcel();
    // No slice limit: process all stocks
    const limitedData = rawData;

    // Compute total investment for portfolio percentage calculation
    let totalInvestment = 0;
    limitedData.forEach((item) => {
      const qty = Number(item['Qty'] || item['__EMPTY_3']) || 0;
      const price = Number(item['Purchase Price'] || item['__EMPTY_2']) || 0;
      totalInvestment += qty * price;
    });

    // Limit concurrency for external API calls to avoid rate-limiting
    const yahooLimit = pLimit(2); // Max 2 Yahoo calls at a time
    const googleLimit = pLimit(2); // Max 2 Google calls at a time

    // For each stock, fetch live data and compute derived fields
    const processedData = await Promise.all(
      limitedData.map(async (item) => {
        const stockName = item['Particulars'] || item['__EMPTY_1'];
        const rawSymbol = item['Symbol'] || item['NSE/BSE'] || item['__EMPTY_6'];
        const purchasePrice = Number(item['Purchase Price'] || item['__EMPTY_2']) || 0;
        const quantity = Number(item['Qty'] || item['__EMPTY_3']) || 0;
        const sector = item['sector'] || 'Unknown';

        // Skip rows with missing stock or symbol
        if (!rawSymbol || !stockName) {
          // This can happen if the Excel has blank or malformed rows
          return null;
        }

        // Determine if this is a BSE (numeric) or NSE (string) symbol
        const isNumeric = /^\d+$/.test(rawSymbol);
        const fullSymbol = `${rawSymbol}${isNumeric ? '.BO' : '.NS'}`;

        // Fetch live data from the appropriate source
        let cmp = null, cmpError = null, peRatio = 'N/A', latestEarnings = 'N/A', unsupported = false, unsupportedReason = '';
        if (isNumeric) {
          // BSE stock: use Screener.in scraper
          let screenerResult = { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', error: 'Not fetched' };
          try {
            screenerResult = await getScreenerBseStockData(rawSymbol);
          } catch (e) {
            screenerResult = { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', error: e.message };
          }
          cmp = screenerResult.cmp;
          cmpError = screenerResult.error;
          peRatio = screenerResult.peRatio;
          latestEarnings = screenerResult.latestEarnings;
          if (cmp === null) {
            unsupported = true;
            unsupportedReason = 'Unsupported symbol: BSE code not found on Screener.';
          }
        } else {
          // NSE stock: use Yahoo Finance
          let yahooResult = { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', error: 'Not fetched' };
          try {
            yahooResult = await yahooLimit(async () => {
              const result = await getYahooStockData(fullSymbol, true); // pass true to get extra data
              return result;
            });
          } catch (e) {
            yahooResult = { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', error: e.message };
          }
          cmp = yahooResult.cmp;
          cmpError = yahooResult.error;
          peRatio = yahooResult.peRatio;
          latestEarnings = yahooResult.latestEarnings;
          if (cmp === null) {
            unsupported = true;
            unsupportedReason = 'Unsupported symbol: Not available on Yahoo Finance.';
          }
        }

        // Calculate present value and gain/loss
        const presentValue = cmp !== null ? cmp * quantity : null;
        const gainLoss = presentValue !== null ? presentValue - (quantity * purchasePrice) : null;

        // Return the enriched stock object
        return {
          stockName,
          symbol: rawSymbol,
          fullSymbol,
          purchasePrice,
          quantity,
          investment: quantity * purchasePrice,
          cmp,
          cmpError,
          presentValue,
          gainLoss,
          peRatio,
          latestEarnings,
          portfolioPercent: totalInvestment ? ((quantity * purchasePrice / totalInvestment) * 100).toFixed(2) : '0',
          sector,
          unsupported,
          unsupportedReason,
        };
      })
    );

    // Remove any nulls (skipped rows)
    const cleaned = processedData.filter(Boolean);

    // Group stocks by sector and compute sector-level summaries
    const sectorMap = {};
    cleaned.forEach((stock) => {
      if (!sectorMap[stock.sector]) {
        sectorMap[stock.sector] = {
          sector: stock.sector,
          totalInvestment: 0,
          totalPresentValue: 0,
          totalGainLoss: 0,
          stocks: [],
        };
      }
      sectorMap[stock.sector].totalInvestment += stock.investment;
      sectorMap[stock.sector].totalPresentValue += stock.presentValue;
      sectorMap[stock.sector].totalGainLoss += stock.gainLoss;
      sectorMap[stock.sector].stocks.push(stock);
    });
    const sectorSummaries = Object.values(sectorMap).map((s) => ({
      sector: s.sector,
      totalInvestment: s.totalInvestment,
      totalPresentValue: s.totalPresentValue,
      totalGainLoss: s.totalGainLoss,
      stocks: s.stocks,
    }));

    // Send the portfolio data and sector summaries to the frontend
    res.json({
      data: cleaned,
      sectorSummaries,
    });
  } catch (err) {
    // Log and return a user-friendly error
    console.error('💥 Error in getPortfolioData:', err);
    res.status(500).json({ error: 'Something went wrong while fetching portfolio data.' });
  }
}

module.exports = { getPortfolioData };
