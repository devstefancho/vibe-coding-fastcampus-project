import { Meal } from './types';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// 칼로리 계산 헬퍼 함수
const calculateCalories = (amount: number, caloriesPerUnit: number): number => {
  return Math.round((amount / 100) * caloriesPerUnit);
};

export const getInitialMeals = (): Meal[] => {
  return [
    {
      id: uuidv4(),
      name: '고구마 샐러드',
      icon: 'SweetPotato',
      ingredients: [
        {
          name: '고구마',
          amount: 100,
          caloriesPerUnit: 86,
          currentCalories: calculateCalories(100, 86),
        },
        {
          name: '양상추',
          amount: 50,
          caloriesPerUnit: 15,
          currentCalories: calculateCalories(50, 15),
        },
        {
          name: '올리브 오일',
          amount: 10,
          caloriesPerUnit: 884,
          currentCalories: calculateCalories(10, 884),
        },
      ],
      totalCalories: 0, // 나중에 계산
    },
    {
      id: uuidv4(),
      name: '아스파라거스 구이',
      icon: 'Asparagus',
      ingredients: [
        {
          name: '아스파라거스',
          amount: 150,
          caloriesPerUnit: 20,
          currentCalories: calculateCalories(150, 20),
        },
        {
          name: '마늘',
          amount: 10,
          caloriesPerUnit: 149,
          currentCalories: calculateCalories(10, 149),
        },
        {
          name: '올리브 오일',
          amount: 10,
          caloriesPerUnit: 884,
          currentCalories: calculateCalories(10, 884),
        },
      ],
      totalCalories: 0,
    },
    {
      id: uuidv4(),
      name: '브로콜리 스프',
      icon: 'Broccoli',
      ingredients: [
        {
          name: '브로콜리',
          amount: 200,
          caloriesPerUnit: 34,
          currentCalories: calculateCalories(200, 34),
        },
        {
          name: '양파',
          amount: 50,
          caloriesPerUnit: 40,
          currentCalories: calculateCalories(50, 40),
        },
        {
          name: '우유',
          amount: 100,
          caloriesPerUnit: 61,
          currentCalories: calculateCalories(100, 61),
        },
      ],
      totalCalories: 0,
    },
    {
      id: uuidv4(),
      name: '연어 구이',
      icon: 'Salmon',
      ingredients: [
        {
          name: '연어',
          amount: 150,
          caloriesPerUnit: 208,
          currentCalories: calculateCalories(150, 208),
        },
        {
          name: '레몬',
          amount: 20,
          caloriesPerUnit: 29,
          currentCalories: calculateCalories(20, 29),
        },
        {
          name: '올리브 오일',
          amount: 5,
          caloriesPerUnit: 884,
          currentCalories: calculateCalories(5, 884),
        },
      ],
      totalCalories: 0,
    },
    {
      id: uuidv4(),
      name: '블루베리 요거트',
      icon: 'Blueberry',
      ingredients: [
        {
          name: '블루베리',
          amount: 100,
          caloriesPerUnit: 57,
          currentCalories: calculateCalories(100, 57),
        },
        {
          name: '그릭 요거트',
          amount: 150,
          caloriesPerUnit: 59,
          currentCalories: calculateCalories(150, 59),
        },
        {
          name: '꿀',
          amount: 10,
          caloriesPerUnit: 304,
          currentCalories: calculateCalories(10, 304),
        },
      ],
      totalCalories: 0,
    },
  ];
};

// 각 식단의 총 칼로리 계산
export const calculateMealCalories = (meal: Meal): Meal => {
  const totalCalories = meal.ingredients.reduce(
    (sum, ingredient) => sum + ingredient.currentCalories,
    0
  );
  return { ...meal, totalCalories };
};

// 모든 식단의 칼로리 계산
export const getInitialMealsWithCalories = (): Meal[] => {
  return getInitialMeals().map(calculateMealCalories);
};
