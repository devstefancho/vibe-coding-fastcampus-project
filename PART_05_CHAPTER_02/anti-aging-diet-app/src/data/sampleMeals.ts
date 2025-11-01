import { Meal } from '../types';
import { v4 as uuidv4 } from 'react-native-get-random-values';

// UUID 생성을 위한 간단한 헬퍼 함수
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// 칼로리 계산 헬퍼 함수
const calculateCalories = (amount: number, caloriesPerUnit: number): number => {
  return Math.round((amount / 100) * caloriesPerUnit);
};

export const SAMPLE_MEALS: Meal[] = [
  {
    id: generateId(),
    name: '고구마 샐러드',
    icon: 'sweetpotato',
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
    totalCalories: 100,
  },
  {
    id: generateId(),
    name: '아스파라거스 구이',
    icon: 'asparagus',
    ingredients: [
      {
        name: '아스파라거스',
        amount: 150,
        caloriesPerUnit: 20,
        currentCalories: calculateCalories(150, 20),
      },
      {
        name: '올리브 오일',
        amount: 10,
        caloriesPerUnit: 884,
        currentCalories: calculateCalories(10, 884),
      },
      {
        name: '마늘',
        amount: 5,
        caloriesPerUnit: 149,
        currentCalories: calculateCalories(5, 149),
      },
    ],
    totalCalories: 100,
  },
  {
    id: generateId(),
    name: '브로콜리 스프',
    icon: 'broccoli',
    ingredients: [
      {
        name: '브로콜리',
        amount: 150,
        caloriesPerUnit: 34,
        currentCalories: calculateCalories(150, 34),
      },
      {
        name: '우유',
        amount: 100,
        caloriesPerUnit: 61,
        currentCalories: calculateCalories(100, 61),
      },
    ],
    totalCalories: 80,
  },
  {
    id: generateId(),
    name: '연어 구이',
    icon: 'salmon',
    ingredients: [
      {
        name: '연어',
        amount: 150,
        caloriesPerUnit: 142,
        currentCalories: calculateCalories(150, 142),
      },
      {
        name: '레몬',
        amount: 20,
        caloriesPerUnit: 29,
        currentCalories: calculateCalories(20, 29),
      },
      {
        name: '올리브 오일',
        amount: 10,
        caloriesPerUnit: 884,
        currentCalories: calculateCalories(10, 884),
      },
    ],
    totalCalories: 250,
  },
  {
    id: generateId(),
    name: '블루베리 요거트',
    icon: 'blueberry',
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
    totalCalories: 120,
  },
];

// 총 칼로리 재계산 함수
export const recalculateMealCalories = (meal: Meal): Meal => {
  const totalCalories = meal.ingredients.reduce((sum, ingredient) => {
    return sum + ingredient.currentCalories;
  }, 0);

  return {
    ...meal,
    totalCalories,
  };
};

// 재료 양 업데이트 함수
export const updateIngredientAmount = (meal: Meal, ingredientIndex: number, newAmount: number): Meal => {
  const updatedIngredients = meal.ingredients.map((ingredient, index) => {
    if (index === ingredientIndex) {
      const currentCalories = calculateCalories(newAmount, ingredient.caloriesPerUnit);
      return {
        ...ingredient,
        amount: newAmount,
        currentCalories,
      };
    }
    return ingredient;
  });

  const totalCalories = updatedIngredients.reduce((sum, ingredient) => sum + ingredient.currentCalories, 0);

  return {
    ...meal,
    ingredients: updatedIngredients,
    totalCalories,
  };
};
