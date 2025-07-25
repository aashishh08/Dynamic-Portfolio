"use client"

import { useState, useEffect, useCallback } from "react"
import type { PortfolioResponse } from "@/types/portfolio"

export function usePortfolio() {
  const [data, setData] = useState<PortfolioResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchPortfolio = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch("http://localhost:4000/api/portfolio")

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data")
      }

      const portfolioData: PortfolioResponse = await response.json()
      setData(portfolioData)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolio()

    // Set up auto-refresh every 15 seconds
    const interval = setInterval(fetchPortfolio, 15000)

    return () => clearInterval(interval)
  }, [fetchPortfolio])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchPortfolio,
  }
}
