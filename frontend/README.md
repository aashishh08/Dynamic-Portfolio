# Portfolio Frontend

This is the frontend for the Portfolio Dashboard, built with Next.js, React, and Tailwind CSS. It provides a modern, responsive UI for visualizing your investment portfolio, fetching live data from the backend API.

## Features
- **Dashboard UI:** Clean, responsive layout with summary cards, sector breakdown, and detailed holdings table.
- **Live Data:** Fetches portfolio data from the backend (`/api/portfolio`) and auto-refreshes every 15 seconds.
- **Portfolio Table:** Sortable, responsive table with gain/loss coloring, error display, and unsupported stock warnings.
- **Sector Summary:** Visualizes sector allocation, investment, and gain/loss per sector.
- **Overview Cards:** Shows total investment, current value, total gain/loss, and return %.
- **Error Handling:** User-friendly error messages and retry options if data fetch fails.
- **Manual Refresh:** Refresh button in the header to fetch the latest data on demand.
- **Real-time Updates:** Automatic data refresh every 15 seconds to keep portfolio data current.
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile devices.

## Technologies Used
- [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [react-table](https://tanstack.com/table/v8) for table logic
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Lucide React](https://lucide.dev/) for icons

## Getting Started

### Prerequisites
- Node.js 20+
- Backend server running at `http://localhost:4000` (see backend/README.md)

### Installation
1. **Install dependencies:**
   ```bash
   yarn install
   # or
   npm install
   ```
2. **(Optional) Configure environment variables:**
   - By default, the frontend expects the backend at `http://localhost:4000`. To change this, update the fetch URL in `hooks/usePortfolio.ts`.

### Development
Start the development server:
```bash
yarn dev
# or
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
To build and start for production:
```bash
yarn build && yarn start
# or
npm run build && npm start
```

## Project Structure
```
frontend/
├── app/                    # Next.js app directory (main pages, layout)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main dashboard page
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   ├── error-message.tsx # Error display component
│   ├── header.tsx        # Dashboard header
│   ├── loading-spinner.tsx # Loading indicator
│   ├── portfolio-overview.tsx # Summary cards
│   ├── portfolio-table.tsx # Main portfolio table
│   └── sector-summary.tsx # Sector breakdown
├── hooks/                # Custom React hooks
│   └── usePortfolio.ts   # Portfolio data fetching hook
├── types/                # TypeScript type definitions
│   └── portfolio.ts      # Portfolio data types
└── lib/                  # Utility functions
    └── utils.ts          # Helper functions
```

## How It Works
- **Data Fetching:** Uses `usePortfolio` hook to fetch portfolio and sector data from the backend API (`/api/portfolio`).
- **Auto-refresh:** Automatically refreshes data every 15 seconds to keep information current.
- **Error Handling:** Displays user-friendly error messages and provides retry functionality.
- **Responsive Design:** Adapts layout and table display for different screen sizes.
- **Real-time Updates:** Shows live stock prices, P/E ratios, and earnings data from Yahoo Finance and Screener.in.

## Key Components

### Portfolio Overview
- Displays summary cards with total investment, current value, gain/loss, and return percentage
- Real-time calculations based on live market data

### Portfolio Table
- Sortable table showing all holdings with detailed information
- Color-coded gain/loss indicators
- Error states for failed data fetches
- Unsupported stock warnings

### Sector Summary
- Visual breakdown of portfolio by sector
- Shows sector-wise investment allocation and performance
- Helps identify sector concentration and diversification

## Customization & Extensibility
- **UI:** Easily customize with Tailwind and shadcn/ui components.
- **API URL:** Change the backend API URL in `hooks/usePortfolio.ts` if needed.
- **Refresh Interval:** Modify the auto-refresh interval in `hooks/usePortfolio.ts`.
- **Add Features:** Extend with new charts, filters, or analytics as desired.
- **Styling:** Customize colors, fonts, and layout using Tailwind CSS classes.

## Troubleshooting
- **CORS errors:** Ensure the backend has CORS enabled (it does by default).
- **API not reachable:** Make sure the backend is running at the expected URL.
- **Data not updating:** Check if the backend is successfully fetching live data from Yahoo Finance and Screener.in.
- **TypeScript errors:** The project is strict by default; fix type errors for best results.
- **Build issues:** Ensure all dependencies are properly installed and Node.js version is compatible.

## Performance Considerations
- Auto-refresh is set to 15 seconds to balance data freshness with server load
- Data is cached in the browser to reduce unnecessary API calls
- Table virtualization is used for large portfolios to maintain smooth scrolling
- Error boundaries prevent component crashes from affecting the entire app

## License
MIT 