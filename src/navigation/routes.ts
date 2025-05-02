// 定义应用中所有导航路径的名称
export type RootStackParamList = {
  HomeScreen: { screen: 'Transaction' | 'AnotherTabScreen' }; // 指定 HomeScreen 内部可以导航到的子屏幕
  // ... 其他屏幕
};
export const ROUTES = {
  // 认证相关
  AUTH: 'Auth',
  LOGIN: 'Login',
  REGISTER: 'Register',
  
  // 主导航
  MAIN: 'Main',
  
  // 底部标签导航
  HOME: 'Home',
  COMMUNITY: 'Community',
  PROFILE: 'Profile',
  
  // 功能页面
  TRANSACTION: 'Transaction',
};