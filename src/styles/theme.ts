/**
 * 全局主题样式
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// 颜色
export const colors = {
  // 主色调
  primary: '#4A90E2',
  primaryDark: '#3A7BC8',
  primaryLight: '#6BA5E9',
  
  // 辅助色
  secondary: '#6FCF97',
  secondaryDark: '#4CAF50',
  secondaryLight: '#A5D6A7',
  
  // 功能色
  success: '#27AE60',
  warning: '#F2C94C',
  error: '#EB5757',
  info: '#2D9CDB',
  
  // 中性色
  black: '#1A1A1A',
  darkGrey: '#4F4F4F',
  grey: '#828282',
  lightGrey: '#BDBDBD',
  veryLightGrey: '#E0E0E0',
  white: '#FFFFFF',
  
  // 背景色
  background: '#F9F9F9',
  cardBackground: '#FFFFFF',
  
  // 文本色
  textPrimary: '#1A1A1A',
  textSecondary: '#4F4F4F',
  textTertiary: '#828282',
  textDisabled: '#BDBDBD',
  
  // 边框色
  border: '#E0E0E0',
  divider: '#F2F2F2',
  
  // 透明色
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// 字体大小
export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};

// 间距
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// 圆角
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

// 阴影
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// 屏幕尺寸
export const screen = {
  width,
  height,
};

// 响应式尺寸
export const responsive = {
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
};

// 导出主题
export const theme = {
  colors,
  fontSizes,
  spacing,
  borderRadius,
  shadows,
  screen,
  responsive,
};

export default theme;