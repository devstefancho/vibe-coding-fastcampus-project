import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Meal } from '../types';
import { loadMeals, saveMeals } from '../lib/storage';
import { SAMPLE_MEALS } from '../data/sampleMeals';
import { FoodIcon } from '../components/icons';
import { colors, shadows } from '../constants/colors';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const insets = useSafeAreaInsets();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  // 초기 데이터 로드
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const storedMeals = await loadMeals();

      if (storedMeals.length === 0) {
        // 저장된 데이터가 없으면 샘플 데이터 사용
        await saveMeals(SAMPLE_MEALS);
        setMeals(SAMPLE_MEALS);
      } else {
        setMeals(storedMeals);
      }
    } catch (error) {
      console.error('Error loading meals:', error);
    } finally {
      setLoading(false);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadInitialData();
    }, [])
  );

  const handleMealPress = (meal: Meal) => {
    navigation.navigate('MealDetail', { meal });
  };

  const renderMealCard = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleMealPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FoodIcon name={item.icon} size={60} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.mealName}>{item.name}</Text>
        <Text style={styles.calories}>{item.totalCalories} kcal</Text>
        <Text style={styles.ingredientCount}>
          {item.ingredients.length}가지 재료
        </Text>
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>식단 메뉴를 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.headerTitle}>저속노화 식단 메뉴</Text>
        <Text style={styles.headerSubtitle}>
          원하는 식단을 선택하여 영양소를 조절하세요
        </Text>
      </View>

      <FlatList
        data={meals}
        renderItem={renderMealCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>등록된 식단이 없습니다</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    ...shadows.small,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    ...shadows.medium,
  },
  iconContainer: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 35,
    marginRight: 16,
  },
  infoContainer: {
    flex: 1,
  },
  mealName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  calories: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: 2,
  },
  ingredientCount: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  arrowContainer: {
    paddingLeft: 8,
  },
  arrow: {
    fontSize: 28,
    color: colors.textLight,
    fontWeight: '300',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});
