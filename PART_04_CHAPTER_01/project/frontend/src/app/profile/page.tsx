'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, profile, loading, profileLoading, updateUserProfile, error } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }

    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
    }
  }, [user, profile, router, loading]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요.';
    }

    if (formData.phone && !/^[0-9-]+$/.test(formData.phone)) {
      errors.phone = '올바른 전화번호 형식을 입력해주세요.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    try {
      await updateUserProfile(formData);
      setSuccessMessage('프로필이 성공적으로 저장되었습니다!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Profile update failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (!user) {
    return null;
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 text-center">프로필 수정</h1>
          <p className="text-gray-600 text-center mt-2">개인정보를 수정하실 수 있습니다</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름 *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="홍길동"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              전화번호
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="010-1234-5678"
            />
            {formErrors.phone && (
              <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              주소
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="서울특별시 강남구 테헤란로 123"
            />
          </div>

          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}