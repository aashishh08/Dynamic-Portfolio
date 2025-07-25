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
- **Branding:** Includes company name and CIN in the header.

## Technologies Used
- [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- [React 19](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [react-table](https://tanstack.com/table/v8) for table logic
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Recharts](https://recharts.org/) for charts (if used)

## Getting Started

### Prerequisites
- Node.js 18+
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
- `app/` — Next.js app directory (main pages, API routes)
- `components/` — Reusable UI components (table, overview, sector summary, etc.)
- `hooks/` — Custom React hooks (e.g., `usePortfolio` for data fetching)
- `types/` — TypeScript types for portfolio data
- `styles/` — Global styles (Tailwind)

## How It Works
- Fetches portfolio and sector data from the backend API (`/api/portfolio`).
- Displays summary cards (investment, value, gain/loss, return %).
- Shows a detailed table of holdings, with error and unsupported stock handling.
- Sector summary visualizes allocation and performance by sector.
- Auto-refreshes every 15 seconds; manual refresh available.

## Customization & Extensibility
- **UI:** Easily customize with Tailwind and shadcn/ui components.
- **API URL:** Change the backend API URL in `hooks/usePortfolio.ts` if needed.
- **Add Features:** Extend with new charts, filters, or analytics as desired.

## Troubleshooting
- **CORS errors:** Ensure the backend has CORS enabled (it does by default).
- **API not reachable:** Make sure the backend is running at the expected URL.
- **Puppeteer errors:** If backend data is missing, check backend logs for scraping issues.
- **TypeScript errors:** The project is strict by default; fix type errors for best results.

## License
MIT 