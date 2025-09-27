# 1) 엔티티별 필드 표 (필수 위주, 월별 합계/필터링 최적화)

## Transaction (핵심 저장 엔티티)
| 필드        | 타입                      | 필수 | 예시                        | 비고 |
|-------------|---------------------------|------|-----------------------------|------|
| id          | string                    | ✅   | "txn_2025-09-27_0001"       | UUID/날짜+시퀀스 등 고유값 |
| date        | string (YYYY-MM-DD)       | ✅   | "2025-09-27"                | 월별 계산/필터 기준 |
| month       | string (YYYY-MM)          | ✅   | "2025-09"                   | 월별 합계 빠른 집계용(중복 저장) |
| type        | 'income' \| 'expense'     | ✅   | "expense"                   | 수입/지출 구분 |
| amount      | number                    | ✅   | 12900                       | 통화 단위 금액(정수 KRW 추천) |
| categoryId  | string                    | ✅   | "cat_food"                  | 카테고리 참조 |
| memo        | string                    | ❌   | "점심"                      | 선택 메모 |
| updatedAt   | string (ISO8601)          | ✅   | "2025-09-27T12:33:00Z"      | 동기화 충돌 해결용(최신 우선) |

## Category (정규화, 단순)
| 필드   | 타입                      | 필수 | 예시         | 비고 |
|--------|---------------------------|------|--------------|------|
| id     | string                    | ✅   | "cat_food"   | 고유값 |
| name   | string                    | ✅   | "Food"       | 표시명 |
| type   | 'income' \| 'expense'     | ✅   | "expense"    | 카테고리 성격(필터 최적화) |
| active | boolean                   | ✅   | true         | 비활성 처리용 |

## MonthSummary (파생, 저장 불필요 권장)
| 필드      | 타입    | 필수 | 예시     | 비고 |
|-----------|---------|------|----------|------|
| month     | string  | ✅   | "2025-09"| 키 |
| income    | number  | ✅   | 2300000  | 합계 |
| expense   | number  | ✅   | 820000   | 합계 |
| net       | number  | ✅   | 1480000  | income - expense |

## SyncMeta (로컬스토리지에 최소 보관)
| 필드          | 타입    | 필수 | 예시                       | 비고 |
|---------------|---------|------|----------------------------|------|
| sheetId       | string  | ✅   | "1AbcDEF..."               | 구글 시트 ID |
| lastSyncAt    | string  | ✅   | "2025-09-27T13:00:00Z"     | 마지막 성공 동기화 |
| pendingCount  | number  | ✅   | 2                          | 미반영 트랜잭션 수 |

### 수입/지출, 카테고리, 월 요약 관계
- Transaction.categoryId → Category.id (1:N)
- Transaction.month = date.slice(0,7) (YYYY-MM) (월별 그룹핑 키)
- MonthSummary는 Transactions를 (month, type)으로 그룹·합계하여 계산

### 로컬스토리지 키(동기화 대상 최소화)
- "bk.v1.transactions" : Transaction[]   // 단일 소스(로컬 편집/대기 포함)
- "bk.v1.categories"   : Category[]      // 드물게 변경
- "bk.v1.sync"         : SyncMeta        // 시트 ID/커서

### 동기화 요약(간단 규칙)
- 기준: updatedAt 최신 승(Last-Write-Wins).
- 앱 시작 시: Sheets → 로컬 풀싱크(다운로드) 후 로컬 pending 업서트.
- 오프라인 추가/수정은 로컬에 기록 → 온라인 시 배치 업서트.
- 삭제는 최소화(초기 버전에서는 미지원 또는 active=false로 대체 권장).

-----------------------------------------------------------------------

# 2) Google Sheets 컬럼 설계 예시 (간단/필수 중심)

## 시트: "Transactions"
A:id | B:date | C:month | D:type | E:amount | F:categoryId | G:categoryName | H:memo | I:updatedAt
예시 행:
"txn_2025-09-27_0001","2025-09-27","2025-09","expense",12900,"cat_food","Food","점심","2025-09-27T12:33:00Z"
"txn_2025-09-27_0002","2025-09-27","2025-09","income",2000000,"cat_salary","Salary","","2025-09-27T12:35:10Z"

※ 비고
- C:month를 별도 보관하여 필터·피벗이 쉬움
- G:categoryName는 표시/피벗 편의용(정규화 위반 허용, 변경 시 일괄 업데이트)

## 시트: "Categories"
A:id | B:name | C:type | D:active | E:updatedAt
예시 행:
"cat_food","Food","expense",TRUE,"2025-09-20T09:00:00Z"
"cat_salary","Salary","income",TRUE,"2025-09-20T09:00:00Z"

## 시트: "Meta" (선택)
A:key | B:value
"sheetVersion","1"
"lastSyncAt","2025-09-27T13:00:00Z"

-----------------------------------------------------------------------

# TypeScript 타입 정의(간단/필수)

```typescript
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

```
