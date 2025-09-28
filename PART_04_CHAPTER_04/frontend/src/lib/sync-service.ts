import { Transaction, Category, LS_KEYS } from '@/types/budget';

interface SyncResult {
  success: boolean;
  message: string;
  data?: {
    transactions: Transaction[];
    categories: Category[];
    lastSyncAt: string;
  };
}

export class SyncService {
  // 데이터 중복 제거 유틸리티 함수
  private static removeDuplicateTransactions(transactions: Transaction[]): Transaction[] {
    const uniqueTransactions = new Map<string, Transaction>();

    // ID 기준으로 중복 제거, 최신 updatedAt을 가진 항목 유지
    transactions.forEach(transaction => {
      const existing = uniqueTransactions.get(transaction.id);
      if (!existing || new Date(transaction.updatedAt) > new Date(existing.updatedAt)) {
        uniqueTransactions.set(transaction.id, transaction);
      }
    });

    return Array.from(uniqueTransactions.values());
  }

  private static removeDuplicateCategories(categories: Category[]): Category[] {
    const uniqueCategories = new Map<string, Category>();

    // ID 기준으로 중복 제거, 최신 updatedAt을 가진 항목 유지
    categories.forEach(category => {
      const existing = uniqueCategories.get(category.id);
      if (!existing || new Date(category.updatedAt || '') > new Date(existing.updatedAt || '')) {
        uniqueCategories.set(category.id, category);
      }
    });

    return Array.from(uniqueCategories.values());
  }

  // LocalStorage에서 데이터 읽기 (중복 제거 포함)
  static getLocalData() {
    const transactions = JSON.parse(localStorage.getItem(LS_KEYS.transactions) || '[]') as Transaction[];
    const categories = JSON.parse(localStorage.getItem(LS_KEYS.categories) || '[]') as Category[];
    const syncMeta = JSON.parse(localStorage.getItem(LS_KEYS.sync) || '{}');

    // 로컬 데이터에서도 중복 제거
    const uniqueTransactions = this.removeDuplicateTransactions(transactions);
    const uniqueCategories = this.removeDuplicateCategories(categories);

    // 중복이 제거되었다면 LocalStorage 업데이트
    if (uniqueTransactions.length !== transactions.length || uniqueCategories.length !== categories.length) {
      console.log(`로컬 데이터 중복 제거: 거래 ${transactions.length}→${uniqueTransactions.length}, 카테고리 ${categories.length}→${uniqueCategories.length}`);
      this.saveLocalData(uniqueTransactions, uniqueCategories);
    }

    return {
      transactions: uniqueTransactions,
      categories: uniqueCategories,
      syncMeta
    };
  }

  // LocalStorage에 데이터 저장
  static saveLocalData(transactions: Transaction[], categories: Category[], lastSyncAt?: string) {
    localStorage.setItem(LS_KEYS.transactions, JSON.stringify(transactions));
    localStorage.setItem(LS_KEYS.categories, JSON.stringify(categories));

    if (lastSyncAt) {
      const syncMeta = { lastSyncAt, pendingCount: 0 };
      localStorage.setItem(LS_KEYS.sync, JSON.stringify(syncMeta));
    }
  }

  // Google Sheets에 연결 테스트
  static async testConnection(): Promise<boolean> {
    try {
      const response = await fetch('/api/sheets/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Connection test failed:', error);
      return false;
    }
  }

  // 로컬 데이터를 Google Sheets에 업로드
  static async uploadToSheets(): Promise<SyncResult> {
    try {
      const { transactions, categories } = this.getLocalData();

      const response = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactions,
          categories
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 동기화 성공 시 로컬에 마지막 동기화 시간 저장
        this.saveLocalData(transactions, categories, result.syncedAt);

        return {
          success: true,
          message: '로컬 데이터가 Google Sheets에 업로드되었습니다.',
          data: {
            transactions,
            categories,
            lastSyncAt: result.syncedAt
          }
        };
      } else {
        return {
          success: false,
          message: result.message || '업로드 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      console.error('Upload to sheets failed:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.'
      };
    }
  }

