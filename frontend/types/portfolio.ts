export interface PortfolioStock {
  stockName: string
  symbol: string
  fullSymbol: string
  purchasePrice: number
  quantity: number
  investment: number
  cmp: number
  cmpError: string | null
  presentValue: number
  gainLoss: number
  peRatio: string
  latestEarnings: string
  googleError: string | null
  portfolioPercent: string
  sector: string
}

export interface SectorSummary {
  sector: string
  totalInvestment: number
  totalPresentValue: number
  totalGainLoss: number
  stocks: string[]
}

export interface PortfolioResponse {
  data: PortfolioStock[]
  sectorSummaries: SectorSummary[]
}

export interface YahooFinanceResponse {
  cmp: number | null
  error: string | null
}

export interface GoogleFinanceResponse {
  peRatio: string | null
  latestEarnings: string | null
  error: string | null
}
