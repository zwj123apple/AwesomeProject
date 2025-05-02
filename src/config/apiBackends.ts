/**
 * API后端配置
 * 集中管理所有API后端的配置信息
 */

import { ApiBackendConfig } from '../services/api.service';

// 默认超时时间（毫秒）
export const DEFAULT_TIMEOUT = 10000;

// 默认后端ID
export const DEFAULT_BACKEND_ID = 'default';

// 环境配置
const ENV = {
  DEV: 'development',
  TEST: 'testing',
  PROD: 'production',
};

// 当前环境（可以根据实际情况从环境变量或配置文件中获取）
const CURRENT_ENV = ENV.DEV;

// 根据环境获取基础URL
const getBaseUrl = (env: string, service: string): string => {
  switch (env) {
    case ENV.PROD:
      return `https://api.example.com/${service}`;
    case ENV.TEST:
      return `https://test-api.example.com/${service}`;
    case ENV.DEV:
    default:
      return `https://dev-api.example.com/${service}`;
  }
};

// API后端配置列表
const API_BACKENDS: ApiBackendConfig[] = [
  // 默认后端（用户服务）
  {
    id: DEFAULT_BACKEND_ID,
    name: '用户服务',
    baseURL: getBaseUrl(CURRENT_ENV, 'users'),
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // 产品服务后端
  {
    id: 'backend2',
    name: '产品服务',
    baseURL: getBaseUrl(CURRENT_ENV, 'products'),
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // 订单服务后端
  {
    id: 'backend3',
    name: '订单服务',
    baseURL: getBaseUrl(CURRENT_ENV, 'orders'),
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  },
];

/**
 * 获取所有API后端配置
 * @returns API后端配置列表
 */
export const getApiBackends = (): ApiBackendConfig[] => {
  return API_BACKENDS;
};

/**
 * 根据ID获取API后端配置
 * @param id 后端ID
 * @returns API后端配置，如果未找到则返回默认配置
 */
export const getApiBackendById = (id: string): ApiBackendConfig => {
  const backend = API_BACKENDS.find(backend => backend.id === id);
  if (!backend) {
    console.warn(`未找到ID为"${id}"的后端配置，将使用默认配置`);
    return API_BACKENDS.find(backend => backend.id === DEFAULT_BACKEND_ID)!;
  }
  return backend;
};

/**
 * 创建自定义后端配置
 * @param id 后端ID
 * @param name 后端名称
 * @param baseURL 基础URL
 * @param options 其他选项
 * @returns API后端配置
 */
export const createCustomBackend = (
  id: string,
  name: string,
  baseURL: string,
  options?: {
    timeout?: number;
    headers?: Record<string, string>;
  }
): ApiBackendConfig => {
  return {
    id,
    name,
    baseURL,
    timeout: options?.timeout || DEFAULT_TIMEOUT,
    headers: options?.headers || { 'Content-Type': 'application/json' },
  };
};

export default API_BACKENDS;