import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Slider from '@react-native-community/slider';
import { RootStackParamList, TabParamList } from '../navigation/types';
import { Meal, Ingredient } from '../types';
import { addMealToDate } from '../lib/storage';
import { updateIngredientAmount } from '../data/sampleMeals';
import { FoodIcon } from '../components/icons';
import { colors, shadows } from '../constants/colors';

type MealDetailRouteProp = RouteProp<RootStackParamList, 'MealDetail'>;
type NavigationProp = BottomTabNavigationProp<TabParamList, 'TodaysDiet'>;

export const MealDetailScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute<MealDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [meal, setMeal] = useState<Meal>(route.params.meal);
  const [saving, setSaving] = useState(false);

  const handleSliderChange = (ingredientIndex: number, value: number) => {
    const updatedMeal = updateIngredientAmount(meal, ingredientIndex, value);
    setMeal(updatedMeal);
  };

  const handleAddToToday = async () => {
    try {
      setSaving(true);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

      // 현재 설정된 식단을 오늘 날짜로 저장
      const mealToSave: Meal = {
        ...meal,
        id: `${meal.id}-${Date.now()}`, // 새로운 ID 생성 (중복 방지)
      };

      await addMealToDate(today, mealToSave);

      Alert.alert(
        '저장 완료',
        `${meal.name}이(가) 오늘 식단에 추가되었습니다.\n총 ${meal.totalCalories} kcal`,
        [
          {
            text: '확인',
            onPress: () => {
              // 오늘식단 탭으로 이동
              navigation.navigate('MainTabs', { screen: 'TodaysDiet' });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error adding meal:', error);
      Alert.alert('오류', '식단 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const renderIngredientSlider = (ingredient: Ingredient, index: number) => (
    <View key={index} style={styles.ingredientContainer}>
      <View style={styles.ingredientHeader}>
        <Text style={styles.ingredientName}>{ingredient.name}</Text>
        <Text style={styles.ingredientCalories}>
          {ingredient.currentCalories} kcal
        </Text>
      </View>

      <View style={styles.sliderInfo}>
        <Text style={styles.infoText}>
          {ingredient.caloriesPerUnit} kcal/100g
        </Text>
        <Text style={styles.amountText}>{Math.round(ingredient.amount)}g</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={300}
        value={ingredient.amount}
        onValueChange={(value) => handleSliderChange(index, value)}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
        step={5}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 식단 헤더 */}
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <FoodIcon name={meal.icon} size={80} />
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
          <Text style={styles.sectionSubtitle}>
            슬라이더를 조절하여 재료의 양을 설정하세요
          </Text>

          {meal.ingredients.map((ingredient, index) =>
            renderIngredientSlider(ingredient, index)
          )}
        </View>
      </ScrollView>

      {/* 하단 버튼 */}
      <View style={[styles.bottomButtonContainer, { paddingBottom: 16 + insets.bottom }]}>
        <TouchableOpacity
          style={[styles.addButton, saving && styles.addButtonDisabled]}
          onPress={handleAddToToday}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            {saving ? '저장 중...' : '오늘식단에 추가'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    ...shadows.small,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 50,
    marginBottom: 16,
  },
  mealName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  totalCaloriesContainer: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  totalCaloriesLabel: {
    fontSize: 12,
    color: colors.surface,
    marginBottom: 2,
  },
  totalCalories: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
  },
  ingredientsSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  ingredientContainer: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...shadows.small,
  },
  ingredientHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  ingredientCalories: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  sliderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  amountText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  bottomButtonContainer: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    ...shadows.large,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    ...shadows.medium,
  },
  addButtonDisabled: {
    backgroundColor: colors.textLight,
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.surface,
  },
});
