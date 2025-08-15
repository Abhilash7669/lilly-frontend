import React from "react";

const PieChartSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-6">
      {/* Pie */}
      <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200 shimmer">
        {/* Center hole */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 bg-white rounded-full border border-gray-100"></div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 w-48">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-sm bg-gray-200 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-32 shimmer"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-sm bg-gray-200 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-28 shimmer"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-sm bg-gray-200 shimmer"></div>
          <div className="h-4 bg-gray-200 rounded w-24 shimmer"></div>
        </div>

        {/* Summary lines */}
        <div className="mt-2 h-4 bg-gray-200 rounded w-full shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
      </div>
    </div>
  );
};

export default PieChartSkeleton;
