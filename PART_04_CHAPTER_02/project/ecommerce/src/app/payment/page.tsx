'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function PaymentPage() {
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const paymentWidgetRef = useRef<any>(null);
  const initPromiseRef = useRef<Promise<void> | null>(null);
  const initTokenRef = useRef<symbol | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const savedPaymentData = localStorage.getItem('paymentData');
    if (!savedPaymentData) {
      alert('결제 정보가 없습니다.');
      router.push('/cart');
      return;
    }

    const data = JSON.parse(savedPaymentData);
    setPaymentData(data);

    const initToken = Symbol();
    initTokenRef.current = initToken;

    const initPromise = initializePaymentWidget(data, initToken);
    initPromiseRef.current = initPromise;

    return () => {
      initTokenRef.current = null;

      const cleanup = async () => {
        if (initPromiseRef.current) {
          try {
            await initPromiseRef.current;
          } catch (error) {
            console.log('Cleanup: init promise failed', error);
          }
        }

        if (paymentWidgetRef.current) {
          try {
            await paymentWidgetRef.current.cleanup?.();
          } catch (error) {
            console.log('Cleanup: widget cleanup failed', error);
          }
          paymentWidgetRef.current = null;
        }

        initPromiseRef.current = null;
      };

      cleanup();
    };
  }, [user, router]);

  const initializePaymentWidget = async (data: any, token: symbol): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        // 이미 초기화된 위젯이 있다면 기존 Promise 대기
        if (initPromiseRef.current) {
          await initPromiseRef.current;
        }

        // 토큰 검사
        if (initTokenRef.current !== token) {
          resolve();
          return;
        }

        // 이미 초기화된 위젯이 있다면 중단
        if (paymentWidgetRef.current) {
          setLoading(false);
          resolve();
          return;
        }

        setLoading(true);

        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          throw new Error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
        }

        // 토큰 검사
        if (initTokenRef.current !== token) {
          resolve();
          return;
        }

        const tossPayments = await loadTossPayments(clientKey);

        // 토큰 검사
        if (initTokenRef.current !== token) {
          resolve();
          return;
        }

        const paymentWidget = tossPayments.widgets({
          customerKey: `customer_${user?.id}`
        });

        // 토큰 검사
        if (initTokenRef.current !== token) {
          resolve();
          return;
        }

        // 반드시 setAmount를 먼저 호출해야 함 (객체 형태로 전달)
        await paymentWidget.setAmount({
          currency: "KRW",
          value: data.totalAmount
        });

        // 토큰 검사
        if (initTokenRef.current !== token) {
          resolve();
          return;
        }

        await paymentWidget.renderPaymentMethods({
          selector: '#payment-method',
          variantKey: 'DEFAULT'
        });

        // 토큰 검사
        if (initTokenRef.current !== token) {
          resolve();
          return;
        }

        await paymentWidget.renderAgreement({
          selector: '#agreement',
          variantKey: 'AGREEMENT'
        });

        // 토큰 검사
        if (initTokenRef.current !== token) {
          resolve();
          return;
        }

        paymentWidgetRef.current = paymentWidget;

        if (initTokenRef.current === token) {
          setLoading(false);
        }

        resolve();
      } catch (error) {
        console.error('결제 위젯 초기화 오류:', error);

        if (initTokenRef.current === token) {
          alert('결제 위젯을 불러오는데 실패했습니다.');
          setLoading(false);
        }

        reject(error);
      }
    });
  };

  const handlePayment = async () => {
    if (!paymentWidgetRef.current || !paymentData || !user) {
      return;
    }

    try {
      await api.createOrder({
        userId: user.id,
        orderId: paymentData.orderId,
        totalAmount: paymentData.totalAmount,
        customerName: paymentData.customerName,
        customerEmail: paymentData.customerEmail,
        customerPhone: paymentData.customerPhone,
        shippingAddress: paymentData.shippingAddress,
        items: paymentData.items
      });

      await paymentWidgetRef.current.requestPayment({
        orderId: paymentData.orderId,
        orderName: `디지털 굿즈 ${paymentData.items.length}건`,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
        customerMobilePhone: paymentData.customerPhone.replace(/\D/g, '')
      });
    } catch (error) {
      console.error('결제 요청 오류:', error);
      alert('결제 요청에 실패했습니다.');
    }
  };

  if (!user || !paymentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">결제</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">주문 정보</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>주문번호</span>
              <span className="font-mono text-sm">{paymentData.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>주문자</span>
              <span>{paymentData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span>이메일</span>
              <span>{paymentData.customerEmail}</span>
            </div>
            <div className="flex justify-between">
              <span>전화번호</span>
              <span>{paymentData.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span>배송지</span>
              <span>{paymentData.shippingAddress}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>총 결제금액</span>
              <span className="text-blue-600">
                {paymentData.totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">결제 수단</h2>
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">결제 위젯을 불러오는 중...</span>
            </div>
          )}
          <div id="payment-method" style={{ display: loading ? 'none' : 'block' }}></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div id="agreement" style={{ display: loading ? 'none' : 'block' }}></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={loading || !paymentWidgetRef.current}
            className="w-full bg-blue-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '결제 준비 중...' : `${paymentData.totalAmount.toLocaleString()}원 결제하기`}
          </button>
          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
          >
            주문 정보 수정
          </button>
        </div>
      </div>
    </div>
  );
}