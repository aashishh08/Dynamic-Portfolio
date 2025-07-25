import { NextResponse } from "next/server"

// Mock data that matches your backend structure
const mockPortfolioData = {
  data: [
    {
      stockName: "HDFC Bank",
      symbol: "HDFCBANK",
      fullSymbol: "HDFCBANK.NS",
      purchasePrice: 1500,
      quantity: 10,
      investment: 15000,
      cmp: 2014.2,
      cmpError: null,
      presentValue: 20142,
      gainLoss: 5142,
      peRatio: "21.89",
      latestEarnings: "-1.32%",
      googleError: null,
      portfolioPercent: "10.00",
      sector: "Financial",
    },
    {
      stockName: "Reliance Industries",
      symbol: "RELIANCE",
      fullSymbol: "RELIANCE.NS",
      purchasePrice: 2450,
      quantity: 20,
      investment: 49000,
      cmp: 2680.5,
      cmpError: null,
      presentValue: 53610,
      gainLoss: 4610,
      peRatio: "28.45",
      latestEarnings: "2.15%",
      googleError: null,
      portfolioPercent: "32.67",
      sector: "Energy",
    },
    {
      stockName: "Tata Consultancy Services",
      symbol: "TCS",
      fullSymbol: "TCS.NS",
      purchasePrice: 3200,
      quantity: 15,
      investment: 48000,
      cmp: 3450.75,
      cmpError: null,
      presentValue: 51761.25,
      gainLoss: 3761.25,
      peRatio: "25.20",
      latestEarnings: "1.85%",
      googleError: null,
      portfolioPercent: "32.00",
      sector: "Technology",
    },
    {
      stockName: "ICICI Bank",
      symbol: "ICICIBANK",
      fullSymbol: "ICICIBANK.NS",
      purchasePrice: 900,
      quantity: 25,
      investment: 22500,
      cmp: 1020.3,
      cmpError: null,
      presentValue: 25507.5,
      gainLoss: 3007.5,
      peRatio: "18.75",
      latestEarnings: "0.95%",
      googleError: null,
      portfolioPercent: "15.00",
      sector: "Financial",
    },
    {
      stockName: "Infosys",
      symbol: "INFY",
      fullSymbol: "INFY.NS",
      purchasePrice: 1420,
      quantity: 10,
      investment: 14200,
      cmp: 1580.3,
      cmpError: null,
      presentValue: 15803,
      gainLoss: 1603,
      peRatio: "22.10",
      latestEarnings: "1.25%",
      googleError: null,
      portfolioPercent: "9.47",
      sector: "Technology",
    },
  ],
  sectorSummaries: [
    {
      sector: "Financial",
      totalInvestment: 37500,
      totalPresentValue: 45649.5,
      totalGainLoss: 8149.5,
      stocks: ["HDFC Bank", "ICICI Bank"],
    },
    {
      sector: "Energy",
      totalInvestment: 49000,
      totalPresentValue: 53610,
      totalGainLoss: 4610,
      stocks: ["Reliance Industries"],
    },
    {
      sector: "Technology",
      totalInvestment: 62200,
      totalPresentValue: 67564.25,
      totalGainLoss: 5364.25,
      stocks: ["Tata Consultancy Services", "Infosys"],
    },
  ],
}

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Add some random fluctuation to simulate real-time data
    const updatedData = {
      ...mockPortfolioData,
      data: mockPortfolioData.data.map((stock) => {
        const fluctuation = (Math.random() - 0.5) * 20 // ±10 price change
        const newCmp = Math.max(stock.cmp + fluctuation, 1) // Ensure price doesn't go below 1
        const newPresentValue = newCmp * stock.quantity
        const newGainLoss = newPresentValue - stock.investment

        return {
          ...stock,
          cmp: Number.parseFloat(newCmp.toFixed(2)),
          presentValue: Number.parseFloat(newPresentValue.toFixed(2)),
          gainLoss: Number.parseFloat(newGainLoss.toFixed(2)),
        }
      }),
    }

    // Recalculate sector summaries
    const sectorMap = new Map()
    updatedData.data.forEach((stock) => {
      if (!sectorMap.has(stock.sector)) {
        sectorMap.set(stock.sector, {
          sector: stock.sector,
          totalInvestment: 0,
          totalPresentValue: 0,
          totalGainLoss: 0,
          stocks: [],
        })
      }

      const sector = sectorMap.get(stock.sector)
      sector.totalInvestment += stock.investment
      sector.totalPresentValue += stock.presentValue
      sector.totalGainLoss += stock.gainLoss
      sector.stocks.push(stock.stockName)
    })

    updatedData.sectorSummaries = Array.from(sectorMap.values())

    return NextResponse.json(updatedData)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch portfolio data" }, { status: 500 })
  }
}
