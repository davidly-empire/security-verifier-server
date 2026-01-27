import React from 'react';

interface AverageRoundTimeCardProps {
  averageTime: number;
  targetTime: number;
}

export default function AverageRoundTimeCard({ averageTime, targetTime }: AverageRoundTimeCardProps) {
  // Determine if within target
  const isWithinTarget = averageTime <= targetTime;
  
  // Calculate percentage for visual width
  const percentage = Math.round((averageTime / targetTime) * 100);
  
  // Professional Color Palette Logic
  // Good: Vibrant Blue
  // Bad: Desaturated Slate (to keep within the Blue/White theme)
  const primaryColorClass = isWithinTarget ? "text-blue-600" : "text-slate-600";
  const barColorClass = isWithinTarget 
    ? "bg-gradient-to-r from-blue-500 to-blue-600" 
    : "bg-slate-300";
  const statusText = isWithinTarget ? "On Schedule" : "Requires Attention";
  const subStatusText = isWithinTarget ? "Within target efficiency" : "Exceeds target limit";

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm p-8 
                    transition-all duration-300 hover:shadow-[0_10px_40px_-10px_rgba(37,99,235,0.15)] hover:-translate-y-1 hover:border-blue-200">
      
      {/* Header Section with Icon */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Performance Metric
          </h3>
          <h2 className="text-lg font-bold text-slate-800 mt-1">Average Round Time</h2>
        </div>
        
        {/* Animated Icon Container */}
        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-blue-600 
                        transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
      </div>

      {/* Main Data Display */}
      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative">
          <span className={`text-5xl font-extrabold tracking-tight ${primaryColorClass} transition-colors duration-300`}>
            {averageTime}
          </span>
          <span className="text-lg text-slate-400 font-medium ml-1">min</span>
        </div>
        
        {/* Target Comparison Pill */}
        <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          <span className="text-xs font-semibold text-slate-500">
            Target: {targetTime} min
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-8">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Efficiency</span>
          <span className={`text-sm font-bold ${primaryColorClass} transition-colors duration-300`}>
            {isWithinTarget ? '100%' : `${percentage}%`}
          </span>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className={`h-2.5 rounded-full transition-all duration-700 ease-out hover:brightness-110 ${barColorClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>

        {/* Status Text */}
        <div className={`mt-4 flex items-center justify-center gap-2 transition-all duration-300 
                        ${isWithinTarget ? 'text-blue-600/80' : 'text-slate-500'}`}>
          {isWithinTarget ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          )}
          <span className="text-sm font-semibold">
            {statusText}
          </span>
        </div>
      </div>

    </div>
  );
}