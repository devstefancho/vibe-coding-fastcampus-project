import { Transaction, Category, MonthSummary } from '@/types/budget';

export const mockCategories: Category[] = [
  { id: 'cat_food', name: '식비', type: 'expense', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_transport', name: '교통비', type: 'expense', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_entertainment', name: '오락', type: 'expense', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_shopping', name: '쇼핑', type: 'expense', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_health', name: '의료비', type: 'expense', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_utilities', name: '공과금', type: 'expense', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_salary', name: '급여', type: 'income', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_freelance', name: '프리랜서', type: 'income', active: true, updatedAt: '2025-09-20T09:00:00Z' },
  { id: 'cat_investment', name: '투자수익', type: 'income', active: true, updatedAt: '2025-09-20T09:00:00Z' },
];

export const mockTransactions: Transaction[] = [
  // 2025-09 거래
  { id: 'txn_2025-09-27_001', date: '2025-09-27', month: '2025-09', type: 'expense', amount: 12900, categoryId: 'cat_food', memo: '점심', updatedAt: '2025-09-27T12:33:00Z' },
  { id: 'txn_2025-09-27_002', date: '2025-09-27', month: '2025-09', type: 'income', amount: 2000000, categoryId: 'cat_salary', memo: '9월 급여', updatedAt: '2025-09-27T12:35:10Z' },
  { id: 'txn_2025-09-26_001', date: '2025-09-26', month: '2025-09', type: 'expense', amount: 3200, categoryId: 'cat_transport', memo: '지하철', updatedAt: '2025-09-26T08:30:00Z' },
  { id: 'txn_2025-09-25_001', date: '2025-09-25', month: '2025-09', type: 'expense', amount: 45000, categoryId: 'cat_entertainment', memo: '영화관', updatedAt: '2025-09-25T19:20:00Z' },
  { id: 'txn_2025-09-24_001', date: '2025-09-24', month: '2025-09', type: 'expense', amount: 89000, categoryId: 'cat_shopping', memo: '옷 구매', updatedAt: '2025-09-24T15:45:00Z' },
  { id: 'txn_2025-09-23_001', date: '2025-09-23', month: '2025-09', type: 'expense', amount: 65000, categoryId: 'cat_utilities', memo: '전기요금', updatedAt: '2025-09-23T10:15:00Z' },
  { id: 'txn_2025-09-22_001', date: '2025-09-22', month: '2025-09', type: 'expense', amount: 25000, categoryId: 'cat_health', memo: '약국', updatedAt: '2025-09-22T14:20:00Z' },
  { id: 'txn_2025-09-21_001', date: '2025-09-21', month: '2025-09', type: 'expense', amount: 15500, categoryId: 'cat_food', memo: '저녁', updatedAt: '2025-09-21T18:40:00Z' },
  { id: 'txn_2025-09-20_001', date: '2025-09-20', month: '2025-09', type: 'income', amount: 300000, categoryId: 'cat_freelance', memo: '디자인 작업', updatedAt: '2025-09-20T16:30:00Z' },

  // 2025-08 거래
  { id: 'txn_2025-08-31_001', date: '2025-08-31', month: '2025-08', type: 'expense', amount: 18000, categoryId: 'cat_food', memo: '월말 회식', updatedAt: '2025-08-31T20:30:00Z' },
  { id: 'txn_2025-08-30_001', date: '2025-08-30', month: '2025-08', type: 'income', amount: 1950000, categoryId: 'cat_salary', memo: '8월 급여', updatedAt: '2025-08-30T09:00:00Z' },
  { id: 'txn_2025-08-29_001', date: '2025-08-29', month: '2025-08', type: 'expense', amount: 120000, categoryId: 'cat_shopping', memo: '신발 구매', updatedAt: '2025-08-29T16:45:00Z' },
  { id: 'txn_2025-08-28_001', date: '2025-08-28', month: '2025-08', type: 'expense', amount: 3500, categoryId: 'cat_transport', memo: '버스', updatedAt: '2025-08-28T07:30:00Z' },
  { id: 'txn_2025-08-27_001', date: '2025-08-27', month: '2025-08', type: 'expense', amount: 35000, categoryId: 'cat_entertainment', memo: '카페', updatedAt: '2025-08-27T14:20:00Z' },
  { id: 'txn_2025-08-26_001', date: '2025-08-26', month: '2025-08', type: 'income', amount: 150000, categoryId: 'cat_investment', memo: '주식 배당', updatedAt: '2025-08-26T11:15:00Z' },

  // 2025-07 거래
  { id: 'txn_2025-07-31_001', date: '2025-07-31', month: '2025-07', type: 'income', amount: 2100000, categoryId: 'cat_salary', memo: '7월 급여', updatedAt: '2025-07-31T09:00:00Z' },
  { id: 'txn_2025-07-30_001', date: '2025-07-30', month: '2025-07', type: 'expense', amount: 95000, categoryId: 'cat_utilities', memo: '가스요금', updatedAt: '2025-07-30T10:30:00Z' },
  { id: 'txn_2025-07-29_001', date: '2025-07-29', month: '2025-07', type: 'expense', amount: 200000, categoryId: 'cat_shopping', memo: '여름 의류', updatedAt: '2025-07-29T15:20:00Z' },
  { id: 'txn_2025-07-28_001', date: '2025-07-28', month: '2025-07', type: 'expense', amount: 80000, categoryId: 'cat_entertainment', memo: '콘서트', updatedAt: '2025-07-28T19:00:00Z' },
];

// 유틸리티 함수들
export const getCategoryName = (categoryId: string): string => {
  const category = mockCategories.find(cat => cat.id === categoryId);
  return category?.name || 'Unknown';
};

export const getMonthSummaries = (): MonthSummary[] => {
  const monthlyData: { [key: string]: { income: number; expense: number } } = {};

  mockTransactions.forEach(txn => {
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
};

export const getCurrentMonthTransactions = (): Transaction[] => {
  const currentMonth = '2025-09';
  return mockTransactions.filter(txn => txn.month === currentMonth);
};

export const getRecentTransactions = (limit: number = 10): Transaction[] => {
  return [...mockTransactions]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);
};

export const getCategoryExpenses = (month?: string): { name: string; value: number; color: string }[] => {
  const targetTransactions = month
    ? mockTransactions.filter(txn => txn.month === month && txn.type === 'expense')
    : mockTransactions.filter(txn => txn.type === 'expense');

  const categoryData: { [key: string]: number } = {};

  targetTransactions.forEach(txn => {
    const categoryName = getCategoryName(txn.categoryId);
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
};