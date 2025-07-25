const express = require('express');
const router = express.Router();
const { getPortfolioData } = require('../controllers/portfolioController');

router.get('/', getPortfolioData);

module.exports = router;
