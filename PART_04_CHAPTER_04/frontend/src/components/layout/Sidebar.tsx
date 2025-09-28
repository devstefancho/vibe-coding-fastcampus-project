'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Tags,
  RefreshCw,
  Wallet
} from 'lucide-react';

const menuItems = [
  {
    name: '대시보드',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: '거래 추가',
    href: '/add-transaction',
    icon: PlusCircle,
  },
  {
    name: '카테고리',
    href: '/categories',
    icon: Tags,
  },
  {
    name: '동기화',
    href: '/sync',
    icon: RefreshCw,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* 로고 영역 */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Wallet className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">예산관리</span>
        </div>
      </div>

      {/* 메뉴 영역 */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* 푸터 영역 */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          Budget Manager v1.0
        </div>
      </div>
    </div>
  );
}