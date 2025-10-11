## 오늘의 명언

## 목적

명언을 추천하고 보여주는 웹서비스를 만들려고 한다.
AI를 활용해 대량의 명언 데이터를 생성하고, Supabase를 사용해 데이터베이스를 구축할 것이다.
랜덤 추천 기능과 검색 기능을 제공하며, 사용자 친화적인 UI를 구성한다.


## 기술 스택

- Frontend: HTML, CSS, JavaScript
- Database: Supabase PostgreSQL
- Tools: Supabase MCP, Node.js (데이터 업로드)


## 사전 준비: Supabase MCP 설정

**Supabase MCP란?**
Claude Code에서 Supabase를 직접 제어할 수 있게 해주는 연결 도구입니다.

**설정 방법:**

1. Supabase 대시보드 접속 (https://supabase.com)
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 왼쪽 메뉴에서 **"Connect"** 클릭
4. **"MCP"** 탭 클릭
5. 표시된 JSON 설정을 복사
6. 로컬의 `.mcp.json` 파일을 열고 복사한 내용을 추가
7. Claude Code 재시작

**설정 완료 확인:**
```
> /mcp
```
명령어 실행 시 "Connected to supabase" 메시지가 보이면 성공!

**연결 후 데이터베이스 확인:**
```
> supabase에 연결된 database 확인해줘
```

Supabase MCP가 정상적으로 연결되면:
- 데이터베이스 스키마 목록 확인 가능 (auth, storage, public)
- 테이블 목록 및 구조 확인 가능
- 설치된 확장 기능 확인 가능
- 마이그레이션 이력 확인 가능

이제 Claude Code에서 직접 테이블을 생성하고 관리할 수 있습니다!

---

## Prompt

0. Supabase 테이블 설정

```
> @note.md 를 읽어보고, 여기 기반으로 table 세팅해줘
```

**자동 처리 내용:**
1. quotes.json 파일 구조 분석
2. Supabase MCP로 마이그레이션 생성 및 실행
3. quotes 테이블 생성 (id, quote, author, category, created_at)
4. 검색 최적화 인덱스 생성 (작가명, 카테고리, 전문검색용 GIN)
5. RLS 정책 설정 (공개 읽기, 인증된 쓰기)

**생성 결과 확인:**
- 테이블: public.quotes
- 행 수: 0개 (데이터 업로드 대기 중)
- RLS: 활성화됨
- 인덱스: 3개 (성능 최적화)

이제 quotes.json 데이터를 업로드할 준비가 완료되었습니다!

---

1. 명언 추천 웹서비스 기본 구조 만들기

```
> 명언을 추천해주고 보여주는 웹서비스를 만들어줘.
내가 좋아하는 명언을 검색할 수도 있으면 좋겠다.
랜덤 명언 추천 기능도 포함해서 만들어줘
```

2. 랜덤 추출 카드 UI 개선하기

```
> 랜덤 추출기능의 카드 ui를 통일성있게 만들어줘.
그리고 랜덤으로 나오는 카드 ui의 속도를 좀 더 보기 쉽게 조정해줘. 지금은 너무 빠름
```

3. 명언 데이터 준비하기

**데이터 출처**: Hugging Face의 Quotes-500K 데이터셋 (https://huggingface.co/datasets/jstet/quotes-500k)
- 원본: 약 15만개의 실제 명언 (Goodreads, BrainyQuote 등에서 수집)
- 제공: 2000개 랜덤 샘플링한 quotes.json 파일

**다운로드 방법**:
강의 자료 폴더(`PART_04_CHAPTER_07`)에 제공된 `quotes.json` 파일을 프로젝트 폴더로 복사하세요.

```
> 강의 자료에서 quotes.json 파일을 프로젝트 폴더에 복사했어.
이 파일의 내용을 확인하고 Supabase에 업로드할 준비를 해줘.
```

4. Supabase 테이블 생성 및 데이터 자동 업로드

```
> quotes.json 파일을 Supabase에 자동으로 업로드하는 시스템을 만들어줘.
Supabase MCP로 테이블을 생성하고, Node.js 스크립트로 2000개 데이터를 업로드할 수 있게 해줘.
진행률 표시와 에러 처리도 포함해줘.
```

**Claude Code가 자동으로 처리하는 내용:**
1. Supabase MCP를 통해 `quotes` 테이블 생성
2. RLS(Row Level Security) 정책 설정
3. Node.js 업로드 스크립트 생성 (upload-to-supabase.js)
4. .env 설정 파일 생성

**사용자가 할 일:**
1. Supabase URL과 API Key를 .env 파일에 입력
2. `npm install @supabase/supabase-js dotenv` 실행
3. `node upload-to-supabase.js` 실행

**예상 결과:**
```
🚀 Supabase 명언 데이터 업로드 시작
📋 테이블 확인 중...
✅ quotes 테이블이 존재합니다.
📤 업로드 시작 (배치 크기: 100)
[██████████████████████████████████████████████████] 100% (2000/2000)
🎉 업로드 완료!
```

5. Supabase API를 웹사이트에 연동하기

```
> Supabase에 데이터를 업로드 했으니, 이제 웹사이트에서 Supabase API를 통해 명언 데이터를 불러와서 표시해줘.
Supabase 연결 설정과 API 호출 코드를 추가해줘.
```

6. 명언 검색 기능 개선하기

```
> 명언 탐색 부분을 개선하려고 한다.
작가명으로 검색, 키워드로 검색, 카테고리별 필터링 등의 기능을 추가해줘.
```

7. 명언 UI 디자인 개선하기

```
> v0를 참고해서 명언 카드 UI를 더 세련되게 개선하려고 한다.
타이포그래피, 색상, 레이아웃 등을 고려해서 명언이 돋보이는 디자인으로 만들어줘.
```

8. SNS 공유 기능 추가하기

```
> 마음에 드는 명언을 Twitter에 공유할 수 있는 기능을 추가해줘.
명언 카드 영역을 이미지로 만들고, Clipboard API로 복사한 후 Twitter 창을 열어줘.
이미지 다운로드 버튼도 함께 만들어줘.
```
