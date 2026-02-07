// components/QuizSkeleton.tsx
export default function QuizSkeleton() {
  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-xl animate-pulse">
      
      {/* Progress Bar Skeleton */}
      <div className="mb-6 space-y-2">
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
      </div>

      {/* Question Text Skeleton */}
      <div className="mb-8 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
      </div>

      {/* Options Skeleton (4 blocks) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl border-2 border-gray-100"></div>
        ))}
      </div>

      {/* Button Skeleton */}
      <div className="h-14 bg-gray-200 rounded-xl w-full"></div>
    </div>
  );
}