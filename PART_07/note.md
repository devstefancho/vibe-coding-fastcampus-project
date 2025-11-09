## 쿠팡 파트너스 링크 데이터 베이스 만들기

1. https://partners.coupang.com/ 페이지 열기
2. 회원가입
3. 홈에서 수익 리포트 확인가능
4. 링크 생성 > 상품 링크
5. 상품 검색하여 링크 생성하기


## Prompt

### 1. Supabase에 데이터 저장하기
```
Datasource(./product-link-list.txt) 를 아래 형식의 데이터 칼럼으로 저장한다.

- href
- img_src
- alt
```

### 2. 상품 웹페이지 만들기

#### 기술 스택
```
- 빌드 도구: Vite
- 프레임워크: React 18 + TypeScript
- 라우팅: React Router v6
- 데이터베이스: Supabase JS Client
- 스타일링: CSS (CSS Variables 사용)
```

#### 디자인 가이드라인
```
색상 체계:
- Primary Color: #2c3e50 (다크 블루) - 제목, 강조
- Secondary Color: #e67e22 (오렌지) - 버튼, 강조
- Accent Color: #3498db (라이트 블루) - 부제목
- Background: #ecf0f1 (라이트 그레이)
- Text Color: #34495e (다크 그레이)

타이포그래피:
- 제목 (h1, h2): Georgia, serif, 1.5-3rem
- 본문: -apple-system, sans-serif, 1.1rem
- 라인 높이: 1.6-1.8

반응형 설계:
- 모바일: < 768px (1 컬럼)
- 태블릿: 768px - 1024px (2 컬럼)
- 데스크톱: > 1024px (3 컬럼)
```

#### 상품 배치 방법
```
각 블로그 포스트별 상품 삽입 규칙:

1. 상품 개수: 포스트당 2-3개
2. 배치 위치:
   - 본문 중간에 자연스럽게 배치
   - 각 섹션 또는 포인트마다 1개씩
3. 레이아웃: 그리드 카드 형식
   - 너비: 120px (고정)
   - 높이: 240px (고정)
   - 갭: 1.5rem
   - 텍스트: 상품명/설명 (0.85rem, 센터 정렬)

4. HTML 구조:
<a href="{product.href}" target="_blank" referrerpolicy="unsafe-url">
  <img src="{product.img_src}" alt="{product.alt}" referrerpolicy="unsafe-url" />
  <p>{product.alt}</p>
</a>
```

#### 콘텐츠 요구사항
```
웹사이트명: 노트의 미학
목적: 노트를 잘 써야 하는 이유 설명

블로그 포스트: 3개
- 각 포스트 800-1000자
- 과학적 근거/연구 결과 포함
- 톤: 전문적이면서도 친근하게

포스트 주제:
1. "필기는 뇌를 깨운다" - 핸드라이팅의 인지과학
2. "더 오래 기억하다" - 기억력 보유와 학습 효과
3. "창의력의 공간" - 창의적 사고와 문제해결

각 포스트에 Supabase의 쿠팡 광고 이미지 2-3개 삽입
```

### 3. 주의사항 기입하기

```
게시글 작성 시, 아래 문구를 반드시 기재해 주세요.
"이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다."
```

## Vercel에 배포하기

1. https://vercel.com/ 에 회원가입
2. 터미널에서 `npm install -g vercel`로 vercel 설치
3. 터미널에서 `vercel login`으로 로그인
4. claude code에게 vercel 에 배포해달라고 요청
5. 배포된 사이트 https://vercel.com/ 에서 확인하기


## 웹사이트 완성 체크사항

- [ ] 내 정보(https://partners.coupang.com/#affiliate/profile) 페이지에서 사이트 URL, 스크린샷 등록

