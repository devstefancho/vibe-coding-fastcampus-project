# Google 스프레드시트 연동 가이드 (범용)

## 📋 전체 작업 순서

### 1단계: Google Cloud Platform 설정
### 2단계: 스프레드시트 준비
### 3단계: 프로젝트 초기화
### 4단계: API 연동 코드 구현
### 5단계: 앱 UI 구현
### 6단계: 테스트 및 실행

---

## 🔧 1단계: Google Cloud Platform 설정

### 1-1. Google Cloud Console 접속
1. **링크**: https://console.cloud.google.com/
2. Google 계정으로 로그인

### 1-2. 새 프로젝트 생성
1. 상단 프로젝트 드롭다운 클릭
2. **"새 프로젝트"** 클릭
3. 프로젝트 이름 입력
4. **"만들기"** 클릭
5. 생성된 프로젝트 선택

### 1-3. Google Sheets API 활성화
1. **링크**: https://console.cloud.google.com/apis/library
2. 검색창에 **"Google Sheets API"** 입력
3. **"Google Sheets API"** 선택
4. **"사용 설정"** 클릭

### 1-4. Service Account 생성
1. **링크**: https://console.cloud.google.com/iam-admin/serviceaccounts
2. **"서비스 계정 만들기"** 클릭
3. 서비스 계정 이름 입력
4. 설명 추가
5. **"만들고 계속하기"** 클릭
6. 역할에서 **"편집자"** 선택
7. **"완료"** 클릭

### 1-5. 인증 키 파일 다운로드
1. 생성된 서비스 계정 클릭
2. **"키"** 탭 클릭
3. **"키 추가"** → **"새 키 만들기"** 클릭
4. **"JSON"** 선택
5. **"만들기"** 클릭
6. 자동으로 다운로드되는 JSON 파일을 프로젝트 폴더에 저장
7. 파일명을 `service-account-key.json`으로 변경

---

## 📊 2단계: 스프레드시트 준비

### 2-1. 새 스프레드시트 생성
1. **링크**: https://sheets.google.com/
2. **"빈 스프레드시트"** 클릭
3. 스프레드시트 이름 설정

### 2-2. 헤더 설정
- 앱에 필요한 컬럼들을 첫 번째 행에 정의
- 예: ID, Name, Status, Date 등

### 2-3. 서비스 계정에 권한 부여
1. 스프레드시트 우상단 **"공유"** 클릭
2. 다운로드한 JSON 파일에서 `client_email` 값 복사
3. 이메일 입력란에 붙여넣기
4. 권한을 **"편집자"**로 설정
5. **"보내기"** 클릭

### 2-4. 스프레드시트 ID 복사
- URL에서 스프레드시트 ID 복사
- 예: `https://docs.google.com/spreadsheets/d/[THIS_IS_THE_ID]/edit`

⚠️ **중요**: GOOGLE_SHEETS_ID에는 전체 URL이 아닌 ID 부분만 입력하세요.

---

## 🚀 3단계: 프로젝트 초기화

### 3-1. 프로젝트 초기화
```bash
npm init -y
```

### 3-2. 필요한 패키지 설치
```bash
npm install googleapis dotenv express
npm install --save-dev nodemon
```

### 3-3. 프로젝트 구조
```
project/
├── service-account-key.json
├── .env
├── .gitignore
├── package.json
├── server.js
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── lib/
    └── sheets.js
```

### 3-4. 환경변수 설정 (.env)
```env
GOOGLE_SHEETS_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_PATH=./service-account-key.json
PORT=3000
```

### 3-5. .gitignore 설정
```gitignore
node_modules/
.env
service-account-key.json
.DS_Store
```

---

## 💻 4단계: API 연동 코드 구현

### 4-1. Google Sheets Service 클래스 구조 (lib/sheets.js)

```javascript
const { google } = require('googleapis');
require('dotenv').config();

class SheetsService {
  constructor() {
    this.auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    this.spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  }

  // 데이터 읽기
  async getData(range) {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: this.spreadsheetId,
      range: range,
    });
    return response.data.values || [];
  }

  // 데이터 추가
  async appendData(range, values) {
    await this.sheets.spreadsheets.values.append({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });
  }

  // 데이터 업데이트
  async updateData(range, values) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId: this.spreadsheetId,
      range: range,
      valueInputOption: 'USER_ENTERED',
      resource: { values }
    });
  }

  // 행 삭제
  async deleteRow(sheetId, rowIndex) {
    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      resource: {
        requests: [{
          deleteDimension: {
            range: {
              sheetId: sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex,
              endIndex: rowIndex + 1
            }
          }
        }]
      }
    });
  }
}

module.exports = SheetsService;
```

### 4-2. Express 서버 기본 구조 (server.js)

```javascript
const express = require('express');
const SheetsService = require('./lib/sheets');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const sheetsService = new SheetsService();

app.use(express.json());
app.use(express.static('public'));

// API 라우트 예시
app.get('/api/data', async (req, res) => {
  try {
    const data = await sheetsService.getData('Sheet1!A:Z');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    // 요청 데이터 처리 및 추가
    const values = [[/* 데이터 배열 */]];
    await sheetsService.appendData('Sheet1!A:Z', values);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

---

## 🎨 5단계: 앱 UI 구현

### 5-1. 기본 HTML 구조 (public/index.html)
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Sheets App</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <div class="container">
        <!-- 앱 UI 구현 -->
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### 5-2. JavaScript API 통신 (public/script.js)
```javascript
// API 호출 예시
async function loadData() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        // 데이터 처리
    } catch (error) {
        console.error('Error:', error);
    }
}

async function saveData(data) {
    try {
        const response = await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

## 🧪 6단계: 테스트 및 실행

### 6-1. 실행 전 체크리스트
- [ ] service-account-key.json 파일이 프로젝트 루트에 있는지 확인
- [ ] .env 파일에 올바른 스프레드시트 ID가 설정되었는지 확인
- [ ] 스프레드시트에 서비스 계정 이메일이 편집자로 공유되었는지 확인
- [ ] 모든 필요한 패키지가 설치되었는지 확인

### 6-2. package.json scripts 설정
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 6-3. 개발 서버 실행
```bash
npm run dev
```

### 6-4. 프로덕션 실행
```bash
npm start
```

---

## 🔧 Google Sheets API 주요 메서드

### 읽기 작업
- `spreadsheets.values.get()`: 특정 범위 데이터 읽기
- `spreadsheets.values.batchGet()`: 여러 범위 동시 읽기

### 쓰기 작업
- `spreadsheets.values.append()`: 데이터 추가
- `spreadsheets.values.update()`: 데이터 업데이트
- `spreadsheets.values.batchUpdate()`: 여러 범위 동시 업데이트

### 구조 작업
- `spreadsheets.batchUpdate()`: 시트 구조 변경 (행/열 추가/삭제)
- `spreadsheets.create()`: 새 스프레드시트 생성

### 범위 지정 예시
- `Sheet1!A1:C10`: Sheet1의 A1부터 C10까지
- `Sheet1!A:A`: Sheet1의 A열 전체
- `Sheet1!1:1`: Sheet1의 첫 번째 행 전체
- `Sheet1`: Sheet1 전체

---

## ⚠️ 주의사항

1. **보안**: service-account-key.json 파일을 절대 Git에 커밋하지 마세요
2. **API 제한**:
   - 분당 100 요청 제한
   - 일일 할당량 존재
3. **에러 처리**: 네트워크 오류, API 오류 등에 대한 적절한 처리 필요
4. **데이터 백업**: 중요한 데이터는 별도로 백업
5. **성능 최적화**:
   - 배치 작업 활용
   - 불필요한 API 호출 최소화
   - 캐싱 고려

---

## 📚 참고 자료

- [Google Sheets API 문서](https://developers.google.com/sheets/api)
- [googleapis npm 패키지](https://www.npmjs.com/package/googleapis)
- [Google Cloud Console](https://console.cloud.google.com/)
- [API 할당량 및 제한](https://developers.google.com/sheets/api/limits)

