# 서버 사이드 fetch에서 ERR_INVALID_URL이 발생할 때

## 증상
- Next.js API 라우트나 Node.js 서버 코드에서 `fetch('/api/...')` 호출 직후 아래와 같은 에러가 발생한다.
  - `TypeError: Failed to parse URL`
  - `ERR_INVALID_URL`
- 프런트엔드에서 동일한 경로를 호출하면 정상 동작하지만, 서버 사이드에서는 즉시 실패한다.

## 원인
- 브라우저 환경과 달리 서버 런타임에는 기본 도메인(`window.location.origin`)이 없다.
- 절대 경로가 아닌 `/api/...` 형태의 상대 경로를 `fetch`에 전달하면 WHATWG URL 파서는 기준 호스트를 찾을 수 없어 오류를 던진다.

## 해결 방법
1. **요청 베이스 URL 확보**
   - 프록시/클라이언트에서 전달한 `Origin` 헤더나 Next.js의 경우 `request.nextUrl.origin`을 사용한다.
   - 배포 환경이라면 환경 변수(예: `APP_URL`, `NEXT_PUBLIC_APP_URL`)를 우선 사용하고, 없을 때만 요청 정보를 fallback 으로 사용한다.

2. **절대 URL 생성**
   - `new URL(path, baseUrl)` 패턴으로 항상 절대 URL을 만든다.

   ```ts
   const baseUrl = process.env.APP_URL ?? request.nextUrl.origin;
   const ordersUrl = new URL(`/api/orders/${orderId}`, baseUrl);
   const response = await fetch(ordersUrl);
   ```

3. **쿠키/헤더 전파**
   - 인증이 필요한 엔드포인트라면, 프런트엔드에서 전달되던 쿠키나 헤더를 그대로 넘겨줘야 동일한 권한으로 처리된다.

   ```ts
   await fetch(ordersUrl, {
     headers: {
       Cookie: request.headers.get('cookie') ?? '',
     },
   });
   ```

## 검증 체크리스트
- 수정 후 동일한 API 호출을 다시 실행해 `ERR_INVALID_URL`이 더 이상 발생하지 않는지 확인한다.
- 반환 값이 기대와 일치하는지 통합 테스트나 Playwright 시나리오로 검증한다.

## 예방 팁
- 서버 코드에서는 절대 URL만 사용한다는 코딩 규약을 두고 lint rule을 추가한다.
- 테스트 환경에서 `fetch('/api/...')` 호출을 자동으로 실패시키는 모킹 로직을 두면 상대 경로 사용을 조기에 발견할 수 있다.
