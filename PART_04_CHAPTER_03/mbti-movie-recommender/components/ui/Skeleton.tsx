interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
}

export default function Skeleton({
  className = '',
  width,
  height,
  rounded = false
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse';
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${roundedClasses} ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({
  lines = 1,
  className = '',
  lineHeight = '1rem',
  gap = '0.5rem'
}: {
  lines?: number;
  className?: string;
  lineHeight?: string;
  gap?: string;
}) {
  return (
    <div className={`space-y-${gap === '0.5rem' ? '2' : '3'} ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={lineHeight}
          className={index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      <Skeleton height="256px" className="w-full" />
      <div className="p-4 space-y-3">
        <Skeleton height="1.5rem" className="w-3/4" />
        <SkeletonText lines={2} lineHeight="1rem" />
        <div className="flex flex-wrap gap-2">
          <Skeleton height="1.5rem" width="60px" rounded />
          <Skeleton height="1.5rem" width="80px" rounded />
          <Skeleton height="1.5rem" width="70px" rounded />
        </div>
        <Skeleton height="1rem" className="w-1/2" />
      </div>
    </div>
  );
}