import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import { loadDailyLogs, getDailyLog } from '../lib/storage';
import { DailyLog, MarkedDates } from '../types';
import { FoodIcon } from '../components/icons';
import { colors, shadows } from '../constants/colors';

export const CalendarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [markedDates, setMarkedDates] = useState<MarkedDates>({});
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<DailyLog | null>(null);
  const [loading, setLoading] = useState(true);

  const loadCalendarData = async () => {
    try {
      setLoading(true);
      const logs = await loadDailyLogs();

      // 식단이 기록된 날짜들을 마커로 표시
      const marked: MarkedDates = {};
      logs.forEach((log) => {
        marked[log.date] = {
          marked: true,
          dotColor: colors.markerColor,
        };
      });

      setMarkedDates(marked);
    } catch (error) {
      console.error('Error loading calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadCalendarData();
    }, [])
  );

  const handleDayPress = async (day: DateData) => {
    try {
      const dateString = day.dateString;
      setSelectedDate(dateString);

      // 선택된 날짜의 식단 로그 가져오기
      const log = await getDailyLog(dateString);
      setSelectedLog(log);

      // 선택된 날짜 하이라이트
      const updatedMarkedDates: MarkedDates = { ...markedDates };

      // 이전 선택 제거
      Object.keys(updatedMarkedDates).forEach((key) => {
        if (updatedMarkedDates[key].selected) {
          updatedMarkedDates[key] = {
            ...updatedMarkedDates[key],
            selected: false,
          };
        }
      });

      // 새로운 선택 추가
      updatedMarkedDates[dateString] = {
        ...updatedMarkedDates[dateString],
        selected: true,
        selectedColor: colors.selectedDayColor,
      };

      setMarkedDates(updatedMarkedDates);
    } catch (error) {
      console.error('Error loading day log:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>달력을 불러오는 중...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
        <Text style={styles.headerTitle}>식단 달력</Text>
        <Text style={styles.headerSubtitle}>
          날짜를 선택하여 식단 기록을 확인하세요
        </Text>
      </View>

      {/* 달력 */}
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: colors.surface,
            calendarBackground: colors.surface,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.selectedDayColor,
            selectedDayTextColor: colors.surface,
            todayTextColor: colors.primary,
            dayTextColor: colors.textPrimary,
            textDisabledColor: colors.textLight,
            dotColor: colors.markerColor,
            selectedDotColor: colors.surface,
            arrowColor: colors.primary,
            monthTextColor: colors.textPrimary,
            textDayFontWeight: '400',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>

      {/* 선택된 날짜의 식단 정보 */}
      <ScrollView style={styles.detailContainer} showsVerticalScrollIndicator={false}>
        {selectedDate && selectedLog ? (
          <View>
            <View style={styles.detailHeader}>
              <Text style={styles.detailDate}>
                {new Date(selectedDate).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
              <View style={styles.totalCaloriesBox}>
                <Text style={styles.totalCaloriesLabel}>총 칼로리</Text>
                <Text style={styles.totalCalories}>
                  {selectedLog.totalCalories} kcal
                </Text>
              </View>
            </View>

            {selectedLog.meals.map((meal, index) => (
              <View key={`${meal.id}-${index}`} style={styles.mealCard}>
                <View style={styles.mealHeader}>
                  <View style={styles.iconContainer}>
                    <FoodIcon name={meal.icon} size={40} />
                  </View>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <Text style={styles.mealCalories}>
                      {meal.totalCalories} kcal
                    </Text>
                  </View>
                </View>
                <View style={styles.ingredientsContainer}>
                  {meal.ingredients.map((ingredient, idx) => (
                    <Text key={idx} style={styles.ingredientText}>
                      • {ingredient.name} {Math.round(ingredient.amount)}g (
                      {ingredient.currentCalories}kcal)
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : selectedDate && !selectedLog ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyText}>
              {new Date(selectedDate).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Text style={styles.emptySubtext}>이 날짜에는 기록이 없습니다</Text>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📆</Text>
            <Text style={styles.emptyText}>날짜를 선택해주세요</Text>
            <Text style={styles.emptySubtext}>
              달력에서 날짜를 선택하면 식단을 확인할 수 있습니다
            </Text>
          </View>
        )}
      </ScrollView>
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
  calendarContainer: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    overflow: 'hidden',
    ...shadows.medium,
  },
  detailContainer: {
    flex: 1,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  detailHeader: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  detailDate: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  totalCaloriesBox: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  totalCaloriesLabel: {
    fontSize: 12,
    color: colors.surface,
    marginBottom: 4,
  },
  totalCalories: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.surface,
  },
  mealCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...shadows.small,
  },
  mealHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 25,
    marginRight: 12,
  },
  mealInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  ingredientsContainer: {
    paddingLeft: 8,
  },
  ingredientText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
