export default function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full border-collapse">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-20 rounded shimmer" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-28 rounded shimmer" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-16 rounded shimmer" />
            </th>
            <th className="px-4 py-3 text-left">
              <div className="h-4 w-12 rounded shimmer" />
            </th>
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr
              key={i}
              className="border-t border-gray-200 dark:border-gray-700"
            >
              <td className="px-4 py-3">
                <div className="h-4 w-32 rounded shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-40 rounded shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-28 rounded shimmer" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 rounded shimmer" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
