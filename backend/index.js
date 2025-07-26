const express = require('express');
const cors = require('cors');
require('dotenv').config();

const portfolioRoutes = require('./routes/portfolioRoutes');
const { getYahooStockData } = require('./services/yahooService');
const { getGoogleFinanceData } = require('./services/googleService');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/portfolio', portfolioRoutes);

app.get('/api/test/yahoo/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const result = await getYahooStockData(symbol);
  res.json(result);
});

//Google Finance API Test Endpoint is working fine but for PE Ratio , I have used yfinance2 library Only
//As Google Finance API uses scraping which is not reliable and also its very heavy on the server.
app.get('/api/test/google/:symbol', async (req, res) => {
  const symbol = req.params.symbol;
  const result = await getGoogleFinanceData(symbol);
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
