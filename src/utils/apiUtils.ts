/**
 * API工具函数
 * 提供多后端API服务的辅助功能
 */

import  {apiService, ApiBackendConfig } from '../services/api.service';
import { ApiError, ApiResponse } from '../types';

/**
 * 后端选择器配置
 */
export interface BackendSelectorConfig {
  defaultBackendId: string;
  selectionRules?: BackendSelectionRule[];
}

/**
 * 后端选择规则
 */
export interface BackendSelectionRule {
  condition: () => boolean | Promise<boolean>;
  backendId: string;
  priority: number; // 优先级，数字越大优先级越高
}

/**
 * 创建后端选择器
 * @param config 选择器配置
 * @returns 后端选择函数
 */
export const createBackendSelector = (config: BackendSelectorConfig) => {
  return async (): Promise<string> => {
    // 如果没有选择规则，直接返回默认后端
    if (!config.selectionRules || config.selectionRules.length === 0) {
      return config.defaultBackendId;
    }

    // 按优先级排序规则（从高到低）
    const sortedRules = [...config.selectionRules].sort((a, b) => b.priority - a.priority);

    // 依次评估每个规则
    for (const rule of sortedRules) {
      try {
        const result = await Promise.resolve(rule.condition());
        if (result) {
          return rule.backendId;
        }
      } catch (error) {
        console.error('评估后端选择规则失败:', error);
        // 继续评估下一个规则
      }
    }

    // 如果没有规则匹配，返回默认后端
    return config.defaultBackendId;
  };
};

/**
 * 创建带有自动后端选择的API服务
 * @param backendSelector 后端选择器
 * @returns 增强的API服务
 */
export const createApiServiceWithSelector = (backendSelector: () => Promise<string>) => {
  return {
    async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
      const backendId = await backendSelector();
      return apiService.get<T>(url, config, backendId);
    },

    async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
      const backendId = await backendSelector();
      return apiService.post<T>(url, data, config, backendId);
    },

    async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
      const backendId = await backendSelector();
      return apiService.put<T>(url, data, config, backendId);
    },

    async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
      const backendId = await backendSelector();
      return apiService.delete<T>(url, config, backendId);
    },
  };
};

/**
 * 统一错误处理包装器
 * @param apiCall API调用函数
 * @returns 包含数据和错误的结果对象
 */
export const withErrorHandling = <T>(apiCall: () => Promise<ApiResponse<T>>) => {
  return async (): Promise<{ data: T | null; error: ApiError | null }> => {
    try {
      const response = await apiCall();
      return { data: response.data, error: null };
    } catch (error: any) {
      const apiError: ApiError = {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || '未知错误',
        details: error.details,
      };
      return { data: null, error: apiError };
    }
  };
};

/**
 * 创建特定领域的API服务
 * @param domainName 领域名称
 * @param backendId 后端ID
 * @returns 特定领域的API服务
 */
export const createDomainApiService = (domainName: string, backendId: string) => {
  const basePath = `/${domainName}`;
  
  return {
    getAll: async <T>(config?: any): Promise<ApiResponse<T>> => {
      return apiService.get<T>(basePath, config, backendId);
    },
    
    getById: async <T>(id: string, config?: any): Promise<ApiResponse<T>> => {
      return apiService.get<T>(`${basePath}/${id}`, config, backendId);
    },
    
    create: async <T>(data: any, config?: any): Promise<ApiResponse<T>> => {
      return apiService.post<T>(basePath, data, config, backendId);
    },
    
    update: async <T>(id: string, data: any, config?: any): Promise<ApiResponse<T>> => {
      return apiService.put<T>(`${basePath}/${id}`, data, config, backendId);
    },
    
    delete: async <T>(id: string, config?: any): Promise<ApiResponse<T>> => {
      return apiService.delete<T>(`${basePath}/${id}`, config, backendId);
    },
    
    custom: async <T>(path: string, method: 'get' | 'post' | 'put' | 'delete', data?: any, config?: any): Promise<ApiResponse<T>> => {
      const fullPath = `${basePath}/${path}`;
      
      switch (method) {
        case 'get':
          return apiService.get<T>(fullPath, config, backendId);
        case 'post':
          return apiService.post<T>(fullPath, data, config, backendId);
        case 'put':
          return apiService.put<T>(fullPath, data, config, backendId);
        case 'delete':
          return apiService.delete<T>(fullPath, config, backendId);
      }
    },
  };
};

/**
 * 创建带有缓存的API服务
 * @param ttlMs 缓存有效期（毫秒）
 * @returns 带有缓存的API服务
 */
export const createCachedApiService = (ttlMs: number = 60000) => {
  const cache = new Map<string, { data: any; timestamp: number }>();
  
  const getCacheKey = (url: string, backendId?: string) => `${backendId || 'default'}:${url}`;
  
  const isCacheValid = (timestamp: number) => {
    return Date.now() - timestamp < ttlMs;
  };
  
  return {
    async get<T>(url: string, config?: any, backendId?: string): Promise<ApiResponse<T>> {
      const cacheKey = getCacheKey(url, backendId);
      
      // 检查缓存
      const cachedItem = cache.get(cacheKey);
      if (cachedItem && isCacheValid(cachedItem.timestamp)) {
        return cachedItem.data;
      }
      
      // 缓存未命中或已过期，发起请求
      const response = await apiService.get<T>(url, config, backendId);
      
      // 更新缓存
      cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
      
      return response;
    },
    
    // 其他方法不缓存，直接转发
    async post<T>(url: string, data?: any, config?: any, backendId?: string): Promise<ApiResponse<T>> {
      // POST请求通常会改变服务器状态，因此需要清除相关缓存
      const cacheKeyPrefix = `${backendId || 'default'}:${url.split('/')[1]}`;
      
      // 清除可能受影响的缓存项
      for (const key of cache.keys()) {
        if (key.startsWith(cacheKeyPrefix)) {
          cache.delete(key);
        }
      }
      
      return apiService.post<T>(url, data, config, backendId);
    },
    
    async put<T>(url: string, data?: any, config?: any, backendId?: string): Promise<ApiResponse<T>> {
      // 同样清除相关缓存
      const cacheKeyPrefix = `${backendId || 'default'}:${url.split('/')[1]}`;
      
      for (const key of cache.keys()) {
        if (key.startsWith(cacheKeyPrefix)) {
          cache.delete(key);
        }
      }
      
      return apiService.put<T>(url, data, config, backendId);
    },
    
    async delete<T>(url: string, config?: any, backendId?: string): Promise<ApiResponse<T>> {
      // 同样清除相关缓存
      const cacheKeyPrefix = `${backendId || 'default'}:${url.split('/')[1]}`;
      
      for (const key of cache.keys()) {
        if (key.startsWith(cacheKeyPrefix)) {
          cache.delete(key);
        }
      }
      
      return apiService.delete<T>(url, config, backendId);
    },
    
    // 手动清除缓存
    clearCache(url?: string, backendId?: string) {
      if (url) {
        const cacheKey = getCacheKey(url, backendId);
        cache.delete(cacheKey);
      } else {
        cache.clear();
      }
    },
    
    // 获取缓存状态
    getCacheStatus() {
      return {
        size: cache.size,
        keys: Array.from(cache.keys()),
        items: Array.from(cache.entries()).map(([key, value]) => ({
          key,
          age: Date.now() - value.timestamp,
          isValid: isCacheValid(value.timestamp)
        }))
      };
    }
  };
};