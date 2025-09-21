'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-800">
            디지털 굿즈 스토어
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/" className="text-gray-600 hover:text-gray-800">
              홈
            </Link>

            {user ? (
              <>
                <Link href="/cart" className="text-gray-600 hover:text-gray-800">
                  장바구니
                </Link>
                <Link href="/orders" className="text-gray-600 hover:text-gray-800">
                  주문내역
                </Link>
                <span className="text-gray-600">안녕하세요, {user.name}님</span>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-800"
                >
                  로그인
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}