// Ingredient (영양소/재료)
export interface Ingredient {
  name: string; // 재료 이름 (예: "양상추", "올리브")
  amount: number; // 현재 양 (g)
  caloriesPerUnit: number; // 단위당 칼로리 (kcal/100g)
  currentCalories: number; // 현재 칼로리 (자동 계산)
}

// Meal (식단 메뉴)
export interface Meal {
  id: string; // 고유 식별자 (UUID)
  name: string; // 식단 이름 (예: "고구마 샐러드")
  icon: string; // SVG 컴포넌트 이름
  ingredients: Ingredient[]; // 영양소/재료 배열
  totalCalories: number; // 총 칼로리 (자동 계산)
}

// DailyLog (일일 식단 기록)
export interface DailyLog {
  date: string; // 날짜 (YYYY-MM-DD)
  meals: Meal[]; // 해당 날짜에 먹은 식단 배열
  totalCalories: number; // 하루 총 칼로리
}

// MarkedDates for react-native-calendars
export interface MarkedDates {
  [date: string]: {
    marked: boolean;
    dotColor?: string;
    selected?: boolean;
    selectedColor?: string;
  };
}
