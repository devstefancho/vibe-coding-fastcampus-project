'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import MonthlyTrendChart from '@/components/charts/MonthlyTrendChart';
import CategoryPieChart from '@/components/charts/CategoryPieChart';
import { DataService } from '@/lib/data-service';
import { Transaction, MonthSummary } from '@/types/budget';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

export default function DashboardPage() {
  const [monthSummaries, setMonthSummaries] = useState<MonthSummary[]>([]);
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [categoryExpenses, setCategoryExpenses] = useState<{ name: string; value: number; color: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 데이터 로드 함수
  const loadData = () => {
    const summaries = DataService.getMonthSummaries();
    const currentTransactions = DataService.getCurrentMonthTransactions();
    const recent = DataService.getRecentTransactions(5);
    const expenses = DataService.getCategoryExpenses('2025-09');

    setMonthSummaries(summaries);
    setCurrentMonthTransactions(currentTransactions);
    setRecentTransactions(recent);
    setCategoryExpenses(expenses);
  };

  // 데이터 로드
  useEffect(() => {
    setIsLoading(true);
    loadData();
    setIsLoading(false);
  }, []);


  // 현재 월 요약 계산
  const currentMonth = monthSummaries.find(summary => summary.month === '2025-09');
  const currentIncome = currentMonth?.income || 0;
  const currentExpense = currentMonth?.expense || 0;
  const currentNet = currentMonth?.net || 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 페이지 헤더 */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600 mt-2">2025년 9월 예산 현황</p>
        </div>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">데이터 로딩 중...</span>
          </div>
        )}

        {/* 요약 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">이번달 수입</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">이번달 지출</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentExpense)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">순 수입</p>
                <p className={`text-2xl font-bold ${currentNet >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(currentNet)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">거래 건수</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentMonthTransactions.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MonthlyTrendChart data={monthSummaries} />
          <CategoryPieChart data={categoryExpenses} />
        </div>

        {/* 최근 거래 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">최근 거래</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {DataService.getCategoryName(transaction.categoryId)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {transaction.memo || '메모 없음'} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}