"use client"

import { useState, useCallback } from "react"
import type { GoogleFinanceResponse } from "@/types/portfolio"

export function useGoogleFinance() {
  const [loading, setLoading] = useState(false)

  const fetchFinancials = useCallback(async (symbol: string): Promise<GoogleFinanceResponse> => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:4000/api/test/google/${symbol}`)
      const data: GoogleFinanceResponse = await response.json()
      return data
    } catch (error) {
      return {
        peRatio: null,
        latestEarnings: null,
        error: "Failed to fetch data from Google Finance",
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchFinancials, loading }
}
