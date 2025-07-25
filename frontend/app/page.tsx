"use client"

import { PortfolioTable } from "@/components/portfolio-table"
import { PortfolioOverview } from "@/components/portfolio-overview"
import { SectorSummary } from "@/components/sector-summary"
import { Header } from "@/components/header"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorMessage } from "@/components/error-message"
import { usePortfolio } from "@/hooks/usePortfolio"

export default function PortfolioDashboard() {
  const { data, loading, error, lastUpdated, refetch } = usePortfolio()

  if (loading && !data) {
    return <LoadingSpinner />
  }

  if (error && !data) {
    return <ErrorMessage message={error} onRetry={refetch} />
  }

  if (!data) {
    return <ErrorMessage message="No portfolio data available" onRetry={refetch} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lastUpdated={lastUpdated} onRefresh={refetch} />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <PortfolioOverview portfolioData={data.data} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <PortfolioTable portfolioData={data.data} />
          </div>
          <div>
            <SectorSummary sectorSummaries={data.sectorSummaries} />
          </div>
        </div>
      </main>
    </div>
  )
}
