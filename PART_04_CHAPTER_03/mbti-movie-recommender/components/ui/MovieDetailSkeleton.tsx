import Skeleton from './Skeleton';

export default function MovieDetailSkeleton({ onClose }: { onClose?: () => void }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 헤더 스켈레톤 */}
        <div className="flex justify-between items-center p-6 border-b">
          <Skeleton height="2rem" className="w-1/2" />
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* 백드롭 이미지 스켈레톤 */}
        <div className="relative h-64 md:h-80">
          <Skeleton height="100%" className="w-full" />
        </div>

        {/* 컨텐츠 스켈레톤 */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 포스터 스켈레톤 */}
            <div className="w-full md:w-1/3">
              <Skeleton height="400px" className="w-full rounded-lg" />
            </div>

            {/* 정보 스켈레톤 */}
            <div className="flex-1">
              {/* 기본 정보 스켈레톤 */}
              <div className="mb-6 space-y-3">
                <Skeleton height="1.5rem" className="w-3/4" />
                <Skeleton height="1.5rem" className="w-1/2" />
                <div className="space-y-2">
                  <Skeleton height="1rem" className="w-full" />
                  <Skeleton height="1rem" className="w-5/6" />
                  <Skeleton height="1rem" className="w-4/5" />
                </div>
              </div>

              {/* 평점 및 기본 정보 스켈레톤 */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-1">
                    <Skeleton height="1rem" className="w-2/3" />
                  </div>
                ))}
              </div>

              {/* 장르 스켈레톤 */}
              <div className="mb-6">
                <Skeleton height="1.25rem" className="w-16 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      height="1.75rem"
                      width={`${60 + index * 10}px`}
                      rounded
                    />
                  ))}
                </div>
              </div>

              {/* 제작 국가 스켈레톤 */}
              <div className="mb-6">
                <Skeleton height="1.25rem" className="w-20 mb-2" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      height="1.75rem"
                      width={`${70 + index * 15}px`}
                      rounded
                    />
                  ))}
                </div>
              </div>

              {/* 예산 및 수익 스켈레톤 */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton height="1rem" className="w-3/4" />
                <Skeleton height="1rem" className="w-2/3" />
              </div>

              {/* 외부 링크 스켈레톤 */}
              <div className="flex gap-4">
                <Skeleton height="2.5rem" width="120px" />
                <Skeleton height="2.5rem" width="80px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}