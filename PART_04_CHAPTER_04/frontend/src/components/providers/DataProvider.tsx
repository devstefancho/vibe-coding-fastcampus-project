'use client';

import { useEffect, createContext, useContext, useState, useRef } from 'react';
import { DataService } from '@/lib/data-service';

interface DataContextType {
  isInitialized: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType>({
  isInitialized: false,
  refreshData: async () => {},
});

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const initializationRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const initializeData = async () => {
    // 이미 초기화 중이거나 완료된 경우 중복 실행 방지
    if (initializationRef.current || isInitialized) {
      console.log('앱 데이터 초기화 중복 실행 방지');
      return;
    }

    initializationRef.current = true;

    // 이전 요청이 있다면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      console.log('앱 데이터 초기화 시작...');
      await DataService.initializeData();

      // 요청이 취소되지 않았다면 상태 업데이트
      if (!abortControllerRef.current.signal.aborted) {
        setIsInitialized(true);
        console.log('앱 데이터 초기화 완료');
      }
    } catch (error) {
      if (!abortControllerRef.current?.signal.aborted) {
        console.error('앱 데이터 초기화 실패:', error);
        setIsInitialized(true); // 실패해도 앱은 사용할 수 있도록
      }
    } finally {
      initializationRef.current = false;
    }
  };

  const refreshData = async () => {
    try {
      const result = await DataService.backupToGoogleSheets();
      if (result.success) {
        console.log('데이터 새로고침 완료');
      }
    } catch (error) {
      console.error('데이터 새로고침 실패:', error);
    }
  };

  useEffect(() => {
    initializeData();

    // 클린업 함수로 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      initializationRef.current = false;
    };
  }, []); // 의존성 배열을 비워두되, ref로 중복 실행 방지

  return (
    <DataContext.Provider value={{ isInitialized, refreshData }}>
      {children}
    </DataContext.Provider>
  );
}