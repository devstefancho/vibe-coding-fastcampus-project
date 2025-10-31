import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { getDailyLogByDate, getMarkedDates, loadDailyLogs } from '../lib/storage';
import { Meal, DailyLog } from '../lib/types';
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

export const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const [selectedDayLog, setSelectedDayLog] = useState<DailyLog | null>(null);

  // 날짜 포맷팅
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekDay = weekDays[date.getDay()];
    return `${month}월 ${day}일 (${weekDay})`;
  };

  // 달력 마커 로드
  const loadCalendarMarkers = async () => {
    try {
      const dates = await getMarkedDates();
      const markers: { [key: string]: any } = {};

      dates.forEach((date) => {
        markers[date] = {
          marked: true,
          dotColor: '#5FA777',
        };
      });

      setMarkedDates(markers);
    } catch (error) {
      console.error('Failed to load calendar markers:', error);
    }
  };

  // 특정 날짜의 식단 로드
  const loadDayMeals = async (date: string) => {
    try {
      const dailyLog = await getDailyLogByDate(date);
      setSelectedDayLog(dailyLog);
    } catch (error) {
      console.error('Failed to load day meals:', error);
    }
  };

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      loadCalendarMarkers();
      if (selectedDate) {
        loadDayMeals(selectedDate);
      }
    }, [selectedDate])
  );

  // 날짜 선택 핸들러
  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    loadDayMeals(day.dateString);
  };

  // 선택된 날짜 스타일 적용
  const getMarkedDatesWithSelected = () => {
    const markedWithSelected = { ...markedDates };

    if (selectedDate) {
      markedWithSelected[selectedDate] = {
        ...markedWithSelected[selectedDate],
        selected: true,
        selectedColor: '#5FA777',
      };
    }

    return markedWithSelected;
  };

  const renderMealItem = ({ item }: { item: Meal }) => {
    const IconComponent = iconMap[item.icon];

    return (
      <View style={styles.mealCard}>
        <View style={styles.iconContainer}>
          {IconComponent && <IconComponent size={40} />}
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.calories}>{item.totalCalories} kcal</Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        {selectedDate ? '이 날짜에 기록된 식단이 없습니다' : '날짜를 선택해주세요'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 달력 */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={getMarkedDatesWithSelected()}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#5FA777',
          selectedDayBackgroundColor: '#5FA777',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#5FA777',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#5FA777',
          selectedDotColor: '#ffffff',
          arrowColor: '#5FA777',
          monthTextColor: '#2d4150',
          indicatorColor: '#5FA777',
          textDayFontWeight: '400',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
          textDayFontSize: 14,
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
        style={styles.calendar}
      />

      {/* 선택된 날짜의 식단 목록 */}
      {selectedDate && (
        <View style={styles.selectedDaySection}>
          <View style={styles.selectedDayHeader}>
            <Text style={styles.selectedDayText}>{formatDate(selectedDate)}</Text>
            {selectedDayLog && (
              <Text style={styles.selectedDayCalories}>
                총 {selectedDayLog.totalCalories} kcal
              </Text>
            )}
          </View>

          <FlatList
            data={selectedDayLog?.meals || []}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.mealsList}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {!selectedDate && (
        <View style={styles.noSelectionContainer}>
          <Text style={styles.noSelectionText}>달력에서 날짜를 선택해주세요</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  calendar: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    paddingBottom: 10,
  },
  selectedDaySection: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  selectedDayHeader: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  selectedDayText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  selectedDayCalories: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5FA777',
  },
  mealsList: {
    padding: 16,
    flexGrow: 1,
  },
  mealCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calories: {
    fontSize: 12,
    color: '#5FA777',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
  noSelectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noSelectionText: {
    fontSize: 16,
    color: '#888',
  },
});
