"use client";

import { AlertTriangle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full border rounded-lg bg-white p-6 shadow">
        <div className="flex items-center text-red-600 mb-2">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span className="font-bold">Error</span>
        </div>
        <div className="mb-4 text-gray-700">{message}</div>
        <button
          onClick={onRetry}
          className="w-full px-4 py-2 border rounded bg-transparent hover:bg-gray-100"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
