import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { Meal, Ingredient } from '../lib/types';
import { addMealToDate } from '../lib/storage';
import {
  SweetPotatoIcon,
  AsparagusIcon,
  BroccoliIcon,
  SalmonIcon,
  BlueberryIcon,
} from '../components/icons';

// 아이콘 매핑
const iconMap: { [key: string]: React.ComponentType<{ size?: number; color?: string }> } = {
  SweetPotato: SweetPotatoIcon,
  Asparagus: AsparagusIcon,
  Broccoli: BroccoliIcon,
  Salmon: SalmonIcon,
  Blueberry: BlueberryIcon,
};

interface MealDetailScreenProps {
  route: {
    params: {
      meal: Meal;
    };
  };
  navigation: any;
}

export const MealDetailScreen: React.FC<MealDetailScreenProps> = ({ route, navigation }) => {
  const { meal: initialMeal } = route.params;
  const [meal, setMeal] = useState<Meal>(initialMeal);

  const IconComponent = iconMap[meal.icon];

  // 오늘 날짜 가져오기 (YYYY-MM-DD 형식)
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 오늘식단에 추가
  const handleAddToToday = async () => {
    try {
      const today = getTodayDate();
      await addMealToDate(today, meal);

      Alert.alert(
        '추가 완료',
        '오늘식단에 추가되었습니다.',
        [
          {
            text: '확인',
            onPress: () => {
              // 부모 네비게이터(Tab)로 이동하여 Today 탭으로 전환
              const parent = navigation.getParent();
              if (parent) {
                parent.navigate('Today');
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('오류', '식단 추가에 실패했습니다.');
      console.error('Failed to add meal to today:', error);
    }
  };

  // 재료의 양 변경 핸들러
  const handleIngredientChange = (index: number, newAmount: number) => {
    const updatedIngredients = [...meal.ingredients];
    const ingredient = updatedIngredients[index];

    // 새로운 칼로리 계산
    const newCalories = Math.round((newAmount / 100) * ingredient.caloriesPerUnit);

    updatedIngredients[index] = {
      ...ingredient,
      amount: newAmount,
      currentCalories: newCalories,
    };

    // 총 칼로리 계산
    const totalCalories = updatedIngredients.reduce(
      (sum, ing) => sum + ing.currentCalories,
      0
    );

    setMeal({
      ...meal,
      ingredients: updatedIngredients,
      totalCalories,
    });
  };

  const renderIngredient = (ingredient: Ingredient, index: number) => {
    return (
      <View key={index} style={styles.ingredientCard}>
        <View style={styles.ingredientHeader}>
          <Text style={styles.ingredientName}>{ingredient.name}</Text>
          <Text style={styles.ingredientCalories}>{ingredient.currentCalories} kcal</Text>
        </View>

        <View style={styles.ingredientInfo}>
          <Text style={styles.infoText}>
            {ingredient.caloriesPerUnit} kcal/100g
          </Text>
          <Text style={styles.amountText}>{Math.round(ingredient.amount)}g</Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={500}
          step={10}
          value={ingredient.amount}
          onValueChange={(value) => handleIngredientChange(index, value)}
          minimumTrackTintColor="#5FA777"
          maximumTrackTintColor="#D3D3D3"
          thumbTintColor="#5FA777"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 헤더 섹션 */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            {IconComponent && <IconComponent size={100} />}
          </View>
          <Text style={styles.mealName}>{meal.name}</Text>
          <View style={styles.totalCaloriesContainer}>
            <Text style={styles.totalCaloriesLabel}>총 칼로리</Text>
            <Text style={styles.totalCalories}>{meal.totalCalories} kcal</Text>
          </View>
        </View>

        {/* 영양소 슬라이더 섹션 */}
        <View style={styles.ingredientsSection}>
          <Text style={styles.sectionTitle}>영양소 조절</Text>
          {meal.ingredients.map((ingredient, index) =>
            renderIngredient(ingredient, index)
          )}
        </View>

        {/* 오늘식단 버튼 */}
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.8}
          onPress={handleAddToToday}
        >
          <Text style={styles.addButtonText}>오늘식단에 추가</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 60,
    marginBottom: 16,
  },
  mealName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  totalCaloriesContainer: {
    backgroundColor: '#5FA777',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  totalCaloriesLabel: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 4,
  },
  totalCalories: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  ingredientsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  ingredientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  ingredientCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5FA777',
  },
  ingredientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 12,
    color: '#888',
  },
  amountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  addButton: {
    backgroundColor: '#5FA777',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});
