# 디지털 굿즈 판매 사이트 바이브 코딩

## 목적

- 상품 구매사이트와 어드민 사이트를 분리하여 개발한다.
- 상품 구매사이트에서 토스페이먼츠 결제위젯을 연동하여 결제시스템을 개발한다.
- 어드민 페이지에서는 모든 결제 내용을 확인할 수 있다.


## 프로젝트 메모리에 기본정보 세팅하기

- CLAUDE.md 확인하기



## 토스 페이먼츠 MCP와 llms.txt 관련

- MCP는 초기 구현시 잘못된 정보를 조회하는 경우가 종종 발생하였음, 예를들어 결제위젯인데 브랜드페이 내용을 가져온다거나 하는 문제가 발생했음
- MCP로 할 때 잘되었던건 결제위젯 v1을 v2로 마이그레이션 하는건 잘되었음
- llms.txt는 ai에게 줘도 괜찮은 문서라고 생각됨


## 현재 디렉토리 구조 및 파일 역할

### 루트 레벨 파일들
- **CLAUDE.md** - Claude Code AI를 위한 프로젝트 지침서 (기술스택, 구현내용, 테스트키 등)
- **note.md** - 프로젝트 메모 및 가이드 문서 (현재 파일)
- **.mcp.json** - MCP 서버 설정 (토스페이먼츠 통합 가이드) **tosspayments.mov** - 토스페이먼츠 모바일 결제 과정 동영상 자료

### `/project/` 메인 프로젝트 예시 구조

```
project/
├── admin/                    # 어드민 사이트 (localhost:4010)
│   ├── package.json         # Next.js, TypeScript, TailwindCSS
│   ├── next.config.ts       # Next.js 설정
│   ├── src/
│   │   ├── app/             # Next.js App Router 페이지
│   │   └── lib/             # 유틸리티 및 라이브러리
│   └── public/              # 정적 파일들
│
├── database/                # 데이터베이스 서버
│   ├── database.js          # SQLite 데이터베이스 관리
│   ├── schema.sql           # 데이터베이스 스키마
│   ├── store.db             # SQLite 데이터베이스 파일
│   └── package.json         # 데이터베이스 서버 의존성
│
└── ecommerce/               # 상품 구매사이트 (localhost:4000)
    ├── package.json         # Next.js, TypeScript, TailwindCSS, @tosspayments/tosspayments-sdk
    ├── next.config.ts       # Next.js 설정
    ├── src/
    │   ├── app/             # Next.js App Router 페이지
    │   ├── components/      # React 컴포넌트
    │   └── lib/             # 유틸리티 및 라이브러리
    ├── public/
    │   └── images/          # 상품 이미지 (SVG 캐릭터들)
    ├── docs/                # 프로젝트 문서
    └── trouble-shooting/    # 문제 해결 가이드
```

### 기타 디렉토리

#### `/tosspayments-sample/` - 토스페이먼츠 참고용 데모
- Express.js 기반 결제 시스템 샘플 코드
- 포트: localhost:3000

#### `/trouble-shooting/` - 문제 해결 가이드 모음
- 결제 위젯 관련 이슈 해결 방법들
- CORS, API 호출 문제 등

#### `/sample-images` - 프로젝트 샘플용 이미지
- 디지털 굿즈 서비스 테스트용 svg 이미지


## Prompt 예시

1. 초기 세팅

```
> @CLAUDE.md를 참고하여 project 디렉토리 아래에 디지털 굿즈 판매사이트와 어드민 사이트의 기본 구조를 만들자.
```

2. 구현완료후 Plan Mode에서 남은 구현 물어보기

```
> 이제 구현해야하는게 뭐가 남았는가?

ex)
  ⎿  ☐ 데이터베이스 초기화 및 테스트
     ☐ SVG 캐릭터 이미지 10개 생성
     ☐ 상품 구매사이트 기본 페이지 구조 생성
     ☐ 로그인/회원가입 페이지 및 기능 구현
     ☐ 상품 목록 홈페이지 (카드형 레이아웃)
     ☐ 장바구니 페이지 및 기능
     ☐ 배송지 입력 페이지
     ☐ 토스페이먼츠 결제위젯 v2 연동
     ☐ 내 결제내역 페이지
     ☐ 어드민 사이트 대시보드 (10초 자동 새로고침)
```

3. 남은 항목들 순차적으로 구현진행 시키기

```
> 구현 진행 해줘
```

4. 결제 구현 관련 문제 발생시

```
> 결제 위젯 초기화 에러가 발생했다. 이 문제를 해결하자.
결제구현은 @tosspayments-sample/ 을 참고하면 된다. @trouble-shooting/ 문서들을 참고해서 진행해줘

> @project/ecommerce/ 에서 결제에 실패했다 @trouble-shooting/toss-payments-v2-guide.md 내용을 참고해서 수정을 진행해줘
> @payment-widget-race-fix.md 문서를 참고해서 현재 발생하는 문제를 해결해줘
```


