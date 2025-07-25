const yahooFinance = require('yahoo-finance2').default;
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 15 }); // 15 sec caching for Yahoo
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const screenerCache = new NodeCache({ stdTTL: 300 }); // 5 min cache for Screener

/**
 * Formats a stock symbol for Yahoo Finance (adds .NS for NSE, .BO for BSE if needed).
 * @param {string} symbol - The stock symbol (e.g., 'HDFCBANK' or '532174')
 * @returns {string} Formatted symbol for Yahoo
 */
function formatYahooSymbol(symbol) {
  if (!symbol) return '';
  if (symbol.endsWith('.NS') || symbol.endsWith('.BO')) return symbol;
  // Default to NSE if not specified
  return `${symbol}.NS`;
}

/**
 * Helper to extract a value that may be a number or an object with a .raw property.
 * @param {any} val
 * @returns {number|undefined}
 */
function extractValue(val) {
  if (val == null) return undefined;
  if (typeof val === 'number') return val;
  if (typeof val === 'object' && 'raw' in val) return val.raw;
  return undefined;
}

/**
 * Fetches live CMP, P/E, and EPS for a stock from Yahoo Finance.
 * - Uses caching to avoid rate-limiting.
 * - Optionally fetches extra modules for P/E and EPS.
 * @param {string} symbol - Stock symbol (with or without .NS/.BO)
 * @param {boolean} getExtra - If true, fetches P/E and EPS as well
 * @returns {Promise<{cmp: number|null, peRatio: any, latestEarnings: any, error: string|null}>}
 */
async function getYahooStockData(symbol, getExtra = false) {
  if (!symbol) return { cmp: null, error: 'Symbol is required' };

  const formattedSymbol = formatYahooSymbol(symbol);
  const cacheKey = formattedSymbol + (getExtra ? '_extra' : '');
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    if (!getExtra) {
      const result = await yahooFinance.quoteSummary(formattedSymbol, { modules: ['price'] });
      const cmp = result.price.regularMarketPrice;
      const out = { cmp, error: null };
      cache.set(cacheKey, out);
      return out;
    } else {
      const result = await yahooFinance.quoteSummary(formattedSymbol, { modules: ['price', 'summaryDetail', 'defaultKeyStatistics', 'financialData'] });
      const cmp = result.price.regularMarketPrice;
      // Try to get P/E ratio and EPS from multiple places
      const peRatio =
        extractValue(result.summaryDetail.trailingPE) ||
        extractValue(result.defaultKeyStatistics.trailingPE) ||
        extractValue(result.financialData.trailingPE) ||
        'N/A';
      const latestEarnings =
        extractValue(result.defaultKeyStatistics.trailingEps) ||
        extractValue(result.financialData.epsTrailingTwelveMonths) ||
        'N/A';
      const out = { cmp, peRatio, latestEarnings, error: null };
      cache.set(cacheKey, out);
      return out;
    }
  } catch (err) {
    if (!getExtra) return { cmp: null, error: err.message };
    return { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', error: err.message };
  }
}

/**
 * Fetches live CMP, P/E, EPS, and other key ratios for a BSE stock from Screener.in.
 * - Uses Puppeteer for robust scraping, with fallback to axios/cheerio.
 * - Caches results for 5 minutes to avoid rate-limiting.
 * - Extracts additional fields as per assignment requirements.
 * @param {string} symbol - BSE code (e.g., '532174')
 * @returns {Promise<Object>} Object with all extracted fields
 */
async function getScreenerBseStockData(symbol) {
  if (!symbol) return { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', error: 'Symbol is required' };
  const cacheKey = `screener_${symbol}`;
  const cached = screenerCache.get(cacheKey);
  if (cached) return cached;
  let browser;
  try {
    // Add a 2-second delay to avoid rate-limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
    const url = `https://www.screener.in/company/${symbol}/`;
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 40000 });
    await new Promise(res => setTimeout(res, 4000)); // Wait for page to render

    // Scrape all top ratios (Market Cap, P/E, ROE, etc.)
    const topRatios = await page.$$eval(
      '#top-ratios li',
      items =>
        items.map(li => {
          const label = li.querySelector('.name')?.innerText.trim();
          const value = li.querySelector('.number')?.innerText.trim();
          return { label, value };
        })
    );

    // Find values by label
    let cmp = null, peRatio = 'N/A', latestEarnings = 'N/A', marketCap = 'N/A', bookValue = 'N/A', dividendYield = 'N/A', roe = 'N/A', roce = 'N/A', faceValue = 'N/A';
    for (const { label, value } of topRatios) {
      if (label && /Current Price/i.test(label)) cmp = value ? parseFloat(value.replace(/[^\d.]/g, '')) : null;
      if (label && /Stock P\/E/i.test(label)) peRatio = value ? value.replace(/[^\d.]/g, '') : 'N/A';
      if (label && /EPS/i.test(label)) latestEarnings = value ? value.replace(/[^\d.\-]/g, '') : 'N/A';
      if (label && /Market Cap/i.test(label)) marketCap = value || 'N/A';
      if (label && /Book Value/i.test(label)) bookValue = value || 'N/A';
      if (label && /Dividend Yield/i.test(label)) dividendYield = value || 'N/A';
      if (label && /ROE/i.test(label)) roe = value || 'N/A';
      if (label && /ROCE/i.test(label)) roce = value || 'N/A';
      if (label && /Face Value/i.test(label)) faceValue = value || 'N/A';
    }

    // Fallback: Try to get EPS from the Profit & Loss table if not found in top ratios
    if (!latestEarnings || latestEarnings === 'N/A') {
      const epsFromPL = await page.$$eval(
        '#profit-loss tr',
        rows => {
          for (const row of rows) {
            const label = row.querySelector('td')?.innerText.trim();
            if (label && /EPS/i.test(label)) {
              const tds = row.querySelectorAll('td');
              const last = tds[tds.length - 1];
              if (last) {
                return last.innerText.trim().replace(/[^\d.\-]/g, '') || 'N/A';
              }
            }
          }
          return 'N/A';
        }
      );
      if (epsFromPL && epsFromPL !== 'N/A') latestEarnings = epsFromPL;
    }

    await browser.close();
    if (cmp === null) {
      return { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', marketCap: 'N/A', bookValue: 'N/A', dividendYield: 'N/A', roe: 'N/A', roce: 'N/A', faceValue: 'N/A', error: null };
    }
    const out = { cmp, peRatio, latestEarnings, marketCap, bookValue, dividendYield, roe, roce, faceValue, error: null };
    screenerCache.set(cacheKey, out);
    return out;
  } catch (err) {
    if (browser) await browser.close();
    // Fallback to axios/cheerio if Puppeteer fails
    try {
      const url = `https://www.screener.in/company/${symbol}/`;
      const { data: html } = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const $ = cheerio.load(html);
      let cmp = null, peRatio = 'N/A', latestEarnings = 'N/A', marketCap = 'N/A', bookValue = 'N/A', dividendYield = 'N/A', roe = 'N/A', roce = 'N/A', faceValue = 'N/A';
      $('#top-ratios li').each((_, el) => {
        const label = $(el).find('.name').text().trim();
        const value = $(el).find('.number').text().trim();
        if (/Current Price/i.test(label)) cmp = value ? parseFloat(value.replace(/[^\d.]/g, '')) : null;
        if (/Stock P\/E/i.test(label)) peRatio = value ? value.replace(/[^\d.]/g, '') : 'N/A';
        if (/EPS/i.test(label)) latestEarnings = value ? value.replace(/[^\d.\-]/g, '') : 'N/A';
        if (/Market Cap/i.test(label)) marketCap = value || 'N/A';
        if (/Book Value/i.test(label)) bookValue = value || 'N/A';
        if (/Dividend Yield/i.test(label)) dividendYield = value || 'N/A';
        if (/ROE/i.test(label)) roe = value || 'N/A';
        if (/ROCE/i.test(label)) roce = value || 'N/A';
        if (/Face Value/i.test(label)) faceValue = value || 'N/A';
      });
      if (cmp === null) {
        return { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', marketCap: 'N/A', bookValue: 'N/A', dividendYield: 'N/A', roe: 'N/A', roce: 'N/A', faceValue: 'N/A', error: null };
      }
      const out = { cmp, peRatio, latestEarnings, marketCap, bookValue, dividendYield, roe, roce, faceValue, error: null };
      screenerCache.set(cacheKey, out);
      return out;
    } catch (fallbackErr) {
      return { cmp: null, peRatio: 'N/A', latestEarnings: 'N/A', error: fallbackErr.message };
    }
  }
}

module.exports = { getYahooStockData, getScreenerBseStockData };
