'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function PaymentSuccessPage() {
  const [processing, setProcessing] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<any>(null);
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const orderId = searchParams.get('orderId');
    const paymentKey = searchParams.get('paymentKey');
    const amount = searchParams.get('amount');

    if (!orderId || !paymentKey || !amount) {
      alert('결제 정보가 올바르지 않습니다.');
      router.push('/');
      return;
    }

    processPaymentSuccess(orderId, paymentKey, amount);
  }, [user, router, searchParams]);

  const processPaymentSuccess = async (orderId: string, paymentKey: string, amount: string) => {
    try {
      await api.updateOrderStatus(orderId, 'completed', paymentKey);

      setPaymentInfo({
        orderId,
        paymentKey,
        amount: parseInt(amount)
      });

      localStorage.removeItem('paymentData');
    } catch (error) {
      console.error('결제 완료 처리 오류:', error);
      alert('결제 완료 처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {processing ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600 mb-4">결제를 완료하는 중...</div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-6xl text-green-500 mb-6">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              결제가 완료되었습니다!
            </h1>

            {paymentInfo && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h2 className="text-xl font-semibold mb-4">결제 정보</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>주문번호</span>
                    <span className="font-mono text-sm">{paymentInfo.orderId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결제 키</span>
                    <span className="font-mono text-sm">{paymentInfo.paymentKey}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>결제 금액</span>
                    <span className="text-blue-600">
                      {paymentInfo.amount.toLocaleString()}원
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => router.push('/orders')}
                className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
              >
                주문 내역 보기
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
              >
                계속 쇼핑하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}