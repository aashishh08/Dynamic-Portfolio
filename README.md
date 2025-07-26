# Dynamic Portfolio Dashboard

> **Note**: This project was primarily developed manually with minimal AI assistance used for code comments, technical documentation formatting, and minor optimizations. The core architecture, business logic, and implementation decisions are entirely by me.

A comprehensive portfolio management system with real-time stock data, built with Next.js frontend and Node.js backend. The system reads portfolio data from Excel files and fetches live market data from multiple sources to provide an up-to-date view of your investments.

## 🚀 Features

### Portfolio Management
- **Excel Integration**: Read portfolio data directly from Excel files with sector grouping
- **Real-time Data**: Live stock prices, P/E ratios, and earnings data
- **Sector Analysis**: Automatic sector grouping and performance analysis
- **Gain/Loss Tracking**: Real-time calculation of portfolio performance

### Data Sources
- **NSE Stocks**: Yahoo Finance via `yahoo-finance2` library
- **BSE Stocks**: Screener.in via web scraping
- **Test Endpoints**: Google Finance for debugging and comparison

### User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Auto-refresh**: Updates data every 15 seconds
- **Error Handling**: Graceful error display and retry mechanisms
- **Sortable Tables**: Interactive portfolio table with sorting capabilities

## 🏗️ Architecture

```
Portfolio/
├── backend/                 # Node.js Express API
│   ├── controllers/        # API route handlers
│   ├── services/          # Data fetching services
│   ├── utils/             # Excel reader and utilities
│   └── routes/            # API route definitions
├── frontend/              # Next.js React application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript definitions
└── docker-compose.yml    # Docker configuration
```

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js
- **Yahoo Finance API** via `yahoo-finance2`
- **Web Scraping** with Puppeteer and Cheerio
- **Caching** with NodeCache
- **Concurrency Control** with p-limit and p-queue

### Frontend
- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **react-table** for table functionality

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Excel file with portfolio data

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Place your portfolio.xlsx file in the backend directory
   npm start
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

## 📊 Excel File Format

Create a `portfolio.xlsx` file in the backend directory with the following structure:

| Particulars        | Symbol    | Purchase Price | Qty |
|--------------------|-----------|---------------|-----|
| Financial Sector   |           |               |     |
| HDFC Bank         | HDFCBANK  | 1500          | 10  |
| ICICI Bank        | ICICIBANK | 900           | 5   |
| Tech Sector       |           |               |     |
| Infosys           | INFY      | 1400          | 8   |

**Note**: The system automatically assigns sectors to stocks based on sector headers in the "Particulars" column.

## 🔌 API Endpoints

### Main Endpoints
- `GET /api/portfolio` - Get complete portfolio data with live market information

### Test Endpoints
- `GET /api/test/yahoo/:symbol` - Test Yahoo Finance data for NSE stocks
- `GET /api/test/google/:symbol` - Test Google Finance data (debugging only)

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
- In ./Frontend, add .env which should have api base to backend. For ex - 
NEXT_PUBLIC_API_BASE=http://localhost:4000/api
docker compose up --build -d
```

### Manual Deployment
1. Build the frontend: `cd frontend && npm run build`
2. Start the backend: `cd backend && npm start`
3. Serve the frontend build files

## 🔧 Configuration

### Environment Variables
- `PORT` - Backend server port (default: 4000)
- No API keys required - uses public data sources

### Customization
- **Data Sources**: Modify services in `backend/services/`
- **UI Components**: Customize components in `frontend/components/`
- **Styling**: Update Tailwind classes in components
- **Refresh Interval**: Modify in `frontend/hooks/usePortfolio.ts`

## 📈 Data Sources Strategy

### Production Data Sources
- **NSE Stocks**: Yahoo Finance (reliable, structured data)
- **BSE Stocks**: Screener.in (comprehensive financial data)

### Test Data Sources
- **Google Finance**: Available for testing but not used in production

## 🛡️ Error Handling

- **Graceful Degradation**: Partial failures don't break the entire system
- **User-Friendly Errors**: Clear error messages and retry options
- **Data Validation**: Robust handling of missing or invalid data
- **Fallback Mechanisms**: Multiple data extraction strategies

## 🔍 Monitoring & Debugging

- **Error Logging**: Detailed error messages with context
- **Performance Monitoring**: Request times and success rates
- **Health Checks**: API response validation
- **Test Endpoints**: Individual service testing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the troubleshooting sections in README files
2. Review error logs in the backend
3. Test individual endpoints for debugging
4. Create an issue with detailed error information

---

**Note**: This system uses unofficial data sources (Yahoo Finance, Screener.in). While robust error handling is implemented, these sources may change their structure, potentially requiring updates to the scraping logic.