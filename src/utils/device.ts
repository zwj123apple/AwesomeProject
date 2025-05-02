/**
 * 设备和网络相关工具函数
 */

import { Dimensions, Platform, PixelRatio } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

/**
 * 获取设备屏幕尺寸
 * @returns 屏幕宽高对象
 */
export const getScreenDimensions = () => {
  return {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };
};

/**
 * 检查当前设备是否为iOS
 * @returns 是否为iOS设备
 */
export const isIOS = (): boolean => {
  return Platform.OS === 'ios';
};

/**
 * 检查当前设备是否为Android
 * @returns 是否为Android设备
 */
export const isAndroid = (): boolean => {
  return Platform.OS === 'android';
};

/**
 * 获取设备像素比
 * @returns 设备像素比
 */
export const getPixelRatio = (): number => {
  return PixelRatio.get();
};

/**
 * 根据设备像素比计算像素大小
 * @param size 设计稿尺寸
 * @returns 适配后的尺寸
 */
export const normalizeSize = (size: number): number => {
  const pixelRatio = PixelRatio.get();
  return size / pixelRatio;
};

/**
 * 检查网络连接状态
 * @returns Promise，解析为网络状态对象
 */
export const checkNetworkConnection = async () => {
  try {
    const state = await NetInfo.fetch();
    return {
      isConnected: state.isConnected,
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular',
      details: state.details,
    };
  } catch (error) {
    console.error('检查网络状态失败:', error);
    return {
      isConnected: false,
      isWifi: false,
      isCellular: false,
      details: null,
    };
  }
};

/**
 * 监听网络状态变化
 * @param callback 状态变化回调函数
 * @returns 取消监听的函数
 */
export const subscribeNetworkChanges = (callback: (state: any) => void) => {
  return NetInfo.addEventListener(state => {
    callback({
      isConnected: state.isConnected,
      isWifi: state.type === 'wifi',
      isCellular: state.type === 'cellular',
      details: state.details,
    });
  });
};

/**
 * 获取设备系统版本
 * @returns 系统版本号
 */
export const getSystemVersion = (): string => {
  return Platform.Version.toString();
};

/**
 * 判断是否为平板设备
 * @returns 是否为平板
 */
export const isTablet = (): boolean => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  
  return (
    // 一般平板的宽度大于等于600dp
    (width >= 600 || height >= 600) &&
    // 平板的宽高比通常接近1:1
    aspectRatio > 0.6 && aspectRatio < 1.6
  );
};