/**
 * 8080端口API服务
 * 提供统一的API请求方法，专门用于8080端口的后端服务
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';
import { apiClientFactory, ApiBackendConfig } from './client';
import { BACKEND_IDS } from '../config/apiConfig'; // 保持这个导入，因为它在config/apiConfig.ts中定义

/**
 * 8080端口API服务
 * 提供统一的HTTP请求方法，固定使用8080端口的后端服务
 */
export const api8080Service = {
  /**
   * GET请求
   * @param url 请求URL
   * @param config 请求配置
   * @returns 响应数据
   */
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(BACKEND_IDS.PORT_8080, BACKEND_IDS.PORT_8080);
    const response: AxiosResponse<ApiResponse<T>> = await client.get(url, config);
    return response.data;
  },

  /**
   * POST请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(BACKEND_IDS.PORT_8080, BACKEND_IDS.PORT_8080);
    const response: AxiosResponse<ApiResponse<T>> = await client.post(url, data, config);
    return response.data;
  },

  /**
   * PUT请求
   * @param url 请求URL
   * @param data 请求数据
   * @param config 请求配置
   * @returns 响应数据
   */
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(BACKEND_IDS.PORT_8080, BACKEND_IDS.PORT_8080);
    const response: AxiosResponse<ApiResponse<T>> = await client.put(url, data, config);
    return response.data;
  },

  /**
   * DELETE请求
   * @param url 请求URL
   * @param config 请求配置
   * @returns 响应数据
   */
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const client = apiClientFactory.getClient(BACKEND_IDS.PORT_8080, BACKEND_IDS.PORT_8080);
    const response: AxiosResponse<ApiResponse<T>> = await client.delete(url, config);
    return response.data;
  },

  /**
   * 获取8080端口后端配置
   * @returns 后端配置
   */
  getBackendConfig(): ApiBackendConfig {
    return apiClientFactory.getBackends().find(backend => backend.id === BACKEND_IDS.PORT_8080)!;
  }
};