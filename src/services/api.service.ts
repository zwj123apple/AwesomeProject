/**
 * 多后端API服务
 * 处理与多个后端API的通信
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../types';
import { getData, removeData, STORAGE_KEYS } from '../utils/storage';

// API后端配置类型
export interface ApiBackendConfig {
  id: string;         // 后端唯一标识
  name: string;       // 后端名称
  baseURL: string;    // 后端基础URL
  timeout?: number;   // 超时时间(毫秒)
  headers?: Record<string, string>; // 默认请求头
}

// 导入集中管理的后端配置
import API_BACKENDS, { DEFAULT_BACKEND_ID, DEFAULT_TIMEOUT } from '../config/apiBackends';


/**
 * API客户端工厂
 * 用于创建和管理多个API客户端实例
 */
class ApiClientFactory {
  private clients: Map<string, AxiosInstance> = new Map();
  private configs: Map<string, ApiBackendConfig> = new Map();

  constructor() {
    // 初始化配置
    API_BACKENDS.forEach(config => {
      this.configs.set(config.id, config);
    });
  }

  /**
   * 获取API客户端实例
   * @param backendId 后端ID，不指定则使用默认后端
   * @returns API客户端实例
   */
  getClient(backendId: string = DEFAULT_BACKEND_ID): AxiosInstance {
    // 检查是否已创建该后端的客户端实例
    if (!this.clients.has(backendId)) {
      // 获取后端配置
      const config = this.configs.get(backendId);
      if (!config) {
        throw new Error(`未找到ID为"${backendId}"的后端配置`);
      }

      // 创建新的客户端实例
      const client = this.createClient(config);
      this.clients.set(backendId, client);
    }

    return this.clients.get(backendId)!;
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
      timeout: config.timeout || DEFAULT_TIMEOUT,
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
      (error) => {
        const apiError: ApiError = {
          code: 'UNKNOWN_ERROR',
          message: '未知错误',
        };

        if (error.response) {
          // 服务器返回错误
          apiError.code = `ERROR_${error.response.status}`;
          apiError.message = error.response.data.message || `服务器错误 (${error.response.status})`;
          apiError.details = error.response.data;

          // 处理401未授权错误
          if (error.response.status === 401) {
            // 清除本地token
            try {
              removeData(STORAGE_KEYS.AUTH_TOKEN);
            } catch (error) {
              console.error('移除token失败:', error);
            }
            // 这里可以添加重定向到登录页的逻辑
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
const apiClientFactory = new ApiClientFactory();

/**
 * 通用API服务
 */
export const apiService = {
  /**
   * GET请求
   * @param url 请求URL
   * @param config 请求配置
   * @param backendId 后端ID，不指定则使用默认后端
   * @returns 响应数据
   */
  async get<T>(url: string, config?: AxiosRequestConfig, backendId?: string): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(backendId);
    const response: AxiosResponse<ApiResponse<T>> = await client.get(url, config);
    return response.data;
  },

  /**
   * POST请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @param backendId 后端ID，不指定则使用默认后端
   * @returns 响应数据
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig, backendId?: string): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(backendId);
    const response: AxiosResponse<ApiResponse<T>> = await client.post(url, data, config);
    return response.data;
  },

  /**
   * PUT请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @param backendId 后端ID，不指定则使用默认后端
   * @returns 响应数据
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig, backendId?: string): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(backendId);
    const response: AxiosResponse<ApiResponse<T>> = await client.put(url, data, config);
    return response.data;
  },

  /**
   * DELETE请求
   * @param url 请求URL
   * @param config 请求配置
   * @param backendId 后端ID，不指定则使用默认后端
   * @returns 响应数据
   */
  async delete<T>(url: string, config?: AxiosRequestConfig, backendId?: string): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(backendId);
    const response: AxiosResponse<ApiResponse<T>> = await client.delete(url, config);
    return response.data;
  },

  /**
   * 获取所有可用的后端配置
   * @returns 后端配置列表
   */
  getAvailableBackends(): ApiBackendConfig[] {
    return apiClientFactory.getBackends();
  },

  /**
   * 添加或更新后端配置
   * @param config 后端配置
   */
  addBackend(config: ApiBackendConfig): void {
    apiClientFactory.addBackend(config);
  },
};

export default apiService;