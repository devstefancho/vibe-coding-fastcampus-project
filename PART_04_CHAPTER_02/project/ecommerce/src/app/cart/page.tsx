'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { CartItem } from '@/lib/types';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (productId: number) => {
    if (!user) return;

    try {
      await api.removeFromCart(user.id, productId);
      setCartItems(cartItems.filter(item => item.product_id !== productId));
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('장바구니에서 삭제에 실패했습니다.');
    }
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    router.push('/checkout');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">장바구니</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">장바구니를 불러오는 중...</div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600 mb-4">장바구니가 비어있습니다.</div>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
              쇼핑 계속하기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md">
              {cartItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center p-6 ${
                    index !== cartItems.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                >
                  <div className="w-24 h-24 relative mr-6">
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-contain"
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <p className="text-gray-600">수량: {item.quantity}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600 mb-2">
                      {(item.price * item.quantity).toLocaleString()}원
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.product_id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-900">총 결제금액</span>
                <span className="text-2xl font-bold text-blue-600">
                  {getTotalAmount().toLocaleString()}원
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
                >
                  쇼핑 계속하기
                </button>
                <button
                  onClick={handleCheckout}
                  className="flex-1 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                >
                  결제하기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}