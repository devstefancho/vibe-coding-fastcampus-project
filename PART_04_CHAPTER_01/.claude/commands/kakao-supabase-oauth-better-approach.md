---
allowed-tools: mcp__playwright
description: Create a kakao login feature
argument-hint: [new-app-name]
---

# 카카오 로그인 + Supabase OAuth 연동 (자동 검증)

이 커맨드는 Kakao OAuth와 Supabase를 연동하여 카카오 로그인 기능을 구현합니다.

**✨ 특징**:
- Agent가 각 단계를 자동으로 검증
- 사용자는 필요한 경우에만 입력
- 문제 발견 시 스크린샷과 함께 정확한 해결 방법 제시

**⚠️ 중요**: Supabase Kakao OAuth는 비즈앱 전환이 필수입니다.
- 이유: Supabase가 `account_email` scope를 자동으로 요구하며, 이는 비즈앱에서만 사용 가능

---

## Phase 0: Pre-flight Checks

### 1. Playwright MCP 확인
Playwright MCP가 설치되어 있는지 확인합니다.
- 미설치 시: 설치 방법 안내

### 2. 로그인 상태 확인
다음 사이트에 로그인이 필요합니다:
- **Kakao Developers**: https://developers.kakao.com
- **Supabase**: https://supabase.com

Playwright로 두 사이트를 열고, 로그인 페이지가 나타나면 사용자에게 로그인을 요청합니다.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
로그인 필요
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kakao Developers와 Supabase에 로그인해주세요.
로그인이 완료되면 "완료" 또는 "확인"을 입력해주세요.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. 비즈앱 전환 안내

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 중요: 비즈앱 전환 필수
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Supabase Kakao OAuth를 사용하려면 비즈앱 전환이 필수입니다.

이유:
- Supabase는 account_email scope를 자동으로 요구
- Kakao에서 account_email은 비즈앱만 사용 가능

준비되셨으면 "준비완료" 또는 "계속"을 입력해주세요.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⚠️ 사용자가 준비 완료를 확인할 때까지 다음 단계로 진행하지 마세요.**

---

## Phase 1: Supabase Project Setup

**목적**: Redirect URI 획득 (Kakao 설정에 필요)

### 1. 새 프로젝트 생성
Playwright로 https://supabase.com/dashboard/projects 이동

새 프로젝트를 생성합니다:
- 프로젝트명: `$1` (인자로 받은 앱 이름)
- Region: 사용자에게 선택 요청
- Database Password: 사용자에게 입력 요청

### 2. 핵심 정보 수집

다음 정보를 수집합니다:

**A. Project URL**
- 위치: Project Settings > General > Project URL
- 형식: `https://xxxxx.supabase.co`

**B. Anon Key**
- 위치: Project Settings > API > Project API keys > anon public
- 형식: `eyJhbGc...`

**C. Redirect URI** (자동 생성)
- 형식: `{Project URL}/auth/v1/callback`
- 예: `https://xxxxx.supabase.co/auth/v1/callback`

### 3. Agent 자동 검증

Playwright snapshot으로 다음을 확인:
- ✅ Project URL이 올바른 형식인지
- ✅ Anon Key가 수집되었는지
- ✅ Redirect URI가 생성되었는지

검증 실패 시:
- ❌ 스크린샷 첨부
- ❌ 문제점 설명
- ❌ 해결 방법 제시
- ⏸️ 사용자 수정 대기

검증 성공 시:
- ✅ 수집된 정보 요약 표시
- ✅ 자동으로 다음 Phase 진행

```
✅ Phase 1 완료

수집된 정보:
- Project URL: https://xxxxx.supabase.co
- Anon Key: eyJhbGc... (앞 20자)
- Redirect URI: https://xxxxx.supabase.co/auth/v1/callback

다음 단계에서 이 Redirect URI를 Kakao에 등록합니다.
자동으로 Phase 2로 진행합니다...
```

---

## Phase 2: Kakao App Basic Setup

**목적**: 기본 앱 생성 및 필수 정보 등록

### 1. Kakao 앱 생성

Playwright로 https://developers.kakao.com/console/app 이동
- "애플리케이션 추가하기" 클릭
- 앱 이름: `$1` 입력
- 저장

### 2. 앱 아이콘 등록 (필수)

⚠️ **비즈앱 전환을 위해 필수**

경로: `내 애플리케이션 > 앱 설정 > 앱 > 일반`

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
앱 아이콘 등록
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

비즈앱 전환을 위해 앱 아이콘 등록이 필요합니다.

요구사항:
- 크기: 128x128px 권장
- 용량: 250KB 이하

Playwright로 앱 아이콘 업로드 페이지를 열어드렸습니다.
아이콘을 업로드해주세요.

업로드가 완료되면 "완료"를 입력해주세요.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⏸️ 사용자 입력 대기**

### 3. 회사명 입력 (필수)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
회사명을 입력해주세요.

예시:
- "개인 개발자"
- "홍길동 개발"
- 실제 회사명

회사명: _______________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⏸️ 사용자 입력 대기**

### 4. 카테고리 선택 (필수)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
서비스 카테고리를 선택해주세요.

추천: "개발자테스트"

카테고리 목록을 보여드릴까요? (예/아니오)
또는 원하시는 카테고리를 직접 말씀해주세요.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**⏸️ 사용자 입력 대기**

### 5. REST API Key 수집

경로: `내 애플리케이션 > 앱 설정 > 앱 > 일반 > 앱 키`

Playwright로 "REST API 키" 복사

### 6. Agent 자동 검증

Playwright snapshot으로 다음을 확인:
- ✅ 앱 아이콘이 등록되었는지
- ✅ 회사명이 입력되었는지
- ✅ 카테고리가 선택되었는지
- ✅ REST API 키가 수집되었는지

검증 실패 시:
- ❌ 스크린샷 + 누락된 항목 표시
- ⏸️ 사용자 수정 요청

검증 성공 시:
- ✅ "Phase 2 완료. REST API 키: 6f7c0c... (앞 15자)"
- ✅ 자동으로 다음 Phase 진행

---

## Phase 3: Business App Conversion (필수)

**⚠️ 이 단계는 필수입니다**

이유: Supabase가 `account_email` scope를 요구하며, 이는 비즈앱에서만 사용 가능

### 1. 비즈앱 전환 시작

경로: `내 애플리케이션 > 앱 설정 > 앱 > 일반 > 비즈니스 정보`

Playwright로 페이지 이동

### 2. Agent 검증: "개인 개발자 비즈 앱 전환" 버튼 확인

Playwright snapshot으로 버튼 존재 확인:

- ✅ 버튼이 있으면: 클릭
- ❌ 버튼이 없으면:
  - 원인: 앱 아이콘 미등록
  - 해결: Phase 2로 돌아가서 아이콘 등록

### 3. 비즈 앱 전환 목적 선택

모달 창이 열리면:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ 매우 중요: 비즈 앱 전환 목적 선택
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"비즈 앱 전환 목적" 드롭다운이 보입니다.
반드시 "이메일 필수 동의"를 선택해야 합니다.

Playwright로 자동 선택을 시도하겠습니다...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Playwright로 "이메일 필수 동의" 선택

### 4. 약관 동의 및 전환 완료

Playwright로:
- 카카오 비즈니스 통합 서비스 약관 체크
- "전환" 또는 "저장" 버튼 클릭

### 5. Agent 자동 검증: 비즈앱 전환 완료 확인

Playwright snapshot으로 확인:
- ✅ "비즈 앱" 배지가 표시되는지
- ✅ "이메일 필수 동의" 상태인지

검증 실패 시:
- ❌ 스크린샷 + 문제 설명
- ❌ 가능한 원인:
  - 전환 목적을 잘못 선택
  - 약관 미동의
- ⏸️ 사용자 확인 요청

검증 성공 시:
- ✅ "비즈앱 전환 완료! 이제 account_email을 사용할 수 있습니다."
- ✅ 자동으로 다음 Phase 진행

---

## Phase 4: Kakao Login Configuration

