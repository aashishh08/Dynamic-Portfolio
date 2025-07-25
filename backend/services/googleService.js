const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const puppeteer = require('puppeteer');
const PQueue = require('p-queue').default;
const queue = new PQueue({ concurrency: 2 });
const cache = new NodeCache({ stdTTL: 15 }); // 15 sec caching

async function getGoogleFinanceData(symbol) {
  if (!symbol) throw new Error('Symbol is required');

  const cacheKey = symbol;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    return await queue.add(async () => {
      const url = `https://www.google.com/finance/quote/${symbol}:NSE`;
      const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

      // Wait for the summary table or key statistics to load
      await page.waitForSelector('div[data-attrid], table, .gyFHrc, .P6K39c', { timeout: 10000 });
      const content = await page.content();
      await browser.close();

      const $ = cheerio.load(content);
      let peRatio = null;
      let latestEarnings = null;

      // Try to find P/E and Earnings in all tables and key-statistics divs
      $('div[data-attrid], table').each((_, el) => {
        $(el).find('tr').each((_, tr) => {
          const label = $(tr).find('td, th').first().text().trim();
          const value = $(tr).find('td, th').last().text().trim();
          if (/P\/E/i.test(label) && !peRatio) peRatio = value;
          if (/Earnings/i.test(label) && !latestEarnings) latestEarnings = value;
        });
      });

      // Fallback: try to find in any divs with class names
      if (!peRatio || !latestEarnings) {
        $('[class]').each((_, el) => {
          const text = $(el).text();
          if (/P\/E/i.test(text) && !peRatio) peRatio = text.match(/P\/E.*?(\d+\.?\d*)/i)?.[1];
          if (/Earnings/i.test(text) && !latestEarnings) latestEarnings = text.match(/Earnings.*?(\d+\.?\d*)/i)?.[1];
        });
      }

      peRatio = peRatio || 'N/A';
      latestEarnings = latestEarnings || 'N/A';

      const result = { peRatio, latestEarnings };
      cache.set(cacheKey, result);
      return result;
    });
  } catch (err) {
    console.error(`❌ Google Finance Puppeteer error for ${symbol}:`, err.message);
    return { peRatio: 'N/A', latestEarnings: 'N/A', error: err.message };
  }
}

module.exports = { getGoogleFinanceData };
  