import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Mock Yahoo Finance response with realistic price data
    const mockPrices: Record<string, number> = {
      HDFCBANK: 2014.2,
      RELIANCE: 2680.5,
      TCS: 3450.75,
      ICICIBANK: 1020.3,
      INFY: 1580.3,
    }

    const basePrice = mockPrices[symbol] || 1000
    const fluctuation = (Math.random() - 0.5) * 20
    const cmp = Math.max(basePrice + fluctuation, 1)

    return NextResponse.json({
      cmp: Number.parseFloat(cmp.toFixed(2)),
      error: null,
    })
  } catch (error) {
    return NextResponse.json({
      cmp: null,
      error: "Failed to fetch price from Yahoo Finance",
    })
  }
}
