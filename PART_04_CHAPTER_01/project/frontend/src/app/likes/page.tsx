'use client';

import { useLikes } from '@/contexts/LikesContext';
import { useAuth } from '@/contexts/AuthContext';
import { getProductById } from '@/lib/products';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

export default function LikesPage() {
  const { likedProducts, loading } = useLikes();
  const { user, loading: authLoading } = useAuth();

  if (authLoading || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">좋아요 목록을 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-8">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">좋아요한 상품</h1>
            <p className="text-lg text-gray-600 mb-8">
              좋아요한 상품을 확인하려면 로그인이 필요합니다.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/test"
              className="inline-block bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              카카오로 로그인
            </Link>
            <div className="text-center">
              <Link
                href="/"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 좋아요한 상품들의 상세 정보 가져오기
  const likedProductDetails = likedProducts
    .map(productId => getProductById(productId))
    .filter(product => product !== undefined);

  if (likedProducts.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="mb-8">
            <svg className="w-24 h-24 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">좋아요한 상품이 없습니다</h1>
            <p className="text-lg text-gray-600 mb-8">
              마음에 드는 상품에 하트 버튼을 눌러 좋아요를 추가해보세요!
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
            >
              상품 둘러보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">좋아요한 상품</h1>
            <p className="text-gray-600">
              총 {likedProducts.length}개의 상품을 좋아요했습니다.
            </p>
          </div>

          <Link
            href="/"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition duration-200"
          >
            쇼핑 계속하기
          </Link>
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {likedProductDetails.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {/* 하단 액션 */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 mb-4">
          더 많은 상품을 둘러보고 마음에 드는 상품을 찾아보세요!
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  );
}