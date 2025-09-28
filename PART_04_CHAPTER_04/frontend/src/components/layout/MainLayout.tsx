'use client';

import Sidebar from './Sidebar';
import { DataProvider } from '../providers/DataProvider';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <DataProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </DataProvider>
  );
}