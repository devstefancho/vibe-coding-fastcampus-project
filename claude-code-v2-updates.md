# Claude Code v2.0 주요 변경점


## 💡 릴리즈 정보
- **출시일**: 2025년 9월 29일
- **적용 범위**: 본 강의의 **파트4 챕터5 부터 Claude Code v2.0을 사용**합니다.

---

## ✅ 주요 변경점

### 1. UI 변경점

#### 터미널 인터페이스 개선
- **새로운 UX 디자인**: User Prompt에 배경색이 들어가서 구분이 쉬워짐
- **검색 가능한 프롬프트 히스토리**: `Ctrl+R`로 이전 명령어 검색 가능


### 2. Checkpoint 시스템

자동으로 코드 상태를 저장하여 언제든 이전 상태로 되돌릴 수 있는 기능입니다.

#### 사용 방법
- **되돌리기**: `ESC` 두 번 또는 `/rewind` 명령어
- **복원 옵션**:
  - 대화만 복원
  - 코드만 복원
  - 대화와 코드 모두 복원

#### 활용 사례
- 다양한 구현 방식 실험
- 실수로 인한 변경사항 복구
- 여러 기능 변형 테스트

---

### 3. Claude Sonnet 4.5 모델

#### 개요
Claude Code v2.0의 기본 모델로, 코딩 작업에 최적화된 AI 모델입니다.

#### 성능 비교

##### SWE-bench Verified (소프트웨어 코딩 평가)
실제 소프트웨어 코딩 능력을 측정하는 벤치마크입니다.

| 모델 | 기본 성능 |
|------|----------|
| **Claude Sonnet 4.5** | **77.2%** |
| Claude Opus 4.1 | 74.5% |
| Claude Sonnet 4 | 72.7% |

#### 주요 개선사항

##### 코딩 능력
- **세계 최고 수준의 코딩 모델**: SWE-bench에서 가장 높은 점수 기록
- **30시간 이상 자율 작업 가능**: 복잡한 다단계 작업도 장시간 지속 가능

**결론**:

- **Sonnet 4.5**: 실제 프로덕션 작업(대규모 코딩, 안정적인 컴퓨터 사용, 장기 에이전트 작업)에 최적
- **Opus 4.1**: 깊이 있는 단일 스레드 추론이 필요한 경우에 적합

#### 가격
- **Sonnet 4.5**: $3/$15 (입력/출력, 100만 토큰당)
  - Sonnet 4와 동일한 가격
- **Opus 4.1**: $15/$75 (입력/출력, 100만 토큰당)

---

## 💻 설치 및 업그레이드 방법

### 사전 요구사항
- Node.js 18 이상
- Claude.ai 또는 Claude Console 계정

### 신규 설치
```bash
# Claude Code 설치
npm install -g @anthropic-ai/claude-code

# 프로젝트 디렉토리로 이동
cd your-awesome-project

# Claude Code 시작
claude
# 처음 사용 시 로그인 프롬프트가 표시됩니다
```

### 기존 버전 업그레이드

```bash
# Claude Code 내장 명령어 사용
claude update

# 또는 npm을 통한 최신 버전 설치
npm install -g @anthropic-ai/claude-code@latest
```

### 설치 확인
```bash
claude doctor
```
설치 타입과 버전을 확인할 수 있습니다.

---

## 참고 자료
- [Claude Code 공식 문서](https://docs.claude.com/en/docs/claude-code/overview)
- [Checkpointing 가이드](https://docs.claude.com/en/docs/claude-code/checkpointing)
- [Claude Sonnet 4.5 발표](https://www.anthropic.com/news/claude-sonnet-4-5)