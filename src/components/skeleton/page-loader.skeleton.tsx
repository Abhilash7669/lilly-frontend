
export default function PageLoaderSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Page Title */}
      <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48"></div>
      
      {/* Sub-header */}
      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-72"></div>

      {/* Content blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="h-40 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