  // Google Sheets에서 데이터 다운로드 (저장하지 않고 데이터만 반환)
  static async downloadFromSheets(): Promise<SyncResult> {
    try {
      const response = await fetch('/api/sheets/sync', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        const { transactions, categories, lastSyncAt } = result.data;

        // 자동 저장하지 않고 데이터만 반환
        return {
          success: true,
          message: 'Google Sheets에서 데이터를 가져왔습니다.',
          data: {
            transactions,
            categories,
            lastSyncAt
          }
        };
      } else {
        return {
          success: false,
          message: result.message || '다운로드 중 오류가 발생했습니다.'
        };
      }
    } catch (error) {
      console.error('Download from sheets failed:', error);
      return {
        success: false,
        message: '네트워크 오류가 발생했습니다.'
      };
    }
  }

  // 로컬 데이터를 Google Sheets에 백업
  static async backupToSheets(): Promise<SyncResult> {
    try {
      console.log('Google Sheets 백업 시작...');
      const result = await this.uploadToSheets();

      if (result.success) {
        console.log('Google Sheets 백업 완료');
        return {
          success: true,
          message: '로컬 데이터가 Google Sheets에 백업되었습니다.',
          data: result.data
        };
      } else {
        return result;
      }
    } catch (error) {
      console.error('Backup to sheets failed:', error);
      return {
        success: false,
        message: 'Google Sheets 백업 중 오류가 발생했습니다.'
      };
    }
  }

  // Google Sheets에서 로컬로 복원 (사용자 확인 필요)
  static async restoreFromSheets(): Promise<SyncResult> {
    try {
      console.log('Google Sheets에서 복원 중...');
      const remoteResult = await this.downloadFromSheets();

      if (!remoteResult.success || !remoteResult.data) {
        return {
          success: false,
          message: 'Google Sheets에서 데이터를 가져올 수 없습니다.'
        };
      }

      const { transactions, categories, lastSyncAt } = remoteResult.data;

      // 중복 제거
      const finalTransactions = this.removeDuplicateTransactions(transactions);
      const finalCategories = this.removeDuplicateCategories(categories);

      // 로컬에 저장
      this.saveLocalData(finalTransactions, finalCategories, lastSyncAt);

      console.log('Google Sheets에서 복원 완료');
      return {
        success: true,
        message: 'Google Sheets에서 데이터를 복원했습니다.',
        data: {
          transactions: finalTransactions,
          categories: finalCategories,
          lastSyncAt: lastSyncAt || new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Restore from sheets failed:', error);
      return {
        success: false,
        message: 'Google Sheets에서 복원 중 오류가 발생했습니다.'
      };
    }
  }

  // 개별 거래 동기화
  static async syncTransaction(transaction: Transaction, action: 'create' | 'update' | 'delete'): Promise<boolean> {
    try {
      let response: Response;

      switch (action) {
        case 'create':
          response = await fetch('/api/sheets/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
          });
          break;

        case 'update':
          response = await fetch(`/api/sheets/transactions/${transaction.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
          });
          break;

        case 'delete':
          response = await fetch(`/api/sheets/transactions/${transaction.id}`, {
            method: 'DELETE',
          });
          break;
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Transaction ${action} sync failed:`, error);
      return false;
    }
  }

  // 개별 카테고리 동기화
  static async syncCategory(category: Category, action: 'create' | 'update' | 'delete'): Promise<boolean> {
    try {
      let response: Response;

      switch (action) {
        case 'create':
          response = await fetch('/api/sheets/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
          });
          break;

        case 'update':
          response = await fetch(`/api/sheets/categories/${category.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(category),
          });
          break;

        case 'delete':
          response = await fetch(`/api/sheets/categories/${category.id}`, {
            method: 'DELETE',
          });
          break;
      }

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Category ${action} sync failed:`, error);
      return false;
    }
  }

  // 자동 동기화 (5분 간격)
  static startAutoSync(callback?: (result: SyncResult) => void) {
    const interval = setInterval(async () => {
      const result = await this.smartSync();
      if (callback) {
        callback(result);
      }
    }, 5 * 60 * 1000); // 5분

    return interval;
  }

  // 자동 동기화 중지
  static stopAutoSync(intervalId: NodeJS.Timeout) {
    clearInterval(intervalId);
  }
}