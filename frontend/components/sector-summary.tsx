import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { SectorSummary as PortfolioSectorSummary } from "@/types/portfolio";

interface SectorSummaryProps {
  sectorSummaries: PortfolioSectorSummary[];
}

export function SectorSummary({ sectorSummaries }: SectorSummaryProps) {
  // Only include supported stocks in sector calculations
  const supportedSectors = sectorSummaries.map((sector) => {
    const supportedStocks = sector.stocks.filter((stock) => !stock.unsupported);
    const totalInvestment = supportedStocks.reduce(
      (sum, stock) => sum + stock.investment,
      0
    );
    const totalPresentValue = supportedStocks.reduce(
      (sum, stock) => sum + stock.presentValue,
      0
    );
    const totalGainLoss = supportedStocks.reduce(
      (sum, stock) => sum + stock.gainLoss,
      0
    );
    return {
      ...sector,
      stocks: supportedStocks,
      totalInvestment,
      totalPresentValue,
      totalGainLoss,
    };
  });
  const totalPortfolioValue = supportedSectors.reduce(
    (sum, sector) => sum + sector.totalInvestment,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sector Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {supportedSectors.map((sector) => {
          const sectorPercentage =
            (sector.totalInvestment / totalPortfolioValue) * 100;
          const gainLossPercentage =
            (sector.totalGainLoss / sector.totalInvestment) * 100;

          return (
            <div key={sector.sector} className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-sm">{sector.sector}</h4>
                <span className="text-xs text-gray-500">
                  {sector.stocks.length} stocks
                </span>
              </div>

              <Progress value={sectorPercentage} className="h-2" />

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Investment</div>
                  <div className="font-semibold">
                    ₹{sector.totalInvestment.toLocaleString("en-IN")}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500">Current Value</div>
                  <div className="font-semibold">
                    ₹{sector.totalPresentValue.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="text-xs">
                <div className="text-gray-500">Gain/Loss</div>
                <div
                  className={`font-semibold ${
                    sector.totalGainLoss >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  ₹{sector.totalGainLoss.toLocaleString("en-IN")} (
                  {gainLossPercentage >= 0 ? "+" : ""}
                  {gainLossPercentage.toFixed(2)}%)
                </div>
              </div>

              <div className="text-xs text-gray-500">
                <div className="font-medium">Stocks:</div>
                <div>
                  {sector.stocks.map((stock) => stock.stockName).join(", ")}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
