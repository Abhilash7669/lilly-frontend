export default function ChartSkeleton() {
  // Heights as % for a natural variation
  const barHeights = [65, 85, 55, 90, 75, 88, 60, 80, 50, 99, 55, 67, 90, 100];

  return (
    <div className="w-full h-80 p-6 border border-border rounded-xl flex flex-col justify-between">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="h-6 w-40 rounded shimmer" />
        <div className="h-6 w-20 rounded shimmer" />
      </div>

      {/* Chart area */}
      <div className="flex-1 flex items-end justify-between relative">
        {/* Y-axis guide lines */}
        {[80, 60, 40, 20].map((_, idx) => (
          <div
            key={idx}
            className="absolute left-0 right-0 border-t border-muted-foreground/20"
            style={{ bottom: `${idx * 20}%` }}
          />
        ))}

        {/* Bars */}
        {barHeights.map((height, i) => (
          <div
            key={i}
            className="flex-1 max-w-[48px] rounded shimmer mx-2"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-4">
        {Array.from({ length: barHeights.length }).map((_, i) => (
          <div key={i} className="h-3 w-10 rounded shimmer" />
        ))}
      </div>
    </div>
  );
}
