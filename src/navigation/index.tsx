import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator.tsx';
import MainNavigator from './MainNavigator.tsx';

const Stack = createStackNavigator();

const AppNavigator = () => {
  // 不再使用isAuthenticated来决定显示哪个导航器
  // 而是始终显示MainNavigator，在MainNavigator中处理权限验证
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainNavigator} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;