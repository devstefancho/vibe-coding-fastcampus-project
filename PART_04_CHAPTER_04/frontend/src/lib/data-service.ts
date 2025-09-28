import { Transaction, Category, MonthSummary, LS_KEYS, toMonth } from '@/types/budget';
import { SyncService } from './sync-service';
import { mockCategories, mockTransactions } from './mock-data';

export class DataService {
  // 초기 데이터 설정 (첫 실행 시)
  static async initializeData(): Promise<void> {
    const localData = SyncService.getLocalData();

    // Google Sheets 구조 초기화 시도
    try {
      const isConnected = await SyncService.testConnection();
      if (isConnected) {
        console.log('Google Sheets 구조 초기화 중...');
        await this.initializeGoogleSheets();
      }
    } catch (error) {
      console.log('Google Sheets 구조 초기화 실패:', error);
    }

    // LocalStorage가 비어있다면 초기 데이터 설정
    if (localData.transactions.length === 0 && localData.categories.length === 0) {
      console.log('초기 데이터 설정 중...');

      // 기본 카테고리와 샘플 거래 데이터 설정
      SyncService.saveLocalData(mockTransactions, mockCategories);

      // Google Sheets에 백업 시도
      try {
        const isConnected = await SyncService.testConnection();
        if (isConnected) {
          console.log('Google Sheets에 초기 백업 중...');
          await SyncService.backupToSheets();
        }
      } catch (error) {
        console.log('Google Sheets 백업 실패, LocalStorage만 사용:', error);
      }
    } else {
      // 기존 데이터가 있다면 자동 백업 없이 진행
      console.log('기존 로컬 데이터 사용 (자동 백업 생략)');
    }
  }

  // Google Sheets 구조 초기화
  static async initializeGoogleSheets(): Promise<boolean> {
    try {
      const response = await fetch('/api/sheets/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        console.log('Google Sheets 구조 초기화 완료');
        return true;
      } else {
        console.log('Google Sheets 구조 초기화 실패:', result.message);
        return false;
      }
    } catch (error) {
      console.error('Google Sheets 초기화 API 호출 실패:', error);
      return false;
    }
  }

  // 모든 거래 조회
  static getTransactions(): Transaction[] {
    const localData = SyncService.getLocalData();
    return localData.transactions.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  // 모든 카테고리 조회
  static getCategories(): Category[] {
    const localData = SyncService.getLocalData();
    return localData.categories.filter(cat => cat.active);
  }

  // 거래 추가
  static async addTransaction(transactionData: Omit<Transaction, 'id' | 'month' | 'updatedAt'>): Promise<Transaction> {
    const now = new Date().toISOString();
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...transactionData,
      month: toMonth(transactionData.date),
      updatedAt: now,
    };

    // LocalStorage에 저장
    const localData = SyncService.getLocalData();
    const updatedTransactions = [...localData.transactions, newTransaction];
    SyncService.saveLocalData(updatedTransactions, localData.categories);

    // Google Sheets 자동 백업 시도 (에러 무시)
    try {
      await SyncService.syncTransaction(newTransaction, 'create');
    } catch (error) {
      console.log('Google Sheets 백업 실패:', error);
    }

    return newTransaction;
  }

  // 거래 수정
  static async updateTransaction(transactionId: string, updateData: Partial<Transaction>): Promise<Transaction | null> {
    const localData = SyncService.getLocalData();
    const transactionIndex = localData.transactions.findIndex(t => t.id === transactionId);

    if (transactionIndex === -1) {
      return null;
    }

    const updatedTransaction: Transaction = {
      ...localData.transactions[transactionIndex],
      ...updateData,
      month: updateData.date ? toMonth(updateData.date) : localData.transactions[transactionIndex].month,
      updatedAt: new Date().toISOString(),
    };

    // LocalStorage 업데이트
    const updatedTransactions = [...localData.transactions];
    updatedTransactions[transactionIndex] = updatedTransaction;
    SyncService.saveLocalData(updatedTransactions, localData.categories);

    // Google Sheets 자동 백업 시도 (에러 무시)
    try {
      await SyncService.syncTransaction(updatedTransaction, 'update');
    } catch (error) {
      console.log('Google Sheets 백업 실패:', error);
    }

    return updatedTransaction;
  }

