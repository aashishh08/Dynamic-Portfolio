const xlsx = require('xlsx');

function readPortfolioFromExcel(filePath = './portfolio.xlsx') {
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  let currentSector = '';
  const stocks = [];

  data.forEach((row) => {
    const particulars = row['Particulars']?.trim();
    if (!particulars) return;
    // Detect sector header
    if (/Sector$/i.test(particulars) || /^Others$/i.test(particulars)) {
      currentSector = particulars.replace(/ Sector$/i, '').trim();
      return;
    }
    // Skip rows that are not stocks (e.g., empty, summary rows)
    if (!particulars || particulars === '-') return;
    // Assign sector to stock row
    stocks.push({ ...row, sector: currentSector });
  });

  return stocks;
}

module.exports = { readPortfolioFromExcel };
