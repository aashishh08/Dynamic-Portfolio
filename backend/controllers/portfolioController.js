const { readPortfolioFromExcel } = require('../utils/excelReader');
const { getYahooStockData } = require('../services/yahooService');
const { getGoogleFinanceData } = require('../services/googleService');

async function getPortfolioData(req, res) {
  try {
    const rawData = readPortfolioFromExcel();
    console.log('DEBUG: Raw data from Excel:', JSON.stringify(rawData, null, 2));

    // Compute total investment
    let totalInvestment = 0;
    rawData.forEach((item) => {
      const qty = Number(item['Qty'] || item['__EMPTY_3']) || 0;
      const price = Number(item['Purchase Price'] || item['__EMPTY_2']) || 0;
      totalInvestment += qty * price;
    });

    const processedData = await Promise.all(
      rawData.map(async (item) => {
        const stockName = item['Particulars'] || item['__EMPTY_1'];
        const rawSymbol = item['Symbol'] || item['NSE/BSE'] || item['__EMPTY_6'];
        const purchasePrice = Number(item['Purchase Price'] || item['__EMPTY_2']) || 0;
        const quantity = Number(item['Qty'] || item['__EMPTY_3']) || 0;
        const sector = item['sector'] || 'Unknown';

        if (!rawSymbol || !stockName) {
          console.warn(`⚠️ Skipping row with missing stock/symbol:`, item);
          return null;
        }

        // Determine exchange suffix: .NS (NSE) or .BO (BSE)
        const isNumeric = /^\d+$/.test(rawSymbol);
        const fullSymbol = `${rawSymbol}${isNumeric ? '.BO' : '.NS'}`;

        // Yahoo Finance (CMP)
        const yahooResult = await getYahooStockData(fullSymbol);
        const cmp = yahooResult.cmp;
        const cmpError = yahooResult.error;
        const presentValue = cmp !== null ? cmp * quantity : null;
        const gainLoss = presentValue !== null ? presentValue - (quantity * purchasePrice) : null;

        // Google Finance (P/E, Earnings)
        const googleResult = await getGoogleFinanceData(rawSymbol);
        const peRatio = googleResult.peRatio;
        const latestEarnings = googleResult.latestEarnings;
        const googleError = googleResult.error;

        // Mark as unsupported if both Yahoo and Google fail for numeric BSE code
        let unsupported = false;
        let unsupportedReason = '';
        if (/^\d+$/.test(rawSymbol) && cmpError && googleError) {
          unsupported = true;
          unsupportedReason = 'Unsupported symbol: BSE numeric codes are not available on Yahoo/Google Finance.';
        }

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
          googleError,
          portfolioPercent: totalInvestment ? ((quantity * purchasePrice / totalInvestment) * 100).toFixed(2) : '0',
          sector,
          unsupported,
          unsupportedReason,
        };
      })
    );

    // Remove nulls (skipped rows)
    const cleaned = processedData.filter(Boolean);

    // Group by sector and compute sector summaries
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
      stocks: s.stocks.map(({ sector, ...rest }) => rest), // omit sector in nested stocks
    }));

    res.json({
      data: cleaned,
      sectorSummaries,
    });
  } catch (err) {
    console.error('💥 Error in getPortfolioData:', err.message);
    res.status(500).json({ error: 'Something went wrong while fetching portfolio data.' });
  }
}

module.exports = { getPortfolioData };
