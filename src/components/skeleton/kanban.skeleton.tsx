export default function KanbanSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map((col) => (
        <div key={col} className="bg-card-foreground/20 rounded-xl p-4 shadow-sm">
          <div className="h-4 bg-card rounded w-3/4 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((card) => (
              <div key={card} className="bg-card rounded-lg h-20 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
