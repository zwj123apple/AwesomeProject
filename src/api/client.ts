/**
 * API客户端
 * 处理与后端API的通信基础设施
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types';
import { getData, removeData, STORAGE_KEYS } from '../utils/storage';
import { refreshToken } from '../services/tokenRefresh';

// API后端配置类型
export interface ApiBackendConfig {
  id: string;         // 后端唯一标识
  name: string;       // 后端名称
  baseURL: string;    // 后端基础URL
  timeout?: number;   // 超时时间(毫秒)
  headers?: Record<string, string>; // 默认请求头
}

/**
 * API客户端工厂
 * 用于创建和管理多个API客户端实例
 */
class ApiClientFactory {
  private clients: Map<string, AxiosInstance> = new Map();
  private configs: Map<string, ApiBackendConfig> = new Map();

  /**
   * 初始化API客户端工厂
   * @param backends 后端配置列表
   * @param defaultBackendId 默认后端ID
   */
  initialize(backends: ApiBackendConfig[], defaultBackendId: string): void {
    // 初始化配置
    backends.forEach(config => {
      this.configs.set(config.id, config);
    });
  }

  

  /**
   * 获取API客户端实例
   * @param backendId 后端ID，不指定则使用默认后端
   * @param defaultBackendId 默认后端ID
   * @returns API客户端实例
   */
  getClient(backendId: string, defaultBackendId: string): AxiosInstance {
    const finalBackendId = backendId || defaultBackendId;
    
    // 检查是否已创建该后端的客户端实例
    if (!this.clients.has(finalBackendId)) {
      // 获取后端配置
      const config = this.configs.get(finalBackendId);
      if (!config) {
        throw new Error(`未找到ID为"${finalBackendId}"的后端配置`);
      }

      // 创建新的客户端实例
      const client = this.createClient(config);
      this.clients.set(finalBackendId, client);
    }

    return this.clients.get(finalBackendId)!;
  }

  /**
   * 创建API客户端实例
   * @param config 后端配置
   * @returns API客户端实例
   */
  private createClient(config: ApiBackendConfig): AxiosInstance {
    // 创建axios实例
    const client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
      headers: config.headers || { 'Content-Type': 'application/json' },
    });

    // 添加请求拦截器
    client.interceptors.request.use(
      async (axiosConfig) => {
        // 从本地存储获取token
        try {
          const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
          if (token) {
            axiosConfig.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('获取token失败:', error);
        }
        return axiosConfig;
      },
      (error) => Promise.reject(error)
    );

    // 添加响应拦截器
    client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const apiError: ApiError = {
          code: 'UNKNOWN_ERROR',
          message: '未知错误',
        };

        // 原始请求配置
        const originalRequest = error.config;

        if (error.response) {
          // 服务器返回错误
          apiError.code = `ERROR_${error.response.status}`;
          apiError.message = error.response.data?.message || `服务器错误 (${error.response.status})`;
          apiError.details = error.response.data;

          // 处理401未授权错误（令牌过期）
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
              // 使用顶部导入的令牌刷新服务
              // 尝试刷新令牌
              const newToken = await refreshToken();
              
              if (newToken) {
                // 更新原始请求的Authorization头
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                // 重试原始请求
                return axios(originalRequest);
              } else {
                // 刷新令牌失败，清除本地token
                try {
                  removeData(STORAGE_KEYS.AUTH_TOKEN);
                  removeData(STORAGE_KEYS.REFRESH_TOKEN);
                } catch (error) {
                  console.error('移除token失败:', error);
                }
                // 这里可以添加重定向到登录页的逻辑
              }
            } catch (refreshError) {
              console.error('刷新令牌失败:', refreshError);
              // 清除本地token
              try {
                removeData(STORAGE_KEYS.AUTH_TOKEN);
                removeData(STORAGE_KEYS.REFRESH_TOKEN);
              } catch (error) {
                console.error('移除token失败:', error);
              }
            }
          }
        } else if (error.request) {
          // 请求发送但没有收到响应
          apiError.code = 'NETWORK_ERROR';
          apiError.message = '网络错误，请检查您的网络连接';
        } else {
          // 请求设置时出错
          apiError.code = 'REQUEST_ERROR';
          apiError.message = error.message;
        }

        return Promise.reject(apiError);
      }
    );

    return client;
  }
  
  /**
   * 添加或更新后端配置
   * @param config 后端配置
   */
  addBackend(config: ApiBackendConfig): void {
    this.configs.set(config.id, config);
    // 如果已存在该后端的客户端实例，则移除以便下次使用时重新创建
    if (this.clients.has(config.id)) {
      this.clients.delete(config.id);
    }
  }

  /**
   * 获取所有后端配置
   * @returns 后端配置列表
   */
  getBackends(): ApiBackendConfig[] {
    return Array.from(this.configs.values());
  }

}

// 创建API客户端工厂实例
export const apiClientFactory = new ApiClientFactory();