/**
 * 通用API服务
 * 提供统一的API请求方法
 */

import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse } from '../types';
import { apiClientFactory, ApiBackendConfig } from './client';
import { DEFAULT_BACKEND_ID, BACKEND_IDS } from '../config/apiConfig';

/**
 * 通用API服务
 * 提供统一的HTTP请求方法
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
    const client = apiClientFactory.getClient(backendId || '', DEFAULT_BACKEND_ID);
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
    const client = apiClientFactory.getClient(backendId || '', DEFAULT_BACKEND_ID);
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
    const client = apiClientFactory.getClient(backendId || '', DEFAULT_BACKEND_ID);
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
    const client = apiClientFactory.getClient(backendId || '', DEFAULT_BACKEND_ID);
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

  /**
   * 初始化API服务
   * @param backends 后端配置列表
   * @param defaultBackendId 默认后端ID
   */
  initialize(backends: ApiBackendConfig[], defaultBackendId: string): void {
    apiClientFactory.initialize(backends, defaultBackendId);
  }
};