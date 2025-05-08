import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from './routes';
import { useAuth } from '../hooks/useAuth';
import HomeScreen from '../screens/Dashboard/DashboardScreen.tsx';
import CommunityScreen from '../screens/Products/ProductListScreen.tsx';
import ProfileScreen from '../screens/Profile/ProfileScreen.tsx';
import UserInfoScreen from '../screens/Profile/UserInfoScreen';
import PortfolioScreen from '../screens/Profile/PortfolioScreen';
import TransactionScreen from '../screens/Transaction/TransactionScreen';
import AssetAnalysisScreen from '../screens/AssetAnalysis/AssetAnalysisScreen';
import IncomeAnalysisScreen from '../screens/IncomeAnalysis/IncomeAnalysisScreen';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeIcon, CommunityIcon, ProfileIcon } from '../components/icons/TabIcons';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 首页堆栈导航
const HomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0, // 安卓去除阴影
          shadowOpacity: 0, // iOS去除阴影
        },
        headerTintColor: '#007AFF',
      }}
    >
      <Stack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ 
          headerShown: true,
          title: '首页'
        }}
      />
      <Stack.Screen 
        name={ROUTES.TRANSACTION} 
        component={TransactionScreen} 
        options={{
          title: '交易记录',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name={ROUTES.ASSET_ANALYSIS} 
        component={AssetAnalysisScreen} 
        options={{
          title: '资产分析',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name={ROUTES.INCOME_ANALYSIS} 
        component={IncomeAnalysisScreen} 
        options={{
          title: '收益分析',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

// 个人中心堆栈导航
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#007AFF',
      }}
    >
      <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ 
          headerShown: true,
          title: '个人中心'
        }}
      />
      <Stack.Screen 
        name={ROUTES.USER_INFO} 
        component={UserInfoScreen} 
        options={{
          title: '个人信息',
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name={ROUTES.PORTFOLIO} 
        component={PortfolioScreen} 
        options={{
          title: '持仓列表',
          headerShown: true,
        }}
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
        headerShown: false, // 默认隐藏Tab导航的头部
      }}
    >
      <Tab.Screen 
        name={ROUTES.HOME} 
        component={HomeStack} 
        options={{
          title: '首页',
          headerShown: false, // 使用Stack导航的头部而不是Tab导航的头部
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
        }}
      />
      <Tab.Screen 
        name={ROUTES.COMMUNITY} 
        component={CommunityScreen}
        options={{
          title: '社区',
          headerShown: true, // 显示社区页面的头部
          headerTitleAlign: 'center', // 确保标题居中显示
          tabBarIcon: ({ color, size }) => <CommunityIcon color={color} size={size} />
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
        component={ProfileStack}
        options={{
          title: '我的',
          headerShown: false, // 使用Stack导航的头部
          tabBarIcon: ({ color, size }) => <ProfileIcon color={color} size={size} />
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