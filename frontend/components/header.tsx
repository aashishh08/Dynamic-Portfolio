"use client";

import { RefreshCw } from "lucide-react";

interface HeaderProps {
  lastUpdated: Date;
  onRefresh: () => void;
}

export function Header({ lastUpdated, onRefresh }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Portfolio Dashboard
            </h1>
            <p className="text-sm text-gray-600">Octa Byte AI Pvt Ltd</p>
            <p className="text-xs text-gray-500">CIN: U62099KA2025PTC201620</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Last updated</div>
              <div className="text-sm font-medium">
                {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={onRefresh}
              className="flex items-center space-x-2 px-3 py-1 border rounded bg-transparent hover:bg-gray-100 text-gray-700 text-sm"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