**목적**: Kakao Login 활성화, Client Secret, Redirect URI 설정

경로: `내 애플리케이션 > 제품 설정 > 카카오 로그인 > 일반`

⚠️ **중요**: 이 Phase의 모든 설정은 한 페이지에서 진행됩니다!

### 1. 카카오 로그인 활성화

Playwright로:
- 페이지 상단 "상태" 토글 클릭 (ON으로 변경)

### 2. Redirect URI 등록

Playwright로:
- "리다이렉트 URI" 섹션 찾기
- Phase 1에서 수집한 Supabase Redirect URI 입력
- "추가" 또는 "저장" 버튼 클릭

### 3. Client Secret 생성 및 활성화

**A. Secret 생성**

Playwright로:
- "Client Secret" 섹션 찾기
- "코드 생성" 버튼 클릭 (이미 있으면 스킵)
- 생성된 코드 복사 저장

**B. 활성화** (⚠️ 가장 중요!)

Playwright로:
- "상태" 드롭다운 또는 "설정" 버튼 찾기
- "사용함"으로 변경 또는 "설정" 클릭
- 저장

### 4. OpenID Connect 활성화 (권장)

Playwright로:
- "OpenID Connect" 섹션 찾기
- 상태 토글 ON

### 5. Agent 자동 검증 (Critical!)

Playwright snapshot으로 다음을 확인:

```
검증 항목:
1. 카카오 로그인 "상태" 토글 = ON (파란색)
2. 리다이렉트 URI에 Supabase URL 등록됨
3. Client Secret 코드가 존재함
4. ⚠️⚠️ Client Secret "상태" = "사용함" ⚠️⚠️
```

**Critical 검증: Client Secret 활성화 상태**

페이지를 새로고침한 후 다시 확인:
- Playwright로 페이지 새로고침
- Snapshot으로 Client Secret "상태" 재확인

검증 실패 시 (특히 Client Secret "사용 안 함"):
```
❌ Critical 에러 발견!

[스크린샷 첨부]

문제: Client Secret이 "사용 안 함" 상태입니다.
위치: 제품 설정 > 카카오 로그인 > 일반 > Client Secret

해결 방법:
1. 화면에서 "Client Secret" 섹션을 찾으세요
2. "상태" 또는 "설정" 버튼을 클릭하세요
3. "사용함"으로 변경하세요
4. 저장하세요

⚠️ 이 설정이 없으면 로그인이 100% 실패합니다!

수정하셨으면 "완료"를 입력해주세요.
```

**⏸️ 사용자 수정 대기**

검증 성공 시:
```
✅ Phase 4 완료

설정 확인:
✅ 카카오 로그인 활성화: ON
✅ Redirect URI: https://xxxxx.supabase.co/auth/v1/callback
✅ Client Secret: VHf6hn... (앞 10자)
✅ Client Secret 활성화: 사용함 ⭐

자동으로 Phase 5로 진행합니다...
```

---

## Phase 5: Consent Items Configuration

**목적**: Supabase 필수 scope 설정

경로: `내 애플리케이션 > 제품 설정 > 카카오 로그인 > 동의 항목`

**⚠️ Supabase 필수 scope**:
- `account_email` (비즈앱 필수)
- `profile_image`
- `profile_nickname`

### 1. 동의 항목 설정

Playwright로 각 항목 설정:

**A. 닉네임 (profile_nickname)**
- "닉네임" 항목 찾기
- "설정" 버튼 클릭
- 수집 목적: "사용자 식별"
- 동의 단계: "선택 동의"
- 저장

**B. 프로필 사진 (profile_image)**
- "프로필 사진" 항목 찾기
- "설정" 버튼 클릭
- 수집 목적: "프로필 표시"
- 동의 단계: "선택 동의"
- 저장

**C. 카카오계정(이메일) (account_email)** ⚠️ 가장 중요!
- "카카오계정(이메일)" 항목 찾기
- "설정" 버튼 클릭
- 수집 목적: "사용자 인증 및 식별"
- 동의 단계: "필수 동의" (권장)
- **"카카오계정을 통해 정보 수집 후 제공" 체크** (중요!)
- 저장

### 2. Agent 자동 검증

Playwright snapshot으로 확인:

```
검증 항목:
✅ 닉네임 - "사용중" 상태
✅ 프로필 사진 - "사용중" 상태
✅ 카카오계정(이메일) - "사용중" 상태
✅ 이메일 - "필수 동의" 설정
✅ "카카오계정을 통해 정보 수집 후 제공" 활성화
```

검증 실패 시:
- ❌ 스크린샷 + 누락된 항목 표시
- ❌ 각 항목별 설정 방법 안내
- ⏸️ 사용자 수정 요청

검증 성공 시:
```
✅ Phase 5 완료

동의 항목 설정:
✅ profile_nickname (닉네임) - 사용중
✅ profile_image (프로필 사진) - 사용중
✅ account_email (이메일) - 사용중, 필수 동의

자동으로 Phase 6으로 진행합니다...
```

---

## Phase 6: Supabase Provider Configuration

**목적**: Kakao OAuth 연동 완료

경로: Supabase Dashboard > `Authentication > Providers`

### 1. Kakao Provider 활성화

Playwright로:
- Providers 페이지 이동
- "Kakao" 섹션 찾기 및 클릭

### 2. Enabled 토글 ON

Playwright로:
- "Kakao enabled" 토글 클릭 (ON으로 변경)

### 3. Credentials 입력

Playwright로:
- **REST API Key** 입력:
  - Phase 2에서 수집한 REST API 키
- **Client Secret Code** 입력:
  - Phase 4에서 수집한 Client Secret

### 4. 저장

Playwright로:
- "Save" 버튼 클릭

### 5. Agent 자동 검증 (Critical!)

Playwright snapshot으로 확인:

```
검증 항목:
1. ⚠️ "Kakao enabled" 토글 = ON (초록색)
2. REST API Key 입력됨
3. Client Secret Code 입력됨
4. Callback URL 표시됨
```

**Critical 검증: Enabled 토글**

페이지를 새로고침한 후 다시 확인:
- Playwright로 페이지 새로고침
- Snapshot으로 "Kakao enabled" 토글 재확인

검증 실패 시 (특히 Enabled 토글 OFF):
```
❌ Critical 에러 발견!

[스크린샷 첨부]

문제: Kakao Provider가 비활성화되어 있습니다.
위치: Authentication > Providers > Kakao

해결 방법:
1. 화면 제일 위에 "Kakao enabled"를 찾으세요
2. 회색 토글을 클릭해서 초록색으로 바꾸세요
3. "Save" 버튼을 클릭하세요

⚠️ 이 토글이 OFF면 모든 설정이 무용지물입니다!

에러: "Provider is not enabled"

수정하셨으면 "완료"를 입력해주세요.
```

**⏸️ 사용자 수정 대기**

검증 성공 시:
```
✅ Phase 6 완료

Supabase Kakao Provider 설정:
✅ Enabled: ON (초록색)
✅ Client ID: 6f7c0c... (앞 10자)
✅ Client Secret: VHf6hn... (앞 10자)
✅ Callback URL: https://xxxxx.supabase.co/auth/v1/callback

자동으로 Phase 7로 진행합니다...
```

---

## Phase 7: Environment Variables Setup

**목적**: .env 파일 생성

### 1. .env 파일 생성

Agent가 자동으로 `.env` 파일을 생성합니다:

```env
# Supabase Configuration
SUPABASE_URL={Phase 1에서 수집한 Project URL}
SUPABASE_ANON_KEY={Phase 1에서 수집한 Anon Key}

# Site Configuration
SITE_URL=http://localhost:3000
```

### 2. 파일 확인

생성된 파일을 사용자에게 표시:

```
✅ Phase 7 완료

.env 파일이 생성되었습니다:

SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (앞 20자 표시)
SITE_URL=http://localhost:3000

참고:
- Kakao Client ID/Secret는 Supabase에 설정되어 서버 사이드에서 처리됩니다.
- 클라이언트에서 Kakao JS SDK를 직접 사용하는 경우에만 KAKAO_JS_KEY 추가가 필요합니다.

자동으로 Phase 8로 진행합니다...
```

