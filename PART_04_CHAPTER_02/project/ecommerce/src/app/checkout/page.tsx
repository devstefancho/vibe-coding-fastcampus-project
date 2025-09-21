'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/lib/types';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shippingInfo, setShippingInfo] = useState({
    name: '조성진',
    email: 'skku7714@gmail.com',
    phone: '010-1234-5678',
    address: '서울시 강남구'
  });
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchCartItems();
  }, [user, router]);

  const fetchCartItems = async () => {
    if (!user) return;

    try {
      const data = await api.getCart(user.id);
      setCartItems(data);

      if (data.length === 0) {
        alert('장바구니가 비어있습니다.');
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePayment = () => {
    const totalAmount = getTotalAmount();
    const orderId = `order_${Date.now()}_${user?.id}`;

    const items = cartItems.map(item => ({
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    const paymentData = {
      orderId,
      totalAmount,
      customerName: shippingInfo.name,
      customerEmail: shippingInfo.email,
      customerPhone: shippingInfo.phone,
      shippingAddress: shippingInfo.address,
      items
    };

    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    router.push('/payment');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">주문/결제</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">주문 정보를 불러오는 중...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">배송지 정보</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이름
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={shippingInfo.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      이메일
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      전화번호
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={shippingInfo.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      주소
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">주문 상품</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-600">수량: {item.quantity}</div>
                      </div>
                      <div className="font-semibold">
                        {(item.price * item.quantity).toLocaleString()}원
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-semibold">총 결제금액</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {getTotalAmount().toLocaleString()}원
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handlePayment}
                    className="w-full bg-blue-500 text-white px-6 py-4 rounded-lg text-lg font-semibold hover:bg-blue-600"
                  >
                    결제하기
                  </button>
                  <button
                    onClick={() => router.push('/cart')}
                    className="w-full bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600"
                  >
                    장바구니로 돌아가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}