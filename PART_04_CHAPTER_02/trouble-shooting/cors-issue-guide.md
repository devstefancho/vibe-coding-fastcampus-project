# 교차 출처 API 호출(CORS) 대응 가이드

## 1. 증상
- 프론트엔드 대시보드가 API 응답을 받지 못하고 로딩 상태가 지속됩니다.
- 브라우저 콘솔/네트워크 탭에 `Failed to fetch`, `No 'Access-Control-Allow-Origin' header` 등 CORS 관련 오류가 나타납니다.

## 2. 원인 개요
- 브라우저는 다른 출처(도메인·포트·프로토콜)에서 오는 요청에 대해 서버가 명시적으로 허용하지 않으면 응답을 차단합니다.
- 서버가 `Access-Control-Allow-*` 헤더를 반환하지 않거나, 프리플라이트(OPTIONS) 요청을 처리하지 않으면 이 문제가 발생합니다.

## 3. 해결 전략
1. 서버 응답에 허용할 오리진(origin)과 메서드, 헤더 정보를 포함한 CORS 헤더를 추가합니다.
2. 브라우저가 보내는 OPTIONS 프리플라이트 요청을 정상적으로 응답(주로 204)하도록 핸들러를 구현합니다.
3. 허용할 오리진을 환경 변수나 설정 파일로 관리해 환경별로 손쉽게 조정합니다.

## 4. 구현 예시 (Next.js / Edge & Node 런타임 공용 패턴)

```ts
// 환경 변수 또는 설정으로 허용할 오리진을 관리합니다.
const ALLOWED_ORIGIN = process.env.ADMIN_DASHBOARD_ORIGIN ?? 'http://localhost:4010';

const withCors = (response: NextResponse) => {
  response.headers.set('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  return response;
};

export async function OPTIONS() {
  // 프리플라이트 요청은 보통 빈 본문 + 204 상태로 응답합니다.
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  // 기존 비즈니스 로직을 실행합니다.
  const data = await fetchDataFromDatabase();
  return withCors(NextResponse.json({ success: true, data }));
}

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await saveData(payload);
  return withCors(NextResponse.json({ success: true, result }, { status: 201 }));
}
```

> **Tip:** 허용할 오리진을 배열로 두고, `request.headers.get('origin')`을 검사한 뒤 조건에 맞을 때만 허용하는 방식으로 확장할 수 있습니다.

## 5. 환경 변수 권장사항
- `ALLOWED_ORIGIN` 또는 유사한 이름으로 허용할 프론트엔드 주소를 설정하십시오.
- 개발/스테이징/프로덕션 등 환경별로 값을 분리해 관리하면 배포 시 실수를 줄일 수 있습니다.

```
ALLOWED_ORIGIN=https://admin.example.com
```

변경 후에는 서버를 재시작해야 새 값이 반영됩니다.

## 6. 검증 체크리스트
1. 프론트엔드에서 페이지를 새로고침하고 네트워크 탭을 확인합니다.
2. API 요청이 200/201 등 정상 응답을 받고, 응답 헤더에 `Access-Control-Allow-Origin`이 기대한 값으로 설정되어 있는지 확인합니다.
3. 브라우저 콘솔에서 CORS 관련 오류가 더 이상 출력되지 않는지 확인합니다.

## 7. 추가 고려사항
- 여러 오리진이 접근해야 한다면, 허용 리스트를 만들어 요청의 `origin` 헤더를 검사한 뒤 조건부로 허용하세요.
- 보안 강화를 위해 와일드카드(`*`) 사용은 최소화하고, 필요한 오리진만 열어두는 것을 권장합니다.
- 서버 사이드에서 직접 호출하는 내부 API는 CORS가 필요 없으므로 클라이언트 측에서 실행되는 코드만 대상에 포함합니다.
