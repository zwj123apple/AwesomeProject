/**
 * 令牌刷新服务
 * 处理访问令牌过期和自动刷新
 */

import { getData, storeData, STORAGE_KEYS } from '../utils/storage';
import mockApi from '../api/mockApi';

// 令牌刷新状态
let isRefreshing = false;
// 等待令牌刷新的回调队列
let refreshSubscribers: Array<(token: string) => void> = [];

/**
 * 订阅令牌刷新
 * @param callback 令牌刷新后的回调函数
 */
export const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

/**
 * 通知所有订阅者令牌已刷新
 * @param token 新的访问令牌
 */
export const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

/**
 * 刷新访问令牌
 * @returns 新的访问令牌
 */
export const refreshToken = async (): Promise<string | null> => {
  try {
    // 如果已经在刷新中，则等待刷新完成
    if (isRefreshing) {
      return new Promise<string | null>(resolve => {
        subscribeTokenRefresh(token => {
          resolve(token);
        });
      });
    }
    
    isRefreshing = true;
    
    // 获取刷新令牌
    const refreshToken = await getData(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      // 首次启动时可能没有刷新令牌，不抛出错误，而是返回null
      console.log('刷新令牌不存在，可能是首次启动');
      isRefreshing = false;
      return null;
    }
    
    // 调用刷新令牌API
    const response = await mockApi.refreshToken(refreshToken as string);
    
    if (!response.success || !response.data.token) {
      throw new Error(response.error?.message || '刷新令牌失败');
    }
    
    // 存储新的访问令牌
    const newToken = response.data.token;
    await storeData(STORAGE_KEYS.AUTH_TOKEN, newToken);
    
    // 通知所有等待的请求
    onTokenRefreshed(newToken);
    
    isRefreshing = false;
    return newToken;
  } catch (error) {
    isRefreshing = false;
    console.error('刷新令牌失败:', error);
    // 刷新失败，清除所有令牌，用户需要重新登录
    await clearTokens();
    return null;
  }
};

/**
 * 清除所有令牌
 */
export const clearTokens = async () => {
  try {
    await Promise.all([
      storeData(STORAGE_KEYS.AUTH_TOKEN, null),
      storeData(STORAGE_KEYS.REFRESH_TOKEN, null),
      storeData(STORAGE_KEYS.USER_INFO, null),
    ]);
  } catch (error) {
    console.error('清除令牌失败:', error);
  }
};

/**
 * 检查令牌是否有效
 * @returns 令牌是否有效
 */
export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
    if (!token) return false;
    
    // 验证令牌
    const response = await mockApi.validateToken(token as string);
    
    // 如果令牌即将过期（小于5分钟），主动刷新令牌
    // 这样可以减少用户遇到登录过期提示的频率
    if (response.success && response.data?.expiresIn && response.data.expiresIn < 5 * 60 * 1000) {
      console.log('令牌即将过期，主动刷新');
      // 异步刷新令牌，不阻塞当前流程
      refreshToken().catch(err => console.error('主动刷新令牌失败:', err));
    }
    
    return response.success;
  } catch (error) {
    console.error('验证令牌失败:', error);
    return false;
  }
};