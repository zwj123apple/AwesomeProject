/**
 * API配置文件
 * 定义不同后端服务的配置
 */

import { ApiBackendConfig } from '../api/client';

// 默认超时时间（毫秒）
export const DEFAULT_TIMEOUT = 10000;

// 后端服务ID
export const BACKEND_IDS = {
  PORT_5000: 'port5000',
  PORT_8080: 'port8080'
};

// 默认后端ID (端口5000)
export const DEFAULT_BACKEND_ID = BACKEND_IDS.PORT_5000;

// 环境配置
const ENV = {
  DEV: 'development',
  TEST: 'testing',
  PROD: 'production',
};

// 当前环境
const CURRENT_ENV = ENV.DEV;

// 根据环境获取基础URL
const getBaseUrl = (env: string, port: string): string => {
  switch (env) {
    case ENV.PROD:
      return `https://api.example.com:${port}`;
    case ENV.TEST:
      return `https://test-api.example.com:${port}`;
    case ENV.DEV:
    default:
      return `http://localhost:${port}`;
  }
};

// API后端配置列表
export const API_BACKENDS: ApiBackendConfig[] = [
  // 端口5000后端服务
  {
    id: BACKEND_IDS.PORT_5000,
    name: '5000端口服务',
    baseURL: getBaseUrl(CURRENT_ENV, '5000'),
    timeout: DEFAULT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  // 端口8080后端服务
  {
    id: BACKEND_IDS.PORT_8080,
    name: '8080端口服务',
    baseURL: getBaseUrl(CURRENT_ENV, '8080'),
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