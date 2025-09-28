# SQLite → Supabase 마이그레이션 가이드

이 가이드는 프로젝트를 SQLite에서 Supabase (PostgreSQL)로 마이그레이션하는 과정을 설명합니다.

## 🚀 빠른 시작

### 1. Supabase 프로젝트 설정

1. [supabase.com](https://supabase.com)에서 계정 생성
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - **Name**: mbti-movie-recommender
   - **Database Password**: 안전한 비밀번호 설정 (저장해두세요!)
   - **Region**: 가장 가까운 지역 선택
4. 프로젝트 생성 완료 (약 2분 소요)

### 2. 데이터베이스 연결 정보 가져오기

1. Supabase Dashboard 상단 헤더에서 **"Connect"** 버튼 클릭
   - 버튼 위치: 프로젝트 이름 오른쪽, 사용자 아바타 왼쪽
   - Connect 버튼이 회색으로 표시되어 있음

2. "Connect to your project" 다이얼로그에서 **"Connection String"** 탭 선택

3. 필요한 연결 정보 복사:
   - **Direct connection**: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   - **Transaction pooler**: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`
   - **Session pooler**: `postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`

4. **권장 설정**:
   - **DATABASE_URL**: Session Pooler 또는 Transaction Pooler 사용
   - **DIRECT_URL**: Session Pooler 사용 (IPv4 호환성 위해)

### 3. 환경 변수 설정

1. `.env.example` 파일을 참고하여 `.env` 파일 업데이트:

```bash
# Supabase 연결 정보 (Session Pooler 사용 권장)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

# 선택사항: Supabase API 키 (향후 기능 확장용)
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# 기존 TMDB 설정 유지
NEXT_PUBLIC_TMDB_API_KEY=b7b095c804a15e4923eb7ae9845c1cd9
NEXT_PUBLIC_TMDB_BASE_URL=https://api.themoviedb.org/3
NEXT_PUBLIC_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p
```

### 4. 마이그레이션 실행

#### 4-1. Prisma 클라이언트 재생성
```bash
npx prisma generate
```

#### 4-2. 데이터베이스 스키마 마이그레이션
```bash
npx prisma db push
```

#### 4-3. 데이터 마이그레이션
```bash
npx tsx scripts/import-to-supabase.ts
```

### 5. 마이그레이션 확인

```bash
npm run dev
```

브라우저에서 애플리케이션에 접속하여 다음 기능들이 정상 작동하는지 확인:
- 🎬 영화 목록 표시
- 🧠 MBTI 추천 시스템
- 🔍 영화 검색 및 필터링

## 📂 변경된 파일들

### 생성된 파일
- `lib/supabase.ts` - Supabase 클라이언트 설정
- `scripts/export-sqlite-data.ts` - SQLite 데이터 export
- `scripts/import-to-supabase.ts` - Supabase 데이터 import
- `.env.example` - 환경 변수 템플릿
- `data-export.json` - 백업된 SQLite 데이터

### 수정된 파일
- `prisma/schema.prisma` - PostgreSQL 설정으로 변경
- `package.json` - @supabase/supabase-js 패키지 추가

## 🔧 문제 해결

### 연결 오류
```
Error: P1001: Can't reach database server
```
**해결 방법:**
1. **Session Pooler 사용**: Direct connection 대신 Session Pooler URL 사용
   ```bash
   # ✅ 권장 (Session Pooler)
   DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres"

   # ❌ 연결 실패할 수 있음 (Direct)
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
   ```
2. 환경 변수의 DATABASE_URL과 DIRECT_URL이 올바른지 확인
3. Supabase 프로젝트가 활성화되어 있는지 확인
4. 비밀번호에 특수문자가 있으면 URL 인코딩 필요

### 마이그레이션 오류
```
Error: Table already exists
```
- Supabase Dashboard → SQL Editor에서 기존 테이블 삭제 후 재시도:
```sql
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```

### 데이터 import 오류
- `data-export.json` 파일이 존재하는지 확인
- export 스크립트를 먼저 실행했는지 확인

## 🎯 다음 단계

마이그레이션 완료 후 다음과 같은 Supabase 기능들을 활용할 수 있습니다:

1. **실시간 기능**: 영화 평점 실시간 업데이트
2. **사용자 인증**: Supabase Auth로 사용자 관리
3. **파일 스토리지**: 영화 포스터 직접 업로드
4. **Row Level Security**: 데이터 보안 강화

## 📞 지원

마이그레이션 중 문제가 발생하면:
1. 이 가이드의 문제 해결 섹션 참고
2. [Supabase 공식 문서](https://supabase.com/docs) 확인
3. [Prisma 문서](https://www.prisma.io/docs) 참고