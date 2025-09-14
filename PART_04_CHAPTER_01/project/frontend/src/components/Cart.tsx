'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { formatPrice } from '@/lib/products';

export default function Cart() {
  const { state, removeItem, updateQuantity, clearCart } = useCart();

  if (state.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">장바구니가 비어있습니다</h2>
        <p className="text-gray-600 mb-6">원하는 상품을 장바구니에 담아보세요!</p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">장바구니</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          전체 삭제
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        {state.items.map((item, index) => (
          <div key={`${item.product.id}-${item.size}-${item.color}`} className={`p-6 ${index !== state.items.length - 1 ? 'border-b' : ''}`}>
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>

              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{item.product.name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  사이즈: {item.size} | 색상: {item.color}
                </p>
                <p className="text-blue-600 font-semibold mt-2">
                  {formatPrice(item.product.price)}
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)}
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <span className="text-lg font-medium w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)}
                  className="bg-gray-200 text-gray-700 w-8 h-8 rounded-full hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
              </div>

              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.product.id, item.size, item.color)}
                  className="text-red-600 hover:text-red-700 text-sm mt-2"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-md mt-6 p-6">
        <div className="flex justify-between items-center text-xl font-semibold">
          <span>총 합계:</span>
          <span className="text-blue-600">{formatPrice(state.total)}</span>
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4 hover:bg-blue-700 transition-colors text-lg font-semibold">
          주문하기
        </button>
      </div>
    </div>
  );
}