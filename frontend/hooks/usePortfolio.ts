"use client";

import { useState, useEffect, useCallback } from "react";
import type { PortfolioResponse } from "@/types/portfolio";

/**
 * Custom React hook to fetch and manage portfolio data from the backend API.
 * - Handles loading, error, and last updated state.
 * - Auto-refreshes data every 15 seconds for live updates.
 * - Exposes a refetch function for manual refresh.
 *
 * Usage:
 *   const { data, loading, error, lastUpdated, refetch } = usePortfolio();
 */
export function usePortfolio() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  /**
   * Fetches the portfolio data from the backend API.
   * Handles errors and updates state accordingly.
   */
  const fetchPortfolio = useCallback(async () => {
    try {
      setError(null);
      const response = await fetch("http://localhost:4000/api/portfolio");

      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }

      const portfolioData: PortfolioResponse = await response.json();
      setData(portfolioData);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch portfolio data on mount and set up auto-refresh every 15 seconds
  useEffect(() => {
    fetchPortfolio();

    // Set up auto-refresh every 15 seconds
    const interval = setInterval(fetchPortfolio, 15000);

    return () => clearInterval(interval);
  }, [fetchPortfolio]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchPortfolio,
  };
}