  // 거래 삭제
  static async deleteTransaction(transactionId: string): Promise<boolean> {
    const localData = SyncService.getLocalData();
    const transaction = localData.transactions.find(t => t.id === transactionId);

    if (!transaction) {
      return false;
    }

    // LocalStorage에서 삭제
    const updatedTransactions = localData.transactions.filter(t => t.id !== transactionId);
    SyncService.saveLocalData(updatedTransactions, localData.categories);

    // Google Sheets 자동 백업 시도 (에러 무시)
    try {
      await SyncService.syncTransaction(transaction, 'delete');
    } catch (error) {
      console.log('Google Sheets 백업 실패:', error);
    }

    return true;
  }

  // 카테고리 추가
  static async addCategory(categoryData: Omit<Category, 'id' | 'updatedAt'>): Promise<Category> {
    const now = new Date().toISOString();
    const newCategory: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...categoryData,
      updatedAt: now,
    };

    // LocalStorage에 저장
    const localData = SyncService.getLocalData();
    const updatedCategories = [...localData.categories, newCategory];
    SyncService.saveLocalData(localData.transactions, updatedCategories);

    // Google Sheets 백업 시도
    try {
      await SyncService.syncCategory(newCategory, 'create');
    } catch (error) {
      console.log('Google Sheets 백업 실패:', error);
    }

    return newCategory;
  }

  // 카테고리 수정
  static async updateCategory(categoryId: string, updateData: Partial<Category>): Promise<Category | null> {
    const localData = SyncService.getLocalData();
    const categoryIndex = localData.categories.findIndex(c => c.id === categoryId);

    if (categoryIndex === -1) {
      return null;
    }

    const updatedCategory: Category = {
      ...localData.categories[categoryIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // LocalStorage 업데이트
    const updatedCategories = [...localData.categories];
    updatedCategories[categoryIndex] = updatedCategory;
    SyncService.saveLocalData(localData.transactions, updatedCategories);

    // Google Sheets 백업 시도
    try {
      await SyncService.syncCategory(updatedCategory, 'update');
    } catch (error) {
      console.log('Google Sheets 백업 실패:', error);
    }

    return updatedCategory;
  }

  // 카테고리 삭제 (비활성화)
  static async deleteCategory(categoryId: string): Promise<boolean> {
    return this.updateCategory(categoryId, { active: false }) !== null;
  }

  // 월별 요약 계산
  static getMonthSummaries(): MonthSummary[] {
    const transactions = this.getTransactions();
    const monthlyData: { [key: string]: { income: number; expense: number } } = {};

    transactions.forEach(txn => {
      if (!monthlyData[txn.month]) {
        monthlyData[txn.month] = { income: 0, expense: 0 };
      }

      if (txn.type === 'income') {
        monthlyData[txn.month].income += txn.amount;
      } else {
        monthlyData[txn.month].expense += txn.amount;
      }
    });

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month: month as `${number}-${number}`,
        income: data.income,
        expense: data.expense,
        net: data.income - data.expense,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  // 현재 월 거래 조회
  static getCurrentMonthTransactions(): Transaction[] {
    const currentMonth = new Date().toISOString().slice(0, 7) as `${number}-${number}`;
    return this.getTransactions().filter(txn => txn.month === currentMonth);
  }

  // 최근 거래 조회
  static getRecentTransactions(limit: number = 10): Transaction[] {
    return this.getTransactions().slice(0, limit);
  }

  // 카테고리별 지출 계산
  static getCategoryExpenses(month?: string): { name: string; value: number; color: string }[] {
    const transactions = this.getTransactions();
    const targetTransactions = month
      ? transactions.filter(txn => txn.month === month && txn.type === 'expense')
      : transactions.filter(txn => txn.type === 'expense');

    const categoryData: { [key: string]: number } = {};
    const categories = this.getCategories();

    targetTransactions.forEach(txn => {
      const category = categories.find(cat => cat.id === txn.categoryId);
      const categoryName = category?.name || 'Unknown';
      categoryData[categoryName] = (categoryData[categoryName] || 0) + txn.amount;
    });

    const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0000'];

    return Object.entries(categoryData)
      .map(([name, value], index) => ({
        name,
        value,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }

  // 카테고리 이름 조회
  static getCategoryName(categoryId: string): string {
    const categories = this.getCategories();
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  }

  // Google Sheets 백업
  static async backupToGoogleSheets(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await SyncService.backupToSheets();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Google Sheets 백업 중 오류가 발생했습니다.'
      };
    }
  }

  // Google Sheets에서 복원
  static async restoreFromGoogleSheets(): Promise<{ success: boolean; message: string }> {
    try {
      const result = await SyncService.restoreFromSheets();
      return result;
    } catch (error) {
      return {
        success: false,
        message: 'Google Sheets에서 복원 중 오류가 발생했습니다.'
      };
    }
  }
}