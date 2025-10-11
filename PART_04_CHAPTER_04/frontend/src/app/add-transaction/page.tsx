'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { DataService } from '@/lib/data-service';
import { TxnType, Category } from '@/types/budget';
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
  const [categories, setCategories] = useState<Category[]>([]);

  // 카테고리 데이터 로드
  useEffect(() => {
    const loadCategories = () => {
      const allCategories = DataService.getCategories();
      setCategories(allCategories);
    };

    loadCategories();
  }, []);

  const incomeCategories = categories.filter(cat => cat.type === 'income' && cat.active);
  const expenseCategories = categories.filter(cat => cat.type === 'expense' && cat.active);

  const availableCategories = formData.type === 'income' ? incomeCategories : expenseCategories;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 폼 유효성 검사
    if (!formData.amount || !formData.categoryId) {
      alert('금액과 카테고리를 입력해주세요.');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('올바른 금액을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // DataService를 통해 거래 추가
      const newTransaction = await DataService.addTransaction({
        date: formData.date as `${number}-${number}-${number}`,
        type: formData.type,
        amount: amount,
        categoryId: formData.categoryId,
        memo: formData.memo || undefined,
      });

      console.log('거래 추가 완료:', newTransaction);
      alert('거래가 성공적으로 추가되었습니다!');

      // 폼 초기화
      setFormData({
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        amount: '',
        categoryId: '',
        memo: '',
      });

      // 대시보드로 이동
      router.push('/dashboard');
    } catch (error) {
      console.error('거래 추가 실패:', error);
      alert('거래 추가 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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
            <p className="text-black mt-2">새로운 수입 또는 지출을 기록하세요</p>
          </div>
        </div>

        {/* 거래 추가 폼 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 날짜 */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-black mb-2">
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
              <label className="block text-sm font-medium text-black mb-2">
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
                    <div className={`text-sm ${formData.type === 'income' ? 'text-green-600' : 'text-black'}`}>돈이 들어오는 거래</div>
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
                    <div className={`text-sm ${formData.type === 'expense' ? 'text-red-600' : 'text-black'}`}>돈이 나가는 거래</div>
                  </div>
                </button>
              </div>
            </div>

            {/* 금액 */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-black mb-2">
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
              <label htmlFor="categoryId" className="block text-sm font-medium text-black mb-2">
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
              <label htmlFor="memo" className="block text-sm font-medium text-black mb-2">
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
                className="px-6 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
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