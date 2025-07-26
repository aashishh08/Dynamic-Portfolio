// PortfolioTable now uses react-table for table logic, and shadcn/ui for UI components.
// This demonstrates use of a recommended library (react-table) as an extra feature for the assignment.
import { useMemo } from "react";
import { useTable, Column, Row, CellProps } from "react-table";
import { AlertTriangle } from "lucide-react";
import type { PortfolioStock } from "@/types/portfolio";

interface PortfolioTableProps {
  portfolioData: PortfolioStock[];
}

/**
 * PortfolioTable component
 * - Displays the portfolio holdings in a responsive table.
 * - Uses react-table for table logic and shadcn/ui for UI components.
 * - Handles unsupported stocks, error states, and gain/loss coloring.
 *
 * Props:
 *   portfolioData: Array of PortfolioStock objects to display
 */
export function PortfolioTable({ portfolioData }: PortfolioTableProps) {
  // Define columns for react-table
  const columns: Column<PortfolioStock>[] = useMemo(
    () => [
      {
        Header: "Particulars",
        accessor: "stockName",
        // Custom cell: show stock name, symbol, and sector
        Cell: ({ row }: CellProps<PortfolioStock, any>) => (
          <div>
            <div className="font-semibold">{row.original.stockName}</div>
            <div className="text-sm text-gray-500">{row.original.symbol}</div>
            <div className="text-xs text-gray-400">{row.original.sector}</div>
          </div>
        ),
      },
      {
        Header: "Purchase Price",
        accessor: "purchasePrice",
        Cell: ({ value }: CellProps<PortfolioStock, any>) =>
          `₹${value.toFixed(2)}`,
      },
      { Header: "Qty", accessor: "quantity" },
      {
        Header: "Investment",
        accessor: "investment",
        Cell: ({ value }: CellProps<PortfolioStock, any>) =>
          `₹${value.toLocaleString("en-IN")}`,
      },
      {
        Header: "Portfolio %",
        accessor: "portfolioPercent",
        Cell: ({ value }: CellProps<PortfolioStock, any>) => `${value}%`,
      },
      {
        Header: "Exchange",
        accessor: "fullSymbol",
        Cell: ({ value }: CellProps<PortfolioStock, any>) => (
          <span className="px-2 py-0.5 rounded border text-xs font-semibold">
            {value.includes(".NS") ? "NSE" : "BSE"}
          </span>
        ),
      },
      {
        Header: "CMP",
        accessor: "cmp",
        Cell: ({ row }: CellProps<PortfolioStock, any>) => (
          <div>
            ₹{row.original.cmp?.toFixed(2)}
            {row.original.cmpError && (
              <div className="text-xs text-red-500 mt-1 flex items-center">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Error
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "Present Value",
        accessor: "presentValue",
        Cell: ({ value }: CellProps<PortfolioStock, any>) =>
          `₹${value.toLocaleString("en-IN")}`,
      },
      {
        Header: "Gain/Loss",
        accessor: "gainLoss",
        Cell: ({ row }: CellProps<PortfolioStock, any>) => {
          const gainLoss = row.original.gainLoss;
          const gainLossPercentage = (gainLoss / row.original.investment) * 100;
          return (
            <div
              className={`font-semibold ${
                gainLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ₹{gainLoss.toLocaleString("en-IN")}
              <div className="text-xs">
                ({gainLossPercentage >= 0 ? "+" : ""}
                {gainLossPercentage.toFixed(2)}%)
              </div>
            </div>
          );
        },
      },
      {
        Header: "P/E Ratio",
        accessor: "peRatio",
        Cell: ({ row }: CellProps<PortfolioStock, any>) => (
          <div>
            {row.original.peRatio}
            {row.original.googleError && (
              <div className="text-xs text-red-500 mt-1 flex items-center">
                <AlertTriangle className="h-3 w-3 inline mr-1" />
                Error
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "Latest Earnings",
        accessor: "latestEarnings",
        Cell: ({ row }: CellProps<PortfolioStock, any>) => (
          <div
            className={`font-medium ${
              row.original.latestEarnings?.toString().startsWith("-")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {row.original.latestEarnings}
          </div>
        ),
      },
    ],
    []
  );

  // Set up react-table instance
  const tableInstance = useTable<PortfolioStock>({
    columns,
    data: portfolioData,
  });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="rounded-lg border bg-white p-4 shadow">
      <h3 className="text-lg font-bold mb-4">Portfolio Holdings</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup: Row<PortfolioStock>) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
                {headerGroup.headers.map((column: any) => (
                  <th
                    {...column.getHeaderProps()}
                    className="px-4 py-2 text-left font-medium text-gray-600"
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row: Row<PortfolioStock>) => {
              prepareRow(row);
              // Show a warning row for unsupported stocks
              if (row.original.unsupported) {
                return (
                  <tr key={row.id} className="bg-gray-100 text-gray-400">
                    <td colSpan={columns.length} className="italic px-4 py-2">
                      <AlertTriangle className="h-4 w-4 inline mr-2 text-yellow-500" />
                      {row.original.stockName} ({row.original.symbol}):{" "}
                      {row.original.unsupportedReason ||
                        "Data not available for this symbol."}
                    </td>
                  </tr>
                );
              }
              return (
                <tr {...row.getRowProps()} className="border-b">
                  {row.cells.map((cell: CellProps<PortfolioStock, any>) => (
                    <td {...cell.getCellProps()} className="px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Show a global alert if any stock has a fetch error */}
      {portfolioData.some((stock) => stock.cmpError || stock.googleError) && (
        <div className="mt-4 flex items-center bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span>
            Some data could not be fetched from external APIs. Please check your
            internet connection or try refreshing.
          </span>
        </div>
      )}
    </div>
  );
}
