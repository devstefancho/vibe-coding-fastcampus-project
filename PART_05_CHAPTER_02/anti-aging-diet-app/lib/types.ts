// 영양소/재료 타입
export interface Ingredient {
  name: string;
  amount: number; // 현재 양 (g)
  caloriesPerUnit: number; // 단위당 칼로리 (kcal/100g)
  currentCalories: number; // 현재 칼로리 (자동 계산)
}

// 식단 메뉴 타입
export interface Meal {
  id: string;
  name: string;
  icon: string; // 아이콘 이름 (예: 'SweetPotato', 'Asparagus')
  ingredients: Ingredient[];
  totalCalories: number; // 총 칼로리 (자동 계산)
}

// 일일 식단 기록 타입
export interface DailyLog {
  date: string; // YYYY-MM-DD 형식
  meals: Meal[];
  totalCalories: number; // 하루 총 칼로리
}
