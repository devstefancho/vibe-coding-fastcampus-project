'use client';

import { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { DataService } from '@/lib/data-service';
import { Category, TxnType } from '@/types/budget';
import { Plus, Edit, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedTab, setSelectedTab] = useState<TxnType>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as TxnType,
  });

  // 카테고리 데이터 로드
  const loadCategories = () => {
    const allCategories = DataService.getCategories();
    // 비활성화된 카테고리도 포함해서 가져오기
    const localData = DataService.getTransactions(); // getCategories는 active만 가져오므로 직접 LocalStorage 조회
    const allCategoriesIncludingInactive = JSON.parse(localStorage.getItem('bk.v1.categories') || '[]') as Category[];
    setCategories(allCategoriesIncludingInactive);
  };

  useEffect(() => {
    setIsLoading(true);
    loadCategories();
    setIsLoading(false);
  }, []);

  const filteredCategories = categories.filter(cat => cat.type === selectedTab);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        type: category.type,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        type: selectedTab,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', type: 'expense' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('카테고리 이름을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (editingCategory) {
        // 수정
        await DataService.updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          type: formData.type,
        });
        alert('카테고리가 성공적으로 수정되었습니다.');
      } else {
        // 추가
        await DataService.addCategory({
          name: formData.name.trim(),
          type: formData.type,
          active: true,
        });
        alert('카테고리가 성공적으로 추가되었습니다.');
      }

      loadCategories(); // 데이터 새로고침
      handleCloseModal();
    } catch (error) {
      console.error('카테고리 저장 실패:', error);
      alert('카테고리 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (categoryId: string) => {
    try {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) return;

      await DataService.updateCategory(categoryId, {
        active: !category.active,
      });

      loadCategories(); // 데이터 새로고침
    } catch (error) {
      console.error('카테고리 활성화 토글 실패:', error);
      alert('카테고리 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('정말로 이 카테고리를 비활성화하시겠습니까?')) {
      try {
        await DataService.deleteCategory(categoryId);
        loadCategories(); // 데이터 새로고침
        alert('카테고리가 비활성화되었습니다.');
      } catch (error) {
        console.error('카테고리 삭제 실패:', error);
        alert('카테고리 삭제 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* 페이지 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">카테고리 관리</h1>
            <p className="text-gray-600 mt-2">수입과 지출 카테고리를 관리하세요</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>카테고리 추가</span>
          </button>
        </div>

        {/* 탭 */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setSelectedTab('expense')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'expense'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              지출 카테고리 ({categories.filter(cat => cat.type === 'expense').length})
            </button>
            <button
              onClick={() => setSelectedTab('income')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'income'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              수입 카테고리 ({categories.filter(cat => cat.type === 'income').length})
            </button>
          </nav>
        </div>

        {/* 카테고리 목록 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="divide-y divide-gray-200">
            {filteredCategories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>등록된 {selectedTab === 'income' ? '수입' : '지출'} 카테고리가 없습니다.</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="mt-2 text-blue-600 hover:text-blue-700"
                >
                  첫 번째 카테고리를 추가해보세요
                </button>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      category.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className={`font-medium ${
                        category.active ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {category.type === 'income' ? '수입' : '지출'} •{' '}
                        {category.active ? '활성' : '비활성'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(category.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        category.active
                          ? 'text-gray-600 hover:bg-gray-100'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={category.active ? '비활성화' : '활성화'}
                    >
                      {category.active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="수정"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {editingCategory ? '카테고리 수정' : '카테고리 추가'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    카테고리 이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="예: 식비, 교통비"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                    유형 *
                  </label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as TxnType }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="income">수입</option>
                    <option value="expense">지출</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin" />}
                    <span>{isSubmitting ? '저장 중...' : (editingCategory ? '수정' : '추가')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}