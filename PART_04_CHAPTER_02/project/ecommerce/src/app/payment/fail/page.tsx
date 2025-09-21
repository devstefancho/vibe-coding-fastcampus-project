'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

export default function PaymentFailPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const failReason = searchParams.get('message') || '알 수 없는 오류가 발생했습니다.';
  const orderId = searchParams.get('orderId');

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-6xl text-red-500 mb-6">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            결제에 실패했습니다
          </h1>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{failReason}</p>
            {orderId && (
              <p className="text-sm text-red-600 mt-2">
                주문번호: {orderId}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push('/checkout')}
              className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              다시 결제하기
            </button>
            <button
              onClick={() => router.push('/cart')}
              className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
            >
              장바구니로 돌아가기
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400"
            >
              홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}