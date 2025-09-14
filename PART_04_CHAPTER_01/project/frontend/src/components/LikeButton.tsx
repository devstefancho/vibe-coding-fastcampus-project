'use client';

import { useState } from 'react';
import { useLikes } from '@/contexts/LikesContext';

interface LikeButtonProps {
  productId: string;
  productName?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LikeButton({
  productId,
  productName,
  size = 'md',
  className = ''
}: LikeButtonProps) {
  const { isLiked, toggleProductLike } = useLikes();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 애니메이션 효과
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      await toggleProductLike(productId, productName);
    } catch (error) {
      console.error('Like button error:', error);
    }
  };

  const liked = isLiked(productId);

  // 크기별 클래스 설정
  const sizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={handleClick}
      className={`
        ${sizeClasses[size]}
        ${className}
        rounded-full
        bg-white/90
        backdrop-blur-sm
        border
        border-gray-200
        hover:bg-white
        hover:border-gray-300
        hover:shadow-lg
        transition-all
        duration-200
        flex
        items-center
        justify-center
        group
        ${isAnimating ? 'scale-125' : 'scale-100'}
      `}
      title={liked ? '좋아요 취소' : '좋아요'}
    >
      {liked ? (
        // 채워진 하트 (빨간색)
        <svg
          className={`${iconSizeClasses[size]} text-red-500 transition-transform duration-200 ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      ) : (
        // 빈 하트 (회색 테두리)
        <svg
          className={`${iconSizeClasses[size]} text-gray-400 group-hover:text-red-400 transition-all duration-200 ${
            isAnimating ? 'scale-110' : 'scale-100'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      )}
    </button>
  );
}