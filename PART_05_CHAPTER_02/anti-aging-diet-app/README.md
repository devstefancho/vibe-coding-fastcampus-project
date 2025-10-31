# 저속노화 식단 앱

React Native와 Expo를 사용한 모바일 저속노화 식단 관리 앱입니다.

## 주요 기능

### 1. 홈 - 식단 메뉴 목록
- 5가지 저속노화 식단 메뉴 제공
  - 고구마 샐러드
  - 아스파라거스 구이
  - 브로콜리 스프
  - 연어 구이
  - 블루베리 요거트
- 각 메뉴의 총 칼로리 표시
- 카드 클릭 시 상세 화면으로 이동

### 2. 식단 상세
- SVG 아이콘으로 식단 시각화
- 실시간 총 칼로리 계산
- 재료별 슬라이더로 양 조절 (0-500g)
- 각 재료의 칼로리 정보 표시
  - 단위당 칼로리 (kcal/100g)
  - 현재 양 (g)
  - 현재 칼로리 (kcal)
- "오늘식단에 추가" 버튼

### 3. 오늘식단
- 오늘 먹은 식단 목록 표시
- 날짜 및 요일 표시
- 오늘 섭취한 총 칼로리 계산
- 식단별 삭제 기능
- 빈 상태 처리

### 4. 달력
- 월별 달력 UI
- 식단이 기록된 날짜에 마커 표시
- 날짜 선택 시 해당 날짜의 식단 목록 표시
- 선택한 날짜의 총 칼로리 표시

## 기술 스택

- **React Native + Expo**: 크로스 플랫폼 모바일 앱 개발
- **TypeScript**: 타입 안정성
- **AsyncStorage**: 로컬 데이터 저장
- **React Navigation**: 탭 및 스택 네비게이션
- **react-native-svg**: SVG 아이콘 렌더링
- **@react-native-community/slider**: 재료 양 조절
- **react-native-calendars**: 달력 UI

## 설치 및 실행

### 필수 요구사항
- Node.js (v16 이상)
- npm 또는 yarn
- Expo Go 앱 (iOS/Android)

### 설치
```bash
# 의존성 설치
npm install
```

### 실행
```bash
# 개발 서버 시작 (포트 8082)
npm run start

# Android
npm run android

# iOS
npm run ios
```

### Expo Go로 실행
1. 스마트폰에 Expo Go 앱 설치
2. `npm run start` 실행
3. 터미널에 표시되는 QR 코드 스캔
4. Expo Go 앱에서 자동으로 앱 실행

## 프로젝트 구조

```
anti-aging-diet-app/
├── components/
│   └── icons/              # SVG 아이콘 컴포넌트
│       ├── SweetPotatoIcon.tsx
│       ├── AsparagusIcon.tsx
│       ├── BroccoliIcon.tsx
│       ├── SalmonIcon.tsx
│       ├── BlueberryIcon.tsx
│       └── index.ts
├── lib/
│   ├── types.ts            # TypeScript 타입 정의
│   ├── storage.ts          # AsyncStorage 유틸리티
│   └── initialData.ts      # 초기 샘플 데이터
├── navigation/
│   └── HomeStack.tsx       # 홈 스택 네비게이터
├── screens/
│   ├── HomeScreen.tsx      # 홈 화면
│   ├── MealDetailScreen.tsx # 식단 상세 화면
│   ├── TodayScreen.tsx     # 오늘식단 화면
│   └── CalendarScreen.tsx  # 달력 화면
├── App.tsx                 # 앱 진입점
├── app.json                # Expo 설정
└── package.json            # 프로젝트 의존성

```

## 데이터 구조

### Meal (식단)
```typescript
{
  id: string;              // UUID
  name: string;            // 식단 이름
  icon: string;            // 아이콘 이름
  ingredients: Ingredient[]; // 재료 배열
  totalCalories: number;   // 총 칼로리 (자동 계산)
}
```

### Ingredient (재료)
```typescript
{
  name: string;            // 재료 이름
  amount: number;          // 현재 양 (g)
  caloriesPerUnit: number; // 단위당 칼로리 (kcal/100g)
  currentCalories: number; // 현재 칼로리 (자동 계산)
}
```

### DailyLog (일일 기록)
```typescript
{
  date: string;            // 날짜 (YYYY-MM-DD)
  meals: Meal[];           // 해당 날짜의 식단 배열
  totalCalories: number;   // 하루 총 칼로리
}
```

## 주요 기능 구현

### 1. 로컬 데이터 저장
- AsyncStorage를 사용하여 모든 데이터를 기기에 저장
- 로그인 불필요
- 앱 재시작 시에도 데이터 유지

### 2. 실시간 칼로리 계산
```typescript
const calculateCalories = (amount: number, caloriesPerUnit: number): number => {
  return Math.round((amount / 100) * caloriesPerUnit);
};
```

### 3. 날짜 포맷팅
```typescript
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
```

## 스타일링

- **테마 컬러**: #5FA777 (초록색/헬스 테마)
- **배경색**: #F5F5F5 (밝은 회색)
- **카드 스타일**: 둥근 모서리 + 그림자 효과
- **타이포그래피**: 가독성 좋은 폰트 크기 및 두께

## 개발 가이드

### 새로운 식단 추가
1. `lib/initialData.ts`에 식단 데이터 추가
2. `components/icons/`에 SVG 아이콘 생성
3. `components/icons/index.ts`에 export 추가
4. HomeScreen과 상세 화면의 `iconMap`에 매핑 추가

### AsyncStorage 데이터 초기화
```typescript
import { clearAllData } from './lib/storage';

// 모든 데이터 삭제
await clearAllData();
```

## 라이선스

MIT

## 작성자

FastCampus - React Native 강의
