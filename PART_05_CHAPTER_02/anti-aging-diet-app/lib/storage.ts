import AsyncStorage from '@react-native-async-storage/async-storage';
import { Meal, DailyLog } from './types';

const MEALS_KEY = '@anti_aging_meals';
const DAILY_LOGS_KEY = '@anti_aging_daily_logs';

// ============ 식단 메뉴 관련 ============

/**
 * 모든 식단 메뉴 목록을 저장
 */
export const saveMeals = async (meals: Meal[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(meals);
    await AsyncStorage.setItem(MEALS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving meals:', error);
    throw error;
  }
};

/**
 * 모든 식단 메뉴 목록을 불러오기
 */
export const loadMeals = async (): Promise<Meal[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MEALS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading meals:', error);
    return [];
  }
};

/**
 * 특정 식단 메뉴를 ID로 조회
 */
export const getMealById = async (id: string): Promise<Meal | null> => {
  try {
    const meals = await loadMeals();
    return meals.find(meal => meal.id === id) || null;
  } catch (error) {
    console.error('Error getting meal by id:', error);
    return null;
  }
};

// ============ 일일 식단 기록 관련 ============

/**
 * 모든 일일 식단 기록을 저장
 */
export const saveDailyLogs = async (logs: DailyLog[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(logs);
    await AsyncStorage.setItem(DAILY_LOGS_KEY, jsonValue);
  } catch (error) {
    console.error('Error saving daily logs:', error);
    throw error;
  }
};

/**
 * 모든 일일 식단 기록을 불러오기
 */
export const loadDailyLogs = async (): Promise<DailyLog[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(DAILY_LOGS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error('Error loading daily logs:', error);
    return [];
  }
};

/**
 * 특정 날짜의 식단 기록을 조회
 */
export const getDailyLogByDate = async (date: string): Promise<DailyLog | null> => {
  try {
    const logs = await loadDailyLogs();
    return logs.find(log => log.date === date) || null;
  } catch (error) {
    console.error('Error getting daily log by date:', error);
    return null;
  }
};

/**
 * 특정 날짜에 식단 추가
 */
export const addMealToDate = async (date: string, meal: Meal): Promise<void> => {
  try {
    const logs = await loadDailyLogs();
    const existingLogIndex = logs.findIndex(log => log.date === date);

    if (existingLogIndex !== -1) {
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

/**
 * 특정 날짜의 특정 식단 삭제
 */
export const removeMealFromDate = async (date: string, mealId: string): Promise<void> => {
  try {
    const logs = await loadDailyLogs();
    const logIndex = logs.findIndex(log => log.date === date);

    if (logIndex !== -1) {
      const mealIndex = logs[logIndex].meals.findIndex(meal => meal.id === mealId);

      if (mealIndex !== -1) {
        const removedMeal = logs[logIndex].meals[mealIndex];
        logs[logIndex].meals.splice(mealIndex, 1);
        logs[logIndex].totalCalories -= removedMeal.totalCalories;

        // 식단이 비어있으면 해당 날짜 기록 삭제
        if (logs[logIndex].meals.length === 0) {
          logs.splice(logIndex, 1);
        }

        await saveDailyLogs(logs);
      }
    }
  } catch (error) {
    console.error('Error removing meal from date:', error);
    throw error;
  }
};

/**
 * 식단이 기록된 모든 날짜 목록 반환
 */
export const getMarkedDates = async (): Promise<string[]> => {
  try {
    const logs = await loadDailyLogs();
    return logs.map(log => log.date);
  } catch (error) {
    console.error('Error getting marked dates:', error);
    return [];
  }
};

/**
 * 모든 데이터 초기화 (개발용)
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([MEALS_KEY, DAILY_LOGS_KEY]);
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
