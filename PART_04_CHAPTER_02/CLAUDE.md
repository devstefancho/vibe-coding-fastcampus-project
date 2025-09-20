## 로컬 개발용 서버 설정
- 상품 구매사이트 : localhost:4000 사용
- 어드민 사이트 : localhost:4010 사용

## 상세구현 내용

### 상품 구매사이트
- 디지털 굿즈를 판매하는 사이트를 만든다.
- 로그인 및 회원가입은 이메일/비밀번호 형식으로 한다.
- 굿즈는 이미지이며 구매시에 고화질 이미지를 다운로드 받을 수 있다.
- 샘플로 사용할 이미지는 svg로 단순한 만화 캐릭터들을 만들어줘.
- 굿즈의 가격은 1000원부터 5000원까지 다양하다. 굿즈의 총 개수는 10개이다.
- 홈에서는 굿즈를 카드형태의 목록으로 표시하고 장바구니에 담을 수 있다.
- 장바구니에 담은 상품은 장바구니페이지로 가서 구매할 수 있다.
- 결제하기 버튼을 클릭하면 배송지 입력을 받는 입력화면이 나오고, 기본정보는 아래값으로 넣어준다.
    - 배송지 기본정보
        - 이름: 조성진
        - 이메일: skku7714@gmail.com
        - 전화번호: 010-1234-5678
        - 주소: 서울시 강남구

- 결제는 토스페이먼츠 결제위젯 v2를 사용한다.
- 결제 완료시에 내가 결제한 항목을 내 결제 페이지에서 볼 수 있다.
- UI는 라이트 Theme만 개발한다. (다크 Theme은 사용하지 않음)

### 어드민 사이트

관리자가 결제한 사람들의 모든 결제정보를 한눈에 볼 수 있다.
데이터는 10초마다 자동 Refresh 된다.


## 기술

- 상품 구매사이트
    - nextjs, typescript, tailwindcss
    - tosspayments 결제위젯 v2: @tosspayments/tosspayments-sdk 패키지를 직접 설치하여 사용

- 어드민 사이트
    - nextjs, typescript, tailwindcss

- database 서버
    - sqlite


## 토스페이먼츠 결제위젯용 테스트 Key 사용

```
TOSS_WIDGET_CLIENT_KEY="test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm"
TOSS_WIDGET_SECRET_KEY="test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6"
```

## 참고문서

- https://docs.tosspayments.com/llms.txt
- 결제구현: @tosspayments-sample/


## 토스페이먼츠 MCP 서버

```json
{
  "mcpServers": {
    "tosspayments-integration-guide": {
      "command": "npx",
      "args": ["-y", "@tosspayments/integration-guide-mcp@latest"]
    }
  }
}
```
