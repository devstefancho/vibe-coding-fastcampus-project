import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../navigation/HomeStack';
import { loadMeals, saveMeals } from '../lib/storage';
import { getInitialMealsWithCalories } from '../lib/initialData';
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

type HomeScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList, 'HomeList'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeMeals();
  }, []);

  const initializeMeals = async () => {
    try {
      let savedMeals = await loadMeals();

      // 데이터가 없으면 초기 데이터 생성
      if (savedMeals.length === 0) {
        const initialMeals = getInitialMealsWithCalories();
        await saveMeals(initialMeals);
        savedMeals = initialMeals;
      }

      setMeals(savedMeals);
    } catch (error) {
      console.error('Failed to load meals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMealPress = (meal: Meal) => {
    navigation.navigate('MealDetail', { meal });
  };

  const renderMealCard = ({ item }: { item: Meal }) => {
    const IconComponent = iconMap[item.icon];

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => handleMealPress(item)}
      >
        <View style={styles.iconContainer}>
          {IconComponent && <IconComponent size={60} />}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.calories}>{item.totalCalories} kcal</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#5FA777" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        renderItem={renderMealCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    padding: 16,
  },
  card: {
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
  },
  iconContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  calories: {
    fontSize: 16,
    color: '#5FA777',
    fontWeight: '600',
  },
});
