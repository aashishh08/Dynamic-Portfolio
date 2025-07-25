import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { symbol: string } }) {
  try {
    const { symbol } = params

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 400))

    // Mock Google Finance response
    const mockData: Record<string, { peRatio: string; latestEarnings: string }> = {
      HDFCBANK: { peRatio: "21.89", latestEarnings: "-1.32%" },
      RELIANCE: { peRatio: "28.45", latestEarnings: "2.15%" },
      TCS: { peRatio: "25.20", latestEarnings: "1.85%" },
      ICICIBANK: { peRatio: "18.75", latestEarnings: "0.95%" },
      INFY: { peRatio: "22.10", latestEarnings: "1.25%" },
    }

    const data = mockData[symbol] || { peRatio: "20.00", latestEarnings: "0.00%" }

    return NextResponse.json({
      peRatio: data.peRatio,
      latestEarnings: data.latestEarnings,
      error: null,
    })
  } catch (error) {
    return NextResponse.json({
      peRatio: null,
      latestEarnings: null,
      error: "Failed to fetch data from Google Finance",
    })
  }
}
