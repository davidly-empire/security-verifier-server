import React from 'react';

interface AverageRoundTimeCardProps {
  averageTime: number;
  targetTime: number;
}

export default function AverageRoundTimeCard({ averageTime, targetTime }: AverageRoundTimeCardProps) {
  const isWithinTarget = averageTime <= targetTime;
  const percentage = Math.round((averageTime / targetTime) * 100);
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Average Round Time</h3>
      <div className="flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-gray-900">{averageTime} min</div>
          <div className="text-sm text-gray-500 mt-1">Target: {targetTime} min</div>
        </div>
      </div>
      <div className="mt-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${isWithinTarget ? 'bg-green-600' : 'bg-red-600'}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className={`mt-2 text-sm ${isWithinTarget ? 'text-green-600' : 'text-red-600'}`}>
          {isWithinTarget ? 'Within target time' : 'Exceeds target time'}
        </div>
      </div>
    </div>
  );
}