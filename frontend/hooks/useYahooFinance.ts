"use client"

import { useState, useCallback } from "react"
import type { YahooFinanceResponse } from "@/types/portfolio"

export function useYahooFinance() {
  const [loading, setLoading] = useState(false)

  const fetchPrice = useCallback(async (symbol: string): Promise<YahooFinanceResponse> => {
    setLoading(true)
    try {
      const response = await fetch(`http://localhost:4000/api/test/yahoo/${symbol}`)
      const data: YahooFinanceResponse = await response.json()
      return data
    } catch (error) {
      return {
        cmp: null,
        error: "Failed to fetch price from Yahoo Finance",
      }
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchPrice, loading }
}
