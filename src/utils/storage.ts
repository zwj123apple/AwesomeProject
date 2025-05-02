/**
 * 存储工具函数
 * 用于处理AsyncStorage相关操作
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// 存储键名前缀
const STORAGE_PREFIX = '@AwesomeApp:';

/**
 * 存储数据
 * @param key 键名
 * @param value 要存储的值
 */
export const storeData = async <T>(key: string, value: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, jsonValue);
  } catch (error) {
    console.error('存储数据失败:', error);
    throw error;
  }
};

/**
 * 获取存储的数据
 * @param key 键名
 * @returns 存储的数据，如果不存在则返回null
 */
export const getData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('获取数据失败:', error);
    return null;
  }
};

/**
 * 移除存储的数据
 * @param key 键名
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error('移除数据失败:', error);
    throw error;
  }
};

/**
 * 清除所有存储的数据
 */
export const clearAllData = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const appKeys = keys.filter(key => key.startsWith(STORAGE_PREFIX));
    await AsyncStorage.multiRemove(appKeys);
  } catch (error) {
    console.error('清除所有数据失败:', error);
    throw error;
  }
};

/**
 * 获取所有存储的键
 * @returns 所有存储的键数组
 */
export const getAllKeys = async (): Promise<string[]> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    return keys.filter(key => key.startsWith(STORAGE_PREFIX));
  } catch (error) {
    console.error('获取所有键失败:', error);
    return [];
  }
};

// 常用存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'theme',
  LANGUAGE: 'language',
  ONBOARDING_COMPLETED: 'onboarding_completed',
};