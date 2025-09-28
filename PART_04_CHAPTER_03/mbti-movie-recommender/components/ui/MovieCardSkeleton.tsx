import Skeleton from './Skeleton';

interface MovieCardSkeletonProps {
  className?: string;
}

export default function MovieCardSkeleton({ className = '' }: MovieCardSkeletonProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${className}`}>
      {/* 포스터 이미지 스켈레톤 */}
      <div className="relative">
        <Skeleton height="256px" className="w-full" />
        {/* 평점 배지 스켈레톤 */}
        <div className="absolute top-2 right-2">
          <Skeleton height="24px" width="60px" rounded />
        </div>
      </div>

      {/* 카드 내용 스켈레톤 */}
      <div className="p-4 space-y-3">
        {/* 제목 스켈레톤 */}
        <Skeleton height="1.5rem" className="w-3/4" />

        {/* 원제목 스켈레톤 (선택적) */}
        <Skeleton height="1rem" className="w-1/2" />

        {/* 설명 스켈레톤 */}
        <div className="space-y-2">
          <Skeleton height="1rem" className="w-full" />
          <Skeleton height="1rem" className="w-5/6" />
          <Skeleton height="1rem" className="w-2/3" />
        </div>

        {/* 장르 태그들 스켈레톤 */}
        <div className="flex flex-wrap gap-1">
          <Skeleton height="1.5rem" width="50px" rounded />
          <Skeleton height="1.5rem" width="65px" rounded />
          <Skeleton height="1.5rem" width="45px" rounded />
        </div>

        {/* 연도와 런타임 스켈레톤 */}
        <div className="flex justify-between items-center">
          <Skeleton height="1rem" width="50px" />
          <Skeleton height="1rem" width="80px" />
        </div>

        {/* MBTI 타입 스켈레톤 */}
        <div className="pt-3 border-t border-gray-200">
          <div className="flex flex-wrap gap-1">
            <Skeleton height="1.5rem" width="40px" rounded />
            <Skeleton height="1.5rem" width="40px" rounded />
            <Skeleton height="1.5rem" width="40px" rounded />
            <Skeleton height="1.5rem" width="25px" rounded />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MovieCardSkeletonGrid({ count = 8, className = '' }: { count?: number; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <MovieCardSkeleton key={index} />
      ))}
    </div>
  );
}