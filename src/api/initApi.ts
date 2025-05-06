/**
 * API服务初始化
 * 在应用启动时初始化API服务
 */

import { apiClientFactory } from './client';
import { API_BACKENDS, DEFAULT_BACKEND_ID } from '../config/apiConfig';

/**
 * 初始化API服务
 * 在应用启动时调用此函数
 */
export const initApiService = () => {
  // 初始化API客户端工厂，配置所有后端服务
  apiClientFactory.initialize(API_BACKENDS, DEFAULT_BACKEND_ID);
  
  console.log('API服务初始化完成，已配置后端服务：', API_BACKENDS.length);
};

/**
 * 获取API服务状态
 * @returns API服务状态信息
 */
export const getApiServiceStatus = () => {
  const backends = apiClientFactory.getBackends();
  return {
    initialized: backends.length > 0,
    backendsCount: backends.length,
    defaultBackendId: DEFAULT_BACKEND_ID
  };
};