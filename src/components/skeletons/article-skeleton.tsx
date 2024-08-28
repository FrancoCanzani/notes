export default function ArticleSkeleton() {
  return (
    <div className="max-w-3xl w-full mx-auto px-4 py-8">
      <div className="animate-pulse space-y-4">
        {/* Title */}
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>

        {/* Authors */}
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>

        {/* Link */}
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>

        {/* Features heading */}
        <div className="h-12 bg-gray-200 rounded w-2/3"></div>

        {/* Features list */}
        <div className="space-y-3">
          {[...Array(14)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
        </div>

        {/* Additional info */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
