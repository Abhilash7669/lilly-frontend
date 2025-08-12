export default function DashboardSkeleton() {
  return (
    <div className="w-full p-6 space-y-8">
      {/* Page title */}
      <div className="h-8 w-48 rounded shimmer"></div>

      {/* Top stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 space-y-3"
          >
            <div className="h-4 w-24 rounded shimmer"></div>
            <div className="h-6 w-16 rounded shimmer"></div>
          </div>
        ))}
      </div>

      {/* Chart section */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-4 space-y-4">
        {/* Chart title */}
        <div className="h-5 w-32 rounded shimmer"></div>

        {/* Chart area */}
        <div className="h-48 w-full rounded shimmer"></div>
      </div>

      {/* Table / List placeholder */}
    </div>
  );
}
