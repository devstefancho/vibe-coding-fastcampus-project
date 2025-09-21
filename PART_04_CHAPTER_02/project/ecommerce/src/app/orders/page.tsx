'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/lib/types';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [user, router]);

  const fetchOrders = async () => {
    if (!user) return;

    try {
      const data = await api.getUserOrders(user.id);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '결제 대기';
      case 'completed':
        return '결제 완료';
      case 'failed':
        return '결제 실패';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">주문 내역</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">주문 내역을 불러오는 중...</div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600 mb-4">주문 내역이 없습니다.</div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              쇼핑하러 가기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      주문번호: {order.order_id}
                    </h3>
                    <p className="text-sm text-gray-600">
                      주문일시: {new Date(order.created_at).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">주문자 정보</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>이름: {order.customer_name}</p>
                        <p>이메일: {order.customer_email}</p>
                        <p>전화번호: {order.customer_phone}</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">배송지</h4>
                      <p className="text-sm text-gray-600">{order.shipping_address}</p>
                    </div>
                  </div>

                  {order.items && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">주문 상품</h4>
                      <p className="text-sm text-gray-600">{order.items}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <div className="text-lg font-semibold text-gray-900">
                      총 결제금액: {order.total_amount.toLocaleString()}원
                    </div>
                    {order.payment_key && (
                      <div className="text-xs text-gray-500">
                        결제키: {order.payment_key.slice(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}