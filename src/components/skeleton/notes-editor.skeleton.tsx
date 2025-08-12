export default function NotesEditorSkeleton() {
  return (
    <div className="w-full h-screen p-8 flex flex-col space-y-8">
      {/* Title */}
      <div className="h-10 w-1/2 rounded shimmer" />

      {/* Toolbar */}
      <div className="flex space-x-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 w-10 rounded shimmer" />
        ))}
      </div>

      {/* Content area */}
      <div className="flex-1 space-y-5">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={`h-5 rounded shimmer ${
              i % 3 === 0 ? "w-5/6" : i % 4 === 0 ? "w-4/6" : "w-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
