import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { MealDetailScreen } from '../screens/MealDetailScreen';
import { Meal } from '../lib/types';

export type HomeStackParamList = {
  HomeList: undefined;
  MealDetail: { meal: Meal };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#5FA777',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="HomeList"
        component={HomeScreen}
        options={{ title: '홈' }}
      />
      <Stack.Screen
        name="MealDetail"
        component={MealDetailScreen}
        options={{ title: '식단 상세' }}
      />
    </Stack.Navigator>
  );
};
