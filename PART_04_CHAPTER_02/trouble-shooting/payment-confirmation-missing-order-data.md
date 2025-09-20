# 결제 확인 이후 주문이 저장되지 않을 때

## 증상
- 결제 위젯은 성공으로 끝났지만 주문 내역 페이지에는 아무 데이터도 남지 않는다.
- 결제 확인 API(`/payment/confirm` 등) 로그에는 오류가 없거나, "Order data not found" 같은 메시지가 기록된다.

## 원인
- 결제 성공 후 서버가 주문 데이터를 저장하려면 기본 고객 정보와 장바구니 스냅샷이 필요하다.
- 클라이언트에서 결제 확인 API를 호출할 때 해당 데이터를 보내지 않거나, 서버가 임시 저장소에서 가져오지 못하면 주문 저장 단계가 건너뛰어진다.

## 해결 방법
1. **클라이언트에서 주문 스냅샷 전송**
   - 결제 성공 페이지에서 로컬 캐시(예: `localStorage`)나 상태 관리 스토어에 저장했던 주문 정보를 읽어온다.
   - 결제 확인 요청 본문에 `customerInfo`, `cartItems`, `amount` 등을 함께 실어 보낸다.

   ```ts
   const snapshot = JSON.parse(localStorage.getItem('orderData') ?? 'null');
   await fetch('/api/payment/confirm', {
     method: 'POST',
     body: JSON.stringify({ paymentKey, orderId, amount, orderData: snapshot }),
   });
   ```

2. **서버에서 데이터 검증 및 fallback**
   - 요청 본문에 포함된 `orderData`가 유효한지 타입 검사를 수행한다.
   - 누락된 경우를 대비해, 세션/DB/임시 스토리지 등 다른 보관처에서 동일한 `orderId`를 조회하는 로직을 둔다.
   - 검증된 데이터를 기반으로 주문 저장 로직을 호출하고, 부족하다면 명시적으로 400 에러를 반환하여 문제를 조기에 인지한다.

   ```ts
   if (!isValidSnapshot(body.orderData)) {
     return NextResponse.json({ error: 'Order data not found' }, { status: 400 });
   }
   await saveOrder(body.orderData);
   ```

3. **저장 성공 후 후속 처리**
   - 저장이 끝났다면 클라이언트 캐시된 주문 데이터를 즉시 제거하고, 주문 내역 페이지로 리다이렉트하거나 성공 메시지를 표시한다.

## 검증 체크리스트
- 결제 성공 → 확인 → 주문 내역 흐름을 수동 혹은 E2E 테스트로 수행해 주문이 정확히 기록되는지 확인한다.
- 비정상 데이터(누락/형식 오류)를 보내 테스트했을 때 400 오류가 발생하고 로그에 원인이 남는지 확인한다.

## 예방 팁
- 결제 시작 시점에 주문 스냅샷을 별도의 안전한 저장소(예: Redis, DB)에도 저장해 두면 브라우저 캐시 손실에 대비할 수 있다.
- 서버에서 주문 저장에 필요한 필드를 모두 검사하는 타입 가드나 Zod 스키마를 사용해 조기 검증을 자동화한다.
