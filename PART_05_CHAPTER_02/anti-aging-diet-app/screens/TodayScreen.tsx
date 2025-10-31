import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getDailyLogByDate, removeMealFromDate } from '../lib/storage';
import { Meal } from '../lib/types';
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

export const TodayScreen = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [todayDate, setTodayDate] = useState('');

  // 오늘 날짜 가져오기
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 날짜 포맷팅 (표시용)
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    return `${month}월 ${day}일 (${weekDay})`;
  };

  // 오늘의 식단 불러오기
  const loadTodayMeals = async () => {
    try {
      const today = getTodayDate();
      setTodayDate(today);

      const dailyLog = await getDailyLogByDate(today);
      if (dailyLog) {
        setMeals(dailyLog.meals);
        setTotalCalories(dailyLog.totalCalories);
      } else {
        setMeals([]);
        setTotalCalories(0);
      }
    } catch (error) {
      console.error('Failed to load today meals:', error);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadTodayMeals();
    }, [])
  );

  // 식단 삭제
  const handleDeleteMeal = (mealId: string, mealName: string) => {
    Alert.alert(
      '삭제 확인',
      `"${mealName}"을(를) 삭제하시겠습니까?`,
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
              await removeMealFromDate(todayDate, mealId);
              await loadTodayMeals();
            } catch (error) {
              Alert.alert('오류', '식단 삭제에 실패했습니다.');
              console.error('Failed to delete meal:', error);
            }
          },
        },
      ]
    );
  };

  const renderMealItem = ({ item }: { item: Meal }) => {
    const IconComponent = iconMap[item.icon];

    return (
      <View style={styles.mealCard}>
        <View style={styles.mealContent}>
          <View style={styles.iconContainer}>
            {IconComponent && <IconComponent size={50} />}
          </View>
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.calories}>{item.totalCalories} kcal</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMeal(item.id, item.name)}
        >
          <Text style={styles.deleteButtonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>오늘 먹은 식단이 없습니다</Text>
      <Text style={styles.emptySubText}>홈 화면에서 식단을 추가해보세요</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 날짜 헤더 */}
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDate(todayDate)}</Text>
        <View style={styles.totalCaloriesContainer}>
          <Text style={styles.totalCaloriesLabel}>오늘 섭취 칼로리</Text>
          <Text style={styles.totalCalories}>{totalCalories} kcal</Text>
        </View>
      </View>

      {/* 식단 목록 */}
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
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
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  totalCaloriesContainer: {
    backgroundColor: '#5FA777',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalCaloriesLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  totalCalories: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    flexGrow: 1,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  mealContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calories: {
    fontSize: 14,
    color: '#5FA777',
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#AAA',
  },
});
