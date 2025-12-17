import React from 'react';

interface DashboardErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export default function DashboardError({ 
  title = "Something went wrong", 
  description = "We encountered an error while loading the dashboard. Please try again.",
  onRetry
}: DashboardErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <svg className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      )}
    </div>
  );
}