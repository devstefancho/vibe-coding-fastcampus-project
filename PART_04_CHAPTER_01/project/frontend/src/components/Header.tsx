'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { getCartItemsCount } = useCart();
  const { user, signInWithKakao, signOut, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cartItemsCount = getCartItemsCount();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
            {/* Auth Section */}
            {user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {user.user_metadata?.avatar_url && (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border"
                    />
                  )}
                  <span className="hidden md:inline">
                    {user.user_metadata?.name || '사용자'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b">
                        <div className="font-medium">{user.user_metadata?.name || '사용자'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        프로필 수정
                      </Link>
                      <button
                        onClick={() => {
                          signOut();
                          setShowUserMenu(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithKakao}
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium py-2 px-4 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11L7.5 21l.847-2.735C4.764 16.942 1.5 14.107 1.5 11.185 1.5 6.664 6.201 3 12 3z"/>
                </svg>
                <span className="hidden md:inline">
                  {loading ? '로그인 중...' : '카카오 로그인'}
                </span>
              </button>
            )}

            {/* Cart Button */}
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