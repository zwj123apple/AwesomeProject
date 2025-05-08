// 定义应用中所有导航路径的名称
export type RootStackParamList = {
  HomeScreen: { screen?: string };
  Transaction: undefined;
  AssetAnalysis: undefined;
  IncomeAnalysis: undefined;
  Auth: undefined;
  Login: undefined;
  Register: undefined;
  Community: undefined;
  Profile: undefined;
  UserInfo: undefined;
  Portfolio: undefined;
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
  ASSET_ANALYSIS: 'AssetAnalysis',
  INCOME_ANALYSIS: 'IncomeAnalysis',
  
  // 个人中心二级页面
  USER_INFO: 'UserInfo',
  PORTFOLIO: 'Portfolio',
};