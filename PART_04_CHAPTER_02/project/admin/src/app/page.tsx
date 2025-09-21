'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  user_id: number;
  order_id: string;
  total_amount: number;
  status: string;
  payment_key?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  created_at: string;
  items?: string;
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchOrders();

    const interval = setInterval(() => {
      fetchOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
      setLastUpdate(new Date());
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
        return 'text-yellow-700 bg-yellow-100';
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getTotalStats = () => {
    const completed = orders.filter(order => order.status === 'completed');
    const pending = orders.filter(order => order.status === 'pending');
    const failed = orders.filter(order => order.status === 'failed');
    const totalRevenue = completed.reduce((sum, order) => sum + order.total_amount, 0);

    return {
      total: orders.length,
      completed: completed.length,
      pending: pending.length,
      failed: failed.length,
      revenue: totalRevenue
    };
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">관리자 대시보드</h1>
          <p className="text-sm text-gray-600 mt-1">
            마지막 업데이트: {isClient ? lastUpdate.toLocaleString('ko-KR') : '로딩 중...'} (10초마다 자동 갱신)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">전체 주문</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-gray-600">완료된 주문</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">대기 중인 주문</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            <div className="text-sm text-gray-600">실패한 주문</div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-purple-600">
              {stats.revenue.toLocaleString()}원
            </div>
            <div className="text-sm text-gray-600">총 매출</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">전체 주문 내역</h2>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="text-gray-600">주문 내역을 불러오는 중...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-6 text-center">
              <div className="text-gray-600">주문 내역이 없습니다.</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문번호
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      고객정보
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문상품
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      금액
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      주문일시
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                        {order.order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-gray-500">{order.customer_email}</div>
                          <div className="text-gray-500">{order.customer_phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {order.items || '주문 상품 정보 없음'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {order.total_amount.toLocaleString()}원
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {isClient ? new Date(order.created_at).toLocaleString('ko-KR') : order.created_at}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