---

## Phase 8: Verification & Testing

**목적**: 최종 검증 및 테스트

### 1. 전체 설정 재검증

Agent가 모든 Critical 설정을 다시 확인:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
최종 검증 중...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Kakao 설정:
✅ 비즈앱 전환: 완료
✅ Client Secret 활성화: 사용함
✅ Redirect URI: 등록됨
✅ 동의 항목: account_email, profile_image, profile_nickname

Supabase 설정:
✅ Kakao Provider Enabled: ON
✅ Credentials: 입력됨
✅ Callback URL: 생성됨

환경 변수:
✅ .env 파일: 생성됨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 2. 테스트 코드 제공

```javascript
// 로그인 테스트 코드
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function signInWithKakao() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })

  if (error) {
    console.error('로그인 실패:', error)
  }
}
```

### 3. 테스트 가이드

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
테스트 방법
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 위 코드를 로그인 버튼에 연결하세요
2. 로그인 버튼을 클릭하세요
3. Kakao 로그인 페이지로 이동하는지 확인하세요
4. 로그인 후 Consent 화면에서 3개 항목 확인:
   - 닉네임
   - 프로필 사진
   - 카카오계정(이메일) [필수 동의]
5. "동의하고 계속하기" 클릭
6. 앱으로 리다이렉트되는지 확인

Supabase Dashboard에서 확인:
- Authentication > Users
- 새 사용자가 생성되었는지
- 이메일이 정상적으로 수집되었는지

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4. 실패 시 디버깅 가이드

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ 로그인이 실패한다면?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

에러별 해결 방법:

1. "redirect_uri_mismatch"
   → Kakao Redirect URI와 Supabase Callback URL 불일치
   → Agent가 다시 확인하겠습니다...

2. "invalid_client"
   → Client Secret 활성화 문제
   → Agent가 다시 확인하겠습니다...

3. "Provider is not enabled"
   → Supabase Enabled 토글 문제
   → Agent가 다시 확인하겠습니다...

4. 기타 에러
   → 에러 메시지를 말씀해주세요

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

로그인 실패 시, Agent가 자동으로:
1. Kakao Client Secret "사용함" 상태 재확인
2. Supabase Enabled 토글 재확인
3. Redirect URI 일치 여부 재확인
4. 문제 발견 시 스크린샷 + 해결 방법 제시

---

## 🎉 설정 완료!

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Kakao OAuth + Supabase 연동 완료!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

모든 설정이 완료되었습니다.

다음 단계:
1. 로그인 버튼 구현
2. 콜백 페이지 구현 (/auth/callback)
3. 사용자 세션 관리
4. 프로덕션 배포 시 SITE_URL 업데이트

참고 문서:
- Supabase Kakao Auth: https://supabase.com/docs/guides/auth/social-login/auth-kakao
- Kakao Developers: https://developers.kakao.com/docs/latest/ko/kakaologin/common

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 💡 Agent 검증 로직 요약

**각 Phase 완료 후 Agent가 자동으로:**

1. **Playwright Snapshot 촬영**
   - 페이지 상태 확인
   - 텍스트 및 요소 추출

2. **Critical 항목 검증**
   - Client Secret "사용함" 상태
   - Supabase Enabled 토글 ON
   - Redirect URI 일치
   - 동의 항목 활성화
   - 비즈앱 전환 완료

3. **검증 결과 처리**
   - ✅ 성공: 자동으로 다음 Phase
   - ❌ 실패: 스크린샷 + 문제점 + 해결 방법 → 사용자 수정 대기

4. **재검증** (Critical 항목)
   - 페이지 새로고침 후 재확인
   - 상태 유지 확인

**사용자 개입이 필요한 시점만:**
- 로그인
- 앱 아이콘 업로드
- 회사명/카테고리 입력
- 에러 수정

이 방식으로 **사용자 부담을 최소화**하고 **정확한 검증**을 보장합니다.
