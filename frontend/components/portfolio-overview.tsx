import { TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import type { PortfolioStock } from "@/types/portfolio";

interface PortfolioOverviewProps {
  portfolioData: PortfolioStock[];
}

export function PortfolioOverview({ portfolioData }: PortfolioOverviewProps) {
  const supportedStocks = portfolioData.filter((stock) => !stock.unsupported);
  const totalInvestment = supportedStocks.reduce(
    (sum, stock) => sum + stock.investment,
    0
  );
  const totalPresentValue = supportedStocks.reduce(
    (sum, stock) => sum + stock.presentValue,
    0
  );
  const totalGainLoss = totalPresentValue - totalInvestment;
  const totalGainLossPercentage = (totalGainLoss / totalInvestment) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="rounded-lg border bg-white p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Total Investment</span>
          <DollarSign className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">
          ₹{totalInvestment.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Current Value</span>
          <PieChart className="h-4 w-4 text-gray-400" />
        </div>
        <div className="text-2xl font-bold">
          ₹{totalPresentValue.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Total Gain/Loss</span>
          {totalGainLoss >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </div>
        <div
          className={`text-2xl font-bold ${
            totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          ₹{totalGainLoss.toLocaleString("en-IN")}
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Return %</span>
          {totalGainLossPercentage >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
          )}
        </div>
        <div
          className={`text-2xl font-bold ${
            totalGainLossPercentage >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {totalGainLossPercentage.toFixed(2)}%
        </div>
      </div>
    </div>
  );
}
