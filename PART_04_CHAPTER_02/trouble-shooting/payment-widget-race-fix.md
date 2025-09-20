# Toss 결제 위젯 중복 초기화 문제 해결 가이드

이 문서는 결제 페이지(`src/app/payment/page.tsx`)에서 React 19 개발 모드의 Strict Mode로 인해 발생하는 Toss Payments 위젯 동시 초기화 문제를 해결하는 방법을 정리한 것이다.

## 증상 요약
- 결제 페이지에 진입하면 로딩 스피너가 유지되고, 위젯이 표시되지 않는다.
- 콘솔에는 `AlreadyWidgetRenderedError` 와 "이미 다른 요청을 수행하고 있어요." 로그가 반복된다.
- Strict Mode의 mount → unmount → remount 순환 간에 위젯 초기화와 정리가 서로 경합하여 Toss SDK 내부 상태가 꼬인다.

## 원인
- `useEffect` 가 Strict Mode에서 두 번 실행되는데, 첫 실행 도중 cleanup 이 호출되면서 `abortRef` 가 `true` 로 바뀌고 초기화 로직이 중단된다.
- 이어서 두 번째 실행에서 `initializingRef.current === true` 인 상태로 guard 에 걸려 초기화가 진행되지 않아 위젯이 렌더되지 않는다.
- 초기화와 cleanup 을 기다리지 않고 서로 race condition 상태로 호출하면서 Toss SDK 내부에서는 이전 요청이 완료되지 않은 것으로 판단한다.

## 해결 전략
1. **초기화 Promise 공유하기**
   - `initializingRef` 대신 `initPromiseRef` 를 두고, 각 `initializePayment` 호출이 해당 Promise 를 반환하도록 만든다.
   - Strict Mode 두 번째 호출 시에는 기존 Promise 가 완료될 때까지 `await initPromiseRef.current` 로 대기하게 한다.

2. **Cleanup 을 명시적으로 대기**
   - `useEffect` 의 반환값에서 비동기 `cleanup` 함수를 만들고, `await` 하여 위젯 정리가 끝난 후에만 새로운 초기화가 진행되도록 한다.
   - `widgetsRef.current?.cleanup()` 도 Promise 체인을 반환하므로 기다렸다가 ref 를 `null` 로 재설정한다.

3. **취소 토큰 도입**
   - `abortRef` 대신 `initTokenRef` 에 `Symbol()` 같은 고유 토큰을 저장한다.
   - `initializePayment` 시작 시 토큰을 생성하여 로컬 변수에 담고, 각 `await` 이후 토큰이 여전히 동일한지 검사한다. 토큰이 바뀌었으면 즉시 함수를 종료해 중단 이후의 setState 나 SDK 호출을 막는다.

4. **에러/종료 경로 보완**
   - `catch` 와 `finally` 구문에서도 토큰 검사를 수행하고, 토큰이 유효한 경우에만 `setLoading(false)` 및 navigation 을 수행한다.
   - cleanup 실패에도 `initPromiseRef` 를 `null` 로 돌려서 다음 초기화를 막지 않는다.

## 구현 순서
1. `PaymentPage` 컴포넌트 상단에 `initPromiseRef` 와 `initTokenRef` 를 추가한다.
2. `initializePayment` 를 `async function initializePayment(...)` 대신 `const initializePayment = (data) => { ... }` 형태로 수정하여 토큰과 Promise 를 관리한다.
3. `useEffect` 내부에서 `const init = initializePayment(parsedData); initPromiseRef.current = init;` 형태로 호출하고, cleanup 에서는 `await initPromiseRef.current` 이후 `await cleanupWidgets()` 를 수행한다.
4. 각 Toss SDK 호출(`loadTossPayments`, `setAmount`, `renderPaymentMethods`, `renderAgreement`, `requestPayment`) 사이에 토큰 검사를 추가한다.
5. 모든 setState 호출 전에도 동일한 토큰 검사를 넣어 언마운트 후 경고를 방지한다.

## 검증 체크리스트
- [ ] `npm run dev -- --hostname 127.0.0.1` 를 실행 후 `/checkout → /payment` 흐름에서 위젯이 정상적으로 한 번만 렌더링되는지 확인.
- [ ] 페이지 새로고침을 반복해도 `AlreadyWidgetRenderedError` 나 "이미 다른 요청을 수행하고 있어요." 메시지가 나타나지 않는지 확인.
- [ ] `결제하기` 버튼 클릭 시 Toss 결제 모달이 정상적으로 뜨는지 확인.
- [ ] 장바구니/헤더 등 다른 API 요청에서 Strict Mode 로 인한 오류 로그가 없는지 확인.

## 추가 참고
- Toss 공식 문서: https://docs.tosspayments.com/payments/widget/v2
- React 19 Strict Mode 동작: https://react.dev/reference/react/StrictMode
