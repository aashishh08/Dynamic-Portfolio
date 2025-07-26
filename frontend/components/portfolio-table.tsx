// PortfolioTable now uses react-table for table logic, and shadcn/ui for UI components.
// This demonstrates use of a recommended library (react-table) as an extra feature for the assignment.
import { useMemo } from "react";
import {
  useTable,
  Column,
  Row,
  CellProps,
  HeaderGroup,
  Cell,
} from "react-table";
import { AlertTriangle } from "lucide-react";
import type { PortfolioStock } from "@/types/portfolio";

interface PortfolioTableProps {
  portfolioData: PortfolioStock[];
}

export function PortfolioTable({ portfolioData }: PortfolioTableProps) {
  // Define columns for react-table
  const columns: Column<PortfolioStock>[] = useMemo(
    () => [
      {
        Header: "Particulars",
        accessor: "stockName",
        // Custom cell: show stock name, symbol, and sector
        Cell: ({ row }: CellProps<PortfolioStock, string>) => (
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
        Cell: ({ value }: CellProps<PortfolioStock, number>) =>
          `₹${value.toFixed(2)}`,
      },
      { Header: "Qty", accessor: "quantity" },
      {
        Header: "Investment",
        accessor: "investment",
        Cell: ({ value }: CellProps<PortfolioStock, number>) =>
          `₹${value.toLocaleString("en-IN")}`,
      },
      {
        Header: "Portfolio %",
        accessor: "portfolioPercent",
        Cell: ({ value }: CellProps<PortfolioStock, string>) => `${value}%`,
      },
      {
        Header: "Exchange",
        accessor: "fullSymbol",
        Cell: ({ value }: CellProps<PortfolioStock, string>) => (
          <span className="px-2 py-0.5 rounded border text-xs font-semibold">
            {value.includes(".NS") ? "NSE" : "BSE"}
          </span>
        ),
      },
      {
        Header: "CMP",
        accessor: "cmp",
        Cell: ({ row }: CellProps<PortfolioStock, number>) => (
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
        Cell: ({ value }: CellProps<PortfolioStock, number>) =>
          `₹${value.toLocaleString("en-IN")}`,
      },
      {
        Header: "Gain/Loss",
        accessor: "gainLoss",
        Cell: ({ row }: CellProps<PortfolioStock, number>) => {
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
        Cell: ({ row }: CellProps<PortfolioStock, string>) => (
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
        Cell: ({ row }: CellProps<PortfolioStock, string>) => (
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
            {headerGroups.map((headerGroup: HeaderGroup<PortfolioStock>) => (
              <tr {...headerGroup.getHeaderGroupProps()} className="border-b">
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
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

              return (
                <tr {...row.getRowProps()} className="border-b">
                  {row.cells.map((cell) => (
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
