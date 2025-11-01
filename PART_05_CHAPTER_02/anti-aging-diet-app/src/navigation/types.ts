import { Meal } from '../types';

// Stack Navigator 파라미터 타입
export type RootStackParamList = {
  MainTabs: undefined;
  MealDetail: { meal: Meal };
};

// Bottom Tab Navigator 파라미터 타입
export type TabParamList = {
  Home: undefined;
  TodaysDiet: undefined;
  Calendar: undefined;
};
