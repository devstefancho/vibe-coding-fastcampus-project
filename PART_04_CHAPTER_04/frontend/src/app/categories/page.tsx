'use client';

import { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { mockCategories } from '@/lib/mock-data';
import { Category, TxnType } from '@/types/budget';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedTab, setSelectedTab] = useState<TxnType>('expense');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as TxnType,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCategory) {
      // 수정
      setCategories(prev => prev.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, name: formData.name, type: formData.type, updatedAt: new Date().toISOString() }
          : cat
      ));
    } else {
      // 새 카테고리 추가
      const newCategory: Category = {
        id: `cat_${Date.now()}`,
        name: formData.name,
        type: formData.type,
        active: true,
        updatedAt: new Date().toISOString(),
      };
      setCategories(prev => [...prev, newCategory]);
    }

    handleCloseModal();
  };

  const handleToggleActive = (categoryId: string) => {
    setCategories(prev => prev.map(cat =>
      cat.id === categoryId
        ? { ...cat, active: !cat.active, updatedAt: new Date().toISOString() }
        : cat
    ));
  };

  const handleDelete = (categoryId: string) => {
    if (confirm('정말로 이 카테고리를 삭제하시겠습니까?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingCategory ? '수정' : '추가'}
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