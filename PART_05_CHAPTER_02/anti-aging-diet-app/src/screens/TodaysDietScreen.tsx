import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getDailyLog, removeMealFromDate } from '../lib/storage';
import { DailyLog, Meal } from '../types';
import { FoodIcon } from '../components/icons';
import { colors, shadows } from '../constants/colors';

export const TodaysDietScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const loadTodayLog = async () => {
    try {
      setLoading(true);
      const log = await getDailyLog(today);
      setTodayLog(log);
    } catch (error) {
      console.error('Error loading today log:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadTodayLog();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadTodayLog();
  };

  const handleDeleteMeal = (meal: Meal) => {
    Alert.alert(
      '식단 삭제',
      `${meal.name}을(를) 오늘 식단에서 삭제하시겠습니까?`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMealFromDate(today, meal.id);
              await loadTodayLog();
              Alert.alert('삭제 완료', '식단이 삭제되었습니다.');
            } catch (error) {
              console.error('Error deleting meal:', error);
              Alert.alert('오류', '식단 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealCard}>
      <View style={styles.mealContent}>
        <View style={styles.iconContainer}>
          <FoodIcon name={item.icon} size={50} />
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.calories}>{item.totalCalories} kcal</Text>
          <Text style={styles.ingredientList}>
            {item.ingredients.map((ing) => ing.name).join(', ')}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteMeal(item)}
        activeOpacity={0.7}
      >
        <Text style={styles.deleteButtonText}>삭제</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>오늘 식단을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  const totalCalories = todayLog?.totalCalories || 0;
  const mealsCount = todayLog?.meals.length || 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.headerTitle}>오늘의 식단</Text>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      {/* 총 칼로리 카드 */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>총 섭취 칼로리</Text>
          <Text style={styles.summaryValue}>{totalCalories} kcal</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>식사 횟수</Text>
          <Text style={styles.summaryValue}>{mealsCount}회</Text>
        </View>
      </View>

      {/* 식단 목록 */}
      <FlatList
        data={todayLog?.meals || []}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🍽️</Text>
            <Text style={styles.emptyText}>
              아직 오늘 식단이 기록되지 않았습니다
            </Text>
            <Text style={styles.emptySubtext}>
              홈 화면에서 식단을 선택하여 추가하세요
            </Text>
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
  dateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 20,
    ...shadows.medium,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: colors.surface,
    marginBottom: 8,
    opacity: 0.9,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.surface,
  },
  divider: {
    width: 1,
    backgroundColor: colors.surface,
    opacity: 0.3,
    marginHorizontal: 16,
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  mealContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 30,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
    justifyContent: 'center',
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
    marginBottom: 4,
  },
  ingredientList: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: colors.error,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-end',
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.surface,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
