import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';
import LoginScreen from '../screens/Auth/LoginScreen.tsx';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8f8f8',
        },
        headerTitleStyle: {
          color: '#000',
        },
      }}
    >
      <Stack.Screen 
        name={ROUTES.LOGIN} 
        component={LoginScreen} 
        options={{
          title: '登录',
        }}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;