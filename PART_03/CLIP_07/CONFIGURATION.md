# 날씨 앱 설정 가이드

## 📁 파일 구조
```
CLIP_07/
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일
├── script.js           # JavaScript 로직
├── config.js           # 앱 설정
├── weather-data.js     # 날씨 데이터
├── theme.js            # 테마 설정
├── README.md           # 프로젝트 설명
└── CONFIGURATION.md    # 설정 가이드 (이 파일)
```

## ⚙️ 설정 방법

### 1. 날씨 데이터 수정 (`weather-data.js`)

#### 기본 날씨 정보 변경
```javascript
const WEATHER_DATA = {
    seoul: {
        city: '서울',
        temperature: 23,        // 온도 (숫자)
        description: '맑음',    // 날씨 설명
        icon: '☀️',            // 날씨 아이콘
        humidity: 65,          // 습도 (%)
        windSpeed: 12,         // 풍속 (km/h)
        pressure: 1013         // 기압 (hPa)
    }
    // 다른 도시들...
};
```

#### 새로운 도시 추가
```javascript
// weather-data.js에 새 도시 추가
gwangju: {
    city: '광주',
    temperature: 24,
    description: '구름 조금',
    icon: '🌤️',
    humidity: 60,
    windSpeed: 10,
    pressure: 1012
}
```

### 2. 앱 설정 수정 (`config.js`)

#### 기본 도시 변경
```javascript
const APP_CONFIG = {
    defaultCity: 'busan',  // 'seoul'에서 'busan'으로 변경
    // ...
};
```

#### 도시 목록 수정
```javascript
cities: [
    { key: 'seoul', name: '서울', displayName: '서울' },
    { key: 'busan', name: '부산', displayName: '부산' },
    { key: 'gwangju', name: '광주', displayName: '광주' },  // 새 도시 추가
    // { key: 'daegu', name: '대구', displayName: '대구' }  // 기존 도시 제거
],
```

#### 언어 설정
```javascript
language: {
    title: 'Weather Info',  // 영어로 변경
    labels: {
        humidity: 'Humidity',
        windSpeed: 'Wind Speed',
        pressure: 'Pressure',
        lastUpdated: 'Last Updated'
    }
}
```

#### 단위 설정
```javascript
units: {
    temperature: 'fahrenheit',  // 화씨 사용
    windSpeed: 'mph',          // 마일/시 사용
    pressure: 'inHg'           // 인치수은주 사용
}
```

### 3. 테마 설정 수정 (`theme.js`)

#### 색상 테마 변경
```javascript
const THEME_CONFIG = {
    colors: {
        // 배경 그라데이션 변경
        backgroundGradient: {
            primary: '#ff7675',    // 빨간색 계열
            secondary: '#e17055',
            direction: '135deg'
        },

        // 버튼 색상 변경
        buttons: {
            default: {
                primary: '#fd79a8',
                secondary: '#fdcb6e'
            }
        }
    }
};
```

#### 크기 설정 변경
```javascript
dimensions: {
    card: {
        maxWidth: '500px',      // 카드 폭 확대
        borderRadius: '30px',   // 더 둥근 모서리
        padding: '40px'         // 내부 여백 확대
    },
    fontSize: {
        title: '2.5rem',        // 제목 크기 확대
        temperature: '4rem'     // 온도 크기 확대
    }
}
```

## 🎨 스타일 커스터마이징

### CSS 파일 직접 수정 (`styles.css`)

#### 배경 그라데이션 변경
```css
body {
    background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

#### 카드 스타일 변경
```css
.weather-container {
    background: rgba(255, 255, 255, 0.9);  /* 투명도 조정 */
    border-radius: 25px;                    /* 모서리 둥글기 */
    padding: 35px;                          /* 내부 여백 */
}
```

## 🔧 고급 설정

### HTML 구조 수정 (`index.html`)

#### 도시 버튼 추가
```html
<div class="city-buttons">
    <button class="city-btn active" data-city="seoul">서울</button>
    <button class="city-btn" data-city="busan">부산</button>
    <button class="city-btn" data-city="daegu">대구</button>
    <button class="city-btn" data-city="incheon">인천</button>
    <button class="city-btn" data-city="gwangju">광주</button>  <!-- 새 버튼 -->
</div>
```

### JavaScript 기능 확장 (`script.js`)

#### 동적 도시 추가
```javascript
// 런타임에 새 도시 추가
weatherApp.addCity('jeju', {
    city: '제주',
    temperature: 22,
    description: '맑음',
    icon: '☀️',
    humidity: 70,
    windSpeed: 15,
    pressure: 1010
});
```

#### 데이터 업데이트
```javascript
// 기존 도시 데이터 업데이트
weatherApp.updateCityData('seoul', {
    temperature: 25,
    description: '구름 많음',
    icon: '⛅'
});
```

## 📋 설정 체크리스트

### 기본 설정
- [ ] 기본 선택 도시 변경
- [ ] 온도 단위 설정 (섭씨/화씨)
- [ ] 풍속 단위 설정 (km/h/mph)
- [ ] 언어 설정 (한국어/영어)

### 데이터 설정
- [ ] 각 도시별 온도 조정
- [ ] 날씨 상태 및 아이콘 변경
- [ ] 습도, 풍속, 기압 값 조정
- [ ] 새로운 도시 추가/제거

### 디자인 설정
- [ ] 배경 색상/그라데이션 변경
- [ ] 카드 크기 및 모양 조정
- [ ] 폰트 크기 조정
- [ ] 버튼 색상 변경

### 고급 설정
- [ ] 반응형 브레이크포인트 조정
- [ ] 애니메이션 속도 변경
- [ ] 새로운 UI 요소 추가

## 🚀 설정 적용 방법

1. **파일 수정**: 원하는 설정 파일을 텍스트 에디터로 열어 수정
2. **저장**: 변경사항 저장
3. **새로고침**: 브라우저에서 `index.html` 새로고침
4. **확인**: 변경사항이 올바르게 적용되었는지 확인

## ⚠️ 주의사항

- JavaScript 객체 문법을 정확히 지켜주세요 (콤마, 괄호 등)
- 색상 코드는 유효한 CSS 색상 형식을 사용하세요
- 새로운 도시를 추가할 때는 HTML과 JavaScript 모두에 추가해야 합니다
- 파일을 수정하기 전에 백업을 만들어두는 것을 권장합니다