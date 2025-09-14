'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
  const [fieldValidation, setFieldValidation] = useState<{[key: string]: boolean}>({});
  const [isFormValid, setIsFormValid] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLTextAreaElement>(null);

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

  // 폼 유효성 실시간 업데이트
  useEffect(() => {
    const nameValid = fieldValidation.name && !formErrors.name;
    const phoneValid = fieldValidation.phone && !formErrors.phone;
    const addressValid = fieldValidation.address || !formData.address.trim(); // 주소는 선택사항

    setIsFormValid(nameValid && phoneValid && addressValid);
  }, [fieldValidation, formErrors, formData.address]);

  const formatPhoneNumber = (phone: string) => {
    const numbers = phone.replace(/[^\d]/g, '');

    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      if (numbers.startsWith('02')) {
        return numbers.replace(/(\d{2})(\d{0,4})/, '$1-$2');
      } else {
        return numbers.replace(/(\d{3})(\d{0,4})/, '$1-$2');
      }
    } else if (numbers.length <= 11) {
      if (numbers.startsWith('02')) {
        return numbers.replace(/(\d{2})(\d{3,4})(\d{0,4})/, '$1-$2-$3');
      } else {
        return numbers.replace(/(\d{3})(\d{4})(\d{0,4})/, '$1-$2-$3');
      }
    }

    return numbers.slice(0, 11);
  };

  const validateField = (name: string, value: string) => {
    let error = '';
    let isValid = false;

    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = '이름을 입력해주세요.';
        } else if (value.trim().length < 2) {
          error = '이름은 최소 2자 이상이어야 합니다.';
        } else if (value.trim().length > 20) {
          error = '이름은 최대 20자까지 입력 가능합니다.';
        } else if (!/^[가-힣a-zA-Z\s]+$/.test(value.trim())) {
          error = '이름은 한글 또는 영문만 입력 가능합니다.';
        } else {
          isValid = true;
        }
        break;

      case 'phone':
        if (!value.trim()) {
          error = '전화번호를 입력해주세요.';
        } else {
          const numbers = value.replace(/[^\d]/g, '');
          let phoneRegex: RegExp;

          // 휴대폰번호 (010, 011, 016, 017, 018, 019)
          if (numbers.startsWith('01')) {
            phoneRegex = /^01[016789][0-9]{7,8}$/;
          }
          // 서울 지역번호 (02)
          else if (numbers.startsWith('02')) {
            phoneRegex = /^02[0-9]{7,8}$/;
          }
          // 기타 지역번호 (031~069)
          else if (numbers.startsWith('0')) {
            phoneRegex = /^0[3-9][0-9][0-9]{6,7}$/;
          }
          else {
            phoneRegex = /^$/; // 매치되지 않는 패턴
          }

          if (!phoneRegex.test(numbers)) {
            error = '올바른 전화번호 형식을 입력해주세요. (예: 010-1234-5678)';
          } else {
            // 추가 길이 검증
            if (numbers.startsWith('010') && numbers.length !== 11) {
              error = '휴대폰 번호는 11자리여야 합니다. (010-XXXX-XXXX)';
            } else if (numbers.startsWith('02') && (numbers.length < 9 || numbers.length > 10)) {
              error = '서울 지역번호는 9-10자리여야 합니다. (02-XXX-XXXX)';
            } else if (numbers.startsWith('0') && !numbers.startsWith('02') && !numbers.startsWith('01') && (numbers.length < 10 || numbers.length > 11)) {
              error = '지역번호는 10-11자리여야 합니다.';
            } else {
              isValid = true;
            }
          }
        }
        break;

      case 'address':
        if (value.trim().length > 100) {
          error = '주소는 최대 100자까지 입력 가능합니다.';
        } else {
          isValid = true;
        }
        break;
    }

    return { error, isValid };
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    const validation: {[key: string]: boolean} = {};

    ['name', 'phone', 'address'].forEach(field => {
      const { error, isValid } = validateField(field, formData[field as keyof typeof formData]);
      if (error) {
        errors[field] = error;
      }
      validation[field] = isValid;
    });

    setFormErrors(errors);
    setFieldValidation(validation);
    return Object.keys(errors).length === 0;
  };

  const debouncedValidation = useCallback(
    debounce((name: string, value: string) => {
      const { error, isValid } = validateField(name, value);

      setFormErrors(prev => ({
        ...prev,
        [name]: error
      }));

      setFieldValidation(prev => ({
        ...prev,
        [name]: isValid
      }));
    }, 300),
    []
  );

  function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const focusFirstErrorField = () => {
    if (formErrors.name && nameInputRef.current) {
      nameInputRef.current.focus();
    } else if (formErrors.phone && phoneInputRef.current) {
      phoneInputRef.current.focus();
    } else if (formErrors.address && addressInputRef.current) {
      addressInputRef.current.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      focusFirstErrorField();
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

    let formattedValue = value;
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    debouncedValidation(name, formattedValue);
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
            <div className="relative">
              <input
                ref={nameInputRef}
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  formErrors.name
                    ? 'border-red-500 focus:ring-red-500'
                    : fieldValidation.name
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="홍길동"
              />
              {fieldValidation.name && !formErrors.name && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {formErrors.name ? (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">2-20자의 한글 또는 영문만 입력 가능합니다.</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 *
            </label>
            <div className="relative">
              <input
                ref={phoneInputRef}
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  formErrors.phone
                    ? 'border-red-500 focus:ring-red-500'
                    : fieldValidation.phone
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="010-1234-5678"
                maxLength={13}
              />
              {fieldValidation.phone && !formErrors.phone && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {formErrors.phone ? (
              <p className="mt-1 text-sm text-red-600">{formErrors.phone}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">숫자를 입력하면 자동으로 하이픈이 추가됩니다.</p>
            )}
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              주소
            </label>
            <div className="relative">
              <textarea
                ref={addressInputRef}
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                className={`w-full px-3 py-2 pr-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition-colors ${
                  formErrors.address
                    ? 'border-red-500 focus:ring-red-500'
                    : fieldValidation.address
                    ? 'border-green-500 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="서울특별시 강남구 테헤란로 123"
                maxLength={100}
              />
              {fieldValidation.address && !formErrors.address && (
                <div className="absolute top-2 right-0 flex items-start pr-3">
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            {formErrors.address ? (
              <p className="mt-1 text-sm text-red-600">{formErrors.address}</p>
            ) : (
              <p className="mt-1 text-sm text-gray-500">최대 100자까지 입력 가능합니다. ({formData.address.length}/100)</p>
            )}
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
              disabled={isSubmitting || !isFormValid}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isSubmitting || !isFormValid
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}