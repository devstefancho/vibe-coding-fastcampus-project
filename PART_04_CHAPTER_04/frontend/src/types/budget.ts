export type TxnType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: `${number}-${number}-${number}`;      // "YYYY-MM-DD"
  month: `${number}-${number}`;               // "YYYY-MM"
  type: TxnType;
  amount: number;                              // KRW 정수(원 단위) 권장
  categoryId: string;
  memo?: string;
  updatedAt: string;                           // ISO8601
}

export interface Category {
  id: string;
  name: string;
  type: TxnType;
  active: boolean;
  updatedAt?: string;
}

export interface MonthSummary {
  month: `${number}-${number}`;
  income: number;
  expense: number;
  net: number;
}

export interface SyncMeta {
  sheetId: string;
  lastSyncAt: string;
  pendingCount: number;
}

export const LS_KEYS = {
  transactions: 'bk.v1.transactions',
  categories: 'bk.v1.categories',
  sync: 'bk.v1.sync',
} as const;

export const SHEET_TABS = {
  transactions: 'Transactions',
  categories: 'Categories',
  meta: 'Meta',
} as const;

// month 파생 유틸(월별 합계/필터링 편의)
export const toMonth = (date: string): `${number}-${number}` =>
  date.slice(0, 7) as `${number}-${number}`;