# 디지털 굿즈 판매 사이트

## 프로젝트 구조

```
project/
├── database/          # SQLite 데이터베이스 서버 (포트: 5000)
├── ecommerce/         # 상품 구매사이트 (포트: 4000)
└── admin/             # 어드민 사이트 (포트: 4010)
```

## 실행 방법

### 1. 데이터베이스 서버 시작

```bash
cd database
npm install
npm run init    # 데이터베이스 초기화 및 샘플 데이터 생성
npm start       # 서버 시작 (포트: 5000)
```

### 2. 상품 구매사이트 시작

```bash
cd ecommerce
npm run dev     # 개발 서버 시작 (포트: 4000)
```

### 3. 어드민 사이트 시작

```bash
cd admin
npm run dev     # 개발 서버 시작 (포트: 4010)
```

## 접속 URL

- 상품 구매사이트: http://localhost:4000
- 어드민 사이트: http://localhost:4010
- 데이터베이스 API: http://localhost:5000

## 기술 스택

- **Frontend**: Next.js 15, TypeScript, TailwindCSS
- **Payment**: TossPayments 결제위젯 v2
- **Database**: SQLite
- **Backend**: Express.js