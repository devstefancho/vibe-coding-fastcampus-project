'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { Product } from '@/lib/types';
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    try {
      await api.addToCart(user.id, productId);
      showToast('장바구니에 추가되었습니다!', 'success');

      // 1초 후 장바구니 페이지로 이동
      setTimeout(() => {
        router.push('/cart');
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('장바구니 추가에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            디지털 굿즈 스토어
          </h1>
          <p className="text-xl text-gray-600">
            고품질 디지털 캐릭터를 만나보세요
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">상품을 불러오는 중...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square relative">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {product.price.toLocaleString()}원
                    </span>
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      장바구니
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <div className="text-lg text-gray-600">등록된 상품이 없습니다.</div>
          </div>
        )}
      </div>
    </div>
  );
}
