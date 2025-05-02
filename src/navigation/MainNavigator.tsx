import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';
import { useAuth } from '../hooks/useAuth';
import HomeScreen from '../screens/Dashboard/DashboardScreen.tsx';
import CommunityScreen from '../screens/Products/ProductListScreen.tsx';
import ProfileScreen from '../screens/Profile/ProfileScreen.tsx';
import TransactionScreen from '../screens/Transaction/TransactionScreen';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 首页堆栈导航
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name={ROUTES.TRANSACTION} 
        component={TransactionScreen} 
        options={{ title: '交易记录' }}
      />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isAuthenticated } = useAuth();

  // 处理需要登录的页面访问
  const handleProtectedScreen = (navigation: any) => {
    if (!isAuthenticated) {
      Alert.alert('需要登录', '请先登录以访问此功能', [
        { text: '取消', style: 'cancel' },
        { text: '去登录', onPress: () => navigation.navigate('Auth') }
      ]);
      return false;
    }
    return true;
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: true,
      }}
    >
      <Tab.Screen 
        name={ROUTES.HOME} 
        component={HomeStack} 
        options={{
          title: '首页',
        }}
      />
      <Tab.Screen 
        name={ROUTES.COMMUNITY} 
        component={CommunityScreen}
        options={{
          title: '社区',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!handleProtectedScreen(navigation)) {
              e.preventDefault();
            }
          },
        })}
      />
      <Tab.Screen 
        name={ROUTES.PROFILE} 
        component={ProfileScreen}
        options={{
          title: '我的',
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (!handleProtectedScreen(navigation)) {
              e.preventDefault();
            }
          },
        })}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;