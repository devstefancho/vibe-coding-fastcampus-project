'use client';

import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function Header() {
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();

  return (
    <header className="bg-white shadow-md border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
            ShoeMall
          </Link>

          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-gray-800 font-medium">
              홈
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-800 font-medium">
              러닝화
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-800 font-medium">
              캐주얼
            </Link>
            <Link href="/" className="text-gray-600 hover:text-gray-800 font-medium">
              정장화
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/cart"
              className="relative bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              장바구니
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}