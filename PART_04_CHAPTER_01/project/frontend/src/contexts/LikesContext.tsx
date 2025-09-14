'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getLikedProducts, toggleLike } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface LikesContextType {
  likedProducts: string[];
  isLiked: (productId: string) => boolean;
  toggleProductLike: (productId: string, productName?: string) => Promise<void>;
  loading: boolean;
  refreshLikes: () => Promise<void>;
}

const LikesContext = createContext<LikesContextType | undefined>(undefined);

export function LikesProvider({ children }: { children: ReactNode }) {
  const [likedProducts, setLikedProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { showToast } = useToast();

  // 좋아요 목록 새로고침
  const refreshLikes = async () => {
    if (!user) {
      setLikedProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const liked = await getLikedProducts();
      setLikedProducts(liked);
    } catch (error) {
      console.error('Error refreshing likes:', error);
      showToast('좋아요 목록을 불러오는데 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 사용자 상태 변경 시 좋아요 목록 새로고침
  useEffect(() => {
    refreshLikes();
  }, [user]);

  // 특정 상품이 좋아요 상태인지 확인
  const isLiked = (productId: string): boolean => {
    return likedProducts.includes(productId);
  };

  // 좋아요 토글
  const toggleProductLike = async (productId: string, productName?: string) => {
    if (!user) {
      showToast('로그인이 필요합니다.', 'error');
      return;
    }

    try {
      const wasLiked = isLiked(productId);

      // 낙관적 업데이트 (UI 먼저 업데이트)
      if (wasLiked) {
        setLikedProducts(prev => prev.filter(id => id !== productId));
      } else {
        setLikedProducts(prev => [...prev, productId]);
      }

      // 서버에 업데이트
      const isNowLiked = await toggleLike(productId);

      // 성공 메시지 표시
      const message = isNowLiked
        ? `${productName || '상품'}을 좋아요에 추가했습니다!`
        : `${productName || '상품'}을 좋아요에서 제거했습니다.`;

      showToast(message, 'success');

      // 실제 상태와 동기화 (서버 응답 기반으로 재조정)
      if (isNowLiked && !likedProducts.includes(productId)) {
        setLikedProducts(prev => [...prev, productId]);
      } else if (!isNowLiked && likedProducts.includes(productId)) {
        setLikedProducts(prev => prev.filter(id => id !== productId));
      }

    } catch (error) {
      console.error('Error toggling like:', error);

      // 에러 발생 시 원래 상태로 되돌리기
      await refreshLikes();

      showToast('좋아요 처리 중 오류가 발생했습니다.', 'error');
    }
  };

  const value: LikesContextType = {
    likedProducts,
    isLiked,
    toggleProductLike,
    loading,
    refreshLikes,
  };

  return (
    <LikesContext.Provider value={value}>
      {children}
    </LikesContext.Provider>
  );
}

export function useLikes() {
  const context = useContext(LikesContext);
  if (context === undefined) {
    throw new Error('useLikes must be used within a LikesProvider');
  }
  return context;
}