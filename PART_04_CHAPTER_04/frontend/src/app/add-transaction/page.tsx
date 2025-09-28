'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockCategories } from '@/lib/mock-data';
import { TxnType } from '@/types/budget';
import { Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddTransactionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'expense' as TxnType,
    amount: '',
    categoryId: '',
    memo: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const incomeCategories = mockCategories.filter(cat => cat.type === 'income' && cat.active);
  const expenseCategories = mockCategories.filter(cat => cat.type === 'expense' && cat.active);

  const availableCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 실제 구현에서는 여기서 API 호출 또는 로컬 스토리지에 저장
    setTimeout(() => {
      alert('거래가 성공적으로 추가되었습니다!');
      setIsSubmitting(false);
      // 폼 초기화
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        amount: '',
        categoryId: '',
        memo: '',
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // 타입이 변경되면 카테고리 초기화
      ...(field === 'type' ? { categoryId: '' } : {}),
    }));
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 페이지 헤더 */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">거래 추가</h1>
            <p className="text-gray-600 mt-2">새로운 수입 또는 지출을 기록하세요</p>
          </div>
        </div>

        {/* 거래 추가 폼 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 날짜 */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                날짜 *
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* 거래 유형 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                거래 유형 *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'income')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'income'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">수입</div>
                    <div className="text-sm text-gray-600">돈이 들어오는 거래</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('type', 'expense')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.type === 'expense'
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-lg font-semibold">지출</div>
                    <div className="text-sm text-gray-600">돈이 나가는 거래</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 금액 */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                금액 (원) *
              </label>
              <input
                type="number"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="0"
                min="0"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* 카테고리 */}
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                카테고리 *
              </label>
              <select
                id="categoryId"
                value={formData.categoryId}
                onChange={(e) => handleInputChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">카테고리를 선택하세요</option>
                {availableCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 메모 */}
            <div>
              <label htmlFor="memo" className="block text-sm font-medium text-gray-700 mb-2">
                메모
              </label>
              <textarea
                id="memo"
                rows={3}
                value={formData.memo}
                onChange={(e) => handleInputChange('memo', e.target.value)}
                placeholder="거래에 대한 추가 설명을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{isSubmitting ? '저장 중...' : '저장'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 도움말 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">💡 도움말</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 수입: 급여, 용돈, 투자 수익 등 돈이 들어오는 거래</li>
            <li>• 지출: 식비, 교통비, 쇼핑 등 돈이 나가는 거래</li>
            <li>• 메모란에는 거래의 세부 내용을 기록할 수 있습니다</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}