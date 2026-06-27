export default function AnalyzeSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="card p-5 space-y-4">
        <div className="skeleton h-4 w-28" />
        <div className="flex gap-2">
          <div className="skeleton h-14 flex-1 rounded-xl" />
          <div className="skeleton h-14 flex-1 rounded-xl" />
          <div className="skeleton h-14 flex-1 rounded-xl" />
          <div className="skeleton h-14 flex-1 rounded-xl" />
        </div>
      </div>
      <div className="card p-5 space-y-3">
        <div className="skeleton h-4 w-36" />
        {[1, 2].map(i => (
          <div key={i} className="border border-gray-100 rounded-xl p-3 space-y-2">
            <div className="flex justify-between">
              <div className="skeleton h-4 w-32" />
              <div className="skeleton h-4 w-12" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-6 w-16 rounded-lg" />
              <div className="skeleton h-6 w-16 rounded-lg" />
              <div className="skeleton h-6 w-16 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
      <div className="skeleton h-20 rounded-2xl" />
      <div className="card p-5 space-y-2">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-3/4" />
      </div>
    </div>
  )
}
