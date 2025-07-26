"use client";

import { useState } from "react";
import { useYahooFinance } from "@/hooks/useYahooFinance";
import { useGoogleFinance } from "@/hooks/useGoogleFinance";
import { Loader2 } from "lucide-react";

export function ApiTestPanel() {
  const [yahooSymbol, setYahooSymbol] = useState("HDFCBANK");
  const [googleSymbol, setGoogleSymbol] = useState("HDFCBANK");
  const [yahooResult, setYahooResult] = useState<any>(null);
  const [googleResult, setGoogleResult] = useState<any>(null);

  const { fetchPrice, loading: yahooLoading } = useYahooFinance();
  const { fetchFinancials, loading: googleLoading } = useGoogleFinance();

  const testYahooApi = async () => {
    const result = await fetchPrice(yahooSymbol);
    setYahooResult(result);
  };

  const testGoogleApi = async () => {
    const result = await fetchFinancials(googleSymbol);
    setGoogleResult(result);
  };

  return (
    <div className="w-full max-w-2xl mx-auto border rounded-lg p-4 bg-white shadow">
      <h2 className="text-xl font-bold mb-4">API Test Panel</h2>
      <div className="flex space-x-4 mb-4">
        <button
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold focus:outline-none"
          onClick={() => setYahooSymbol("HDFCBANK")}
        >
          Yahoo Finance
        </button>
        <button
          className="px-4 py-2 rounded bg-green-500 text-white font-semibold focus:outline-none"
          onClick={() => setGoogleSymbol("HDFCBANK")}
        >
          Google Finance
        </button>
      </div>
      <div className="mb-4">
        <label htmlFor="yahoo-symbol" className="block font-medium mb-1">
          Yahoo Stock Symbol
        </label>
        <input
          id="yahoo-symbol"
          value={yahooSymbol}
          onChange={(e) => setYahooSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g., HDFCBANK)"
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={testYahooApi}
          disabled={yahooLoading}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          {yahooLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
          )}
          Test Yahoo Finance API
        </button>
        {yahooResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Result:</h4>
            <pre className="text-sm">
              {JSON.stringify(yahooResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="google-symbol" className="block font-medium mb-1">
          Google Stock Symbol
        </label>
        <input
          id="google-symbol"
          value={googleSymbol}
          onChange={(e) => setGoogleSymbol(e.target.value)}
          placeholder="Enter stock symbol (e.g., HDFCBANK)"
          className="border rounded px-2 py-1 w-full"
        />
        <button
          onClick={testGoogleApi}
          disabled={googleLoading}
          className="w-full mt-2 px-4 py-2 bg-green-600 text-white rounded"
        >
          {googleLoading && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
          )}
          Test Google Finance API
        </button>
        {googleResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h4 className="font-semibold mb-2">Result:</h4>
            <pre className="text-sm">
              {JSON.stringify(googleResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
