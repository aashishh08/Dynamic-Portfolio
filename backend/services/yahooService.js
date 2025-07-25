const yahooFinance = require('yahoo-finance2').default;
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 15 }); // 15 sec caching

function formatYahooSymbol(symbol) {
  if (!symbol) return '';
  if (symbol.endsWith('.NS') || symbol.endsWith('.BO')) return symbol;
  // Default to NSE if not specified
  return `${symbol}.NS`;
}

async function getYahooStockData(symbol) {
  if (!symbol) return { cmp: null, error: 'Symbol is required' };

  const formattedSymbol = formatYahooSymbol(symbol);
  const cacheKey = formattedSymbol;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const result = await yahooFinance.quoteSummary(formattedSymbol, { modules: ['price'] });
    const cmp = result.price.regularMarketPrice;
    const out = { cmp, error: null };
    cache.set(cacheKey, out);
    return out;
  } catch (err) {
    console.error(`❌ YahooFinance2 Error for ${formattedSymbol}:`, err.message);
    return { cmp: null, error: err.message };
  }
}

module.exports = { getYahooStockData };
