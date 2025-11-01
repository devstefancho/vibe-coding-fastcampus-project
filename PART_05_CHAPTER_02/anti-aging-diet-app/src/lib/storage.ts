import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal, DailyLog } from '../types';

const MEALS_KEY = '@anti_aging_diet:meals';
const DAILY_LOGS_KEY = '@anti_aging_diet:daily_logs';

// 식단 메뉴 목록 저장
export const saveMeals = async (meals: Meal[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(MEALS_KEY, JSON.stringify(meals));
  } catch (error) {
    console.error('Error saving meals:', error);
    throw error;
  }
};

// 식단 메뉴 목록 불러오기
export const loadMeals = async (): Promise<Meal[]> => {
  try {
    const mealsJson = await AsyncStorage.getItem(MEALS_KEY);
    if (mealsJson) {
      return JSON.parse(mealsJson);
    }
    return [];
  } catch (error) {
    console.error('Error loading meals:', error);
    return [];
  }
};

// 일일 식단 기록 저장
export const saveDailyLogs = async (logs: DailyLog[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(DAILY_LOGS_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error('Error saving daily logs:', error);
    throw error;
  }
};

// 일일 식단 기록 불러오기
export const loadDailyLogs = async (): Promise<DailyLog[]> => {
  try {
    const logsJson = await AsyncStorage.getItem(DAILY_LOGS_KEY);
    if (logsJson) {
      return JSON.parse(logsJson);
    }
    return [];
  } catch (error) {
    console.error('Error loading daily logs:', error);
    return [];
  }
};

// 특정 날짜의 식단 조회
export const getDailyLog = async (date: string): Promise<DailyLog | null> => {
  try {
    const logs = await loadDailyLogs();
    return logs.find(log => log.date === date) || null;
  } catch (error) {
    console.error('Error getting daily log:', error);
    return null;
  }
};

// 특정 날짜에 식단 추가
export const addMealToDate = async (date: string, meal: Meal): Promise<void> => {
  try {
    const logs = await loadDailyLogs();
    const existingLogIndex = logs.findIndex(log => log.date === date);

    if (existingLogIndex >= 0) {
      // 기존 날짜에 식단 추가
      logs[existingLogIndex].meals.push(meal);
      logs[existingLogIndex].totalCalories += meal.totalCalories;
    } else {
      // 새로운 날짜 기록 생성
      logs.push({
        date,
        meals: [meal],
        totalCalories: meal.totalCalories,
      });
    }

    await saveDailyLogs(logs);
  } catch (error) {
    console.error('Error adding meal to date:', error);
    throw error;
  }
};

// 특정 날짜의 특정 식단 삭제
export const removeMealFromDate = async (date: string, mealId: string): Promise<void> => {
  try {
    const logs = await loadDailyLogs();
    const logIndex = logs.findIndex(log => log.date === date);

    if (logIndex >= 0) {
      const mealIndex = logs[logIndex].meals.findIndex(meal => meal.id === mealId);

      if (mealIndex >= 0) {
        const removedMeal = logs[logIndex].meals[mealIndex];
        logs[logIndex].meals.splice(mealIndex, 1);
        logs[logIndex].totalCalories -= removedMeal.totalCalories;

        // 식단이 모두 삭제되면 해당 날짜 기록도 삭제
        if (logs[logIndex].meals.length === 0) {
          logs.splice(logIndex, 1);
        }
      }

      await saveDailyLogs(logs);
    }
  } catch (error) {
    console.error('Error removing meal from date:', error);
    throw error;
  }
};

// 모든 데이터 초기화
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([MEALS_KEY, DAILY_LOGS_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
