import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"
import type { PortfolioStock } from "@/types/portfolio"

interface PortfolioOverviewProps {
  portfolioData: PortfolioStock[]
}

export function PortfolioOverview({ portfolioData }: PortfolioOverviewProps) {
  const totalInvestment = portfolioData.reduce((sum, stock) => sum + stock.investment, 0)
  const totalPresentValue = portfolioData.reduce((sum, stock) => sum + stock.presentValue, 0)
  const totalGainLoss = totalPresentValue - totalInvestment
  const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalInvestment.toLocaleString("en-IN")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalPresentValue.toLocaleString("en-IN")}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          {totalGainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
            ₹{totalGainLoss.toLocaleString("en-IN")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Return %</CardTitle>
          {totalGainLossPercentage >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalGainLossPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
            {totalGainLossPercentage.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
