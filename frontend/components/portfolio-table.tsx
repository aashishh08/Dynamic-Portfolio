import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { PortfolioStock } from "@/types/portfolio";

interface PortfolioTableProps {
  portfolioData: PortfolioStock[];
}

export function PortfolioTable({ portfolioData }: PortfolioTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Particulars</TableHead>
                <TableHead>Purchase Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Portfolio %</TableHead>
                <TableHead>Exchange</TableHead>
                <TableHead>CMP</TableHead>
                <TableHead>Present Value</TableHead>
                <TableHead>Gain/Loss</TableHead>
                <TableHead>P/E Ratio</TableHead>
                <TableHead>Latest Earnings</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolioData.map((stock, index) => {
                const gainLossPercentage =
                  (stock.gainLoss / stock.investment) * 100;
                const exchange = stock.fullSymbol.includes(".NS")
                  ? "NSE"
                  : "BSE";

                if (stock.unsupported) {
                  return (
                    <TableRow
                      key={`${stock.symbol}-${index}`}
                      className="bg-gray-100 text-gray-400"
                    >
                      <TableCell colSpan={11} className="italic">
                        <AlertTriangle className="h-4 w-4 inline mr-2 text-yellow-500" />
                        {stock.stockName} ({stock.symbol}):{" "}
                        {stock.unsupportedReason ||
                          "Data not available for this symbol."}
                      </TableCell>
                    </TableRow>
                  );
                }

                return (
                  <TableRow key={`${stock.symbol}-${index}`}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{stock.stockName}</div>
                        <div className="text-sm text-gray-500">
                          {stock.symbol}
                        </div>
                        <div className="text-xs text-gray-400">
                          {stock.sector}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>₹{stock.purchasePrice.toFixed(2)}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>
                      ₹{stock.investment.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>{stock.portfolioPercent}%</TableCell>
                    <TableCell>
                      <Badge variant="outline">{exchange}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        ₹{stock.cmp.toFixed(2)}
                        {stock.cmpError && (
                          <div className="text-xs text-red-500 mt-1">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            Error
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      ₹{stock.presentValue.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`font-semibold ${
                          stock.gainLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ₹{stock.gainLoss.toLocaleString("en-IN")}
                        <div className="text-xs">
                          ({gainLossPercentage >= 0 ? "+" : ""}
                          {gainLossPercentage.toFixed(2)}%)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {stock.peRatio}
                        {stock.googleError && (
                          <div className="text-xs text-red-500 mt-1">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            Error
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className={`font-medium ${
                          stock.latestEarnings.startsWith("-")
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {stock.latestEarnings}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {portfolioData.some((stock) => stock.cmpError || stock.googleError) && (
          <Alert className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Some data could not be fetched from external APIs. Please check
              your internet connection or try refreshing.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
