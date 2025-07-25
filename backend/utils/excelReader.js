const xlsx = require('xlsx');

/**
 * Reads the portfolio Excel file and returns an array of stock objects.
 * - Detects sector headers (e.g., 'Financial Sector') and assigns the sector to each stock row below it.
 * - Skips empty rows and summary rows.
 * - Handles extra spaces and case differences in sector headers.
 *
 * @param {string} filePath - Path to the Excel file (default: './portfolio.xlsx')
 * @returns {Array<Object>} Array of stock rows with sector assigned
 */
function readPortfolioFromExcel(filePath = './portfolio.xlsx') {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  let currentSector = '';
  const stocks = [];

  data.forEach((row) => {
    // Get the 'Particulars' cell, trim whitespace
    let particulars = row['Particulars']?.trim();
    if (!particulars) return;

    // Detect sector header rows (e.g., 'Tech Sector', 'Consumer Sector', 'Others')
    // Normalize: remove extra spaces, lowercase
    const normalized = particulars.replace(/\s+/g, ' ').trim().toLowerCase();
    if (/sector$/.test(normalized) || normalized === 'others') {
      // Set the current sector for subsequent stock rows
      currentSector = particulars.replace(/\s*Sector$/i, '').trim();
      return;
    }

    // Skip rows that are not stocks (e.g., empty, summary, or dash rows)
    if (!particulars || particulars === '-') return;

    // Assign the detected sector to this stock row
    stocks.push({ ...row, sector: currentSector });
  });

  return stocks;
}

module.exports = { readPortfolioFromExcel };
