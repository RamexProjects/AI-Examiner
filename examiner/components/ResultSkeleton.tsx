// components/ResultSkeleton.tsx
export default function ResultSkeleton() {
  return (
    <div className="w-full max-w-4xl bg-white p-6 md:p-10 rounded-2xl shadow-xl my-10 animate-pulse">
      
      {/* Header Skeleton (Score) */}
      <div className="text-center mb-10 border-b pb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4"></div>
        <div className="h-20 bg-gray-200 rounded-full w-20 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>

      {/* Review List Skeleton (3 items) */}
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-6 rounded-xl border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}