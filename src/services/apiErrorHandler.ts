import { Alert } from 'react-native';

// 定义API错误类型
export type ApiError = {
  status?: number;
  code?: string;
  message: string;
  details?: any;
};

// 定义错误处理配置
export type ErrorHandlerConfig = {
  // 是否显示错误提示
  showError?: boolean;
  // 自定义错误处理函数
  onError?: (error: ApiError) => void;
  // 是否在控制台打印错误
  logError?: boolean;
};

// 默认配置
const defaultConfig: ErrorHandlerConfig = {
  showError: true,
  logError: true,
};

/**
 * 解析API错误
 * @param error 捕获的错误对象
 * @returns 格式化的API错误对象
 */
export const parseApiError = (error: any): ApiError => {
  // 如果已经是ApiError格式，直接返回
  if (error && typeof error === 'object' && 'message' in error) {
    return error as ApiError;
  }

  // 处理网络错误
  if (error instanceof Error) {
    if (error.message.includes('Network request failed')) {
      return {
        status: 0,
        code: 'NETWORK_ERROR',
        message: '网络连接失败，请检查您的网络设置',
      };
    }
    
    // 处理超时错误
    if (error.message.includes('timeout')) {
      return {
        status: 0,
        code: 'TIMEOUT_ERROR',
        message: '请求超时，请稍后再试',
      };
    }

    return {
      message: error.message || '发生未知错误',
    };
  }

  // 处理其他未知错误
  return {
    message: '发生未知错误，请稍后再试',
  };
};

/**
 * 处理API错误
 * @param error 捕获的错误对象
 * @param config 错误处理配置
 * @returns 格式化的API错误对象
 */
export const handleApiError = (error: any, config?: ErrorHandlerConfig): ApiError => {
  const mergedConfig = { ...defaultConfig, ...config };
  const apiError = parseApiError(error);

  // 在控制台打印错误
  if (mergedConfig.logError) {
    console.error('API Error:', apiError);
  }

  // 调用自定义错误处理函数
  if (mergedConfig.onError) {
    mergedConfig.onError(apiError);
  }

  return apiError;
};

/**
 * 创建一个带有错误处理的API请求包装函数
 * @param apiCall API请求函数
 * @param config 错误处理配置
 * @returns 包装后的API请求函数
 */
export const withErrorHandling = <T, P extends any[]>(
  apiCall: (...args: P) => Promise<T>,
  config?: ErrorHandlerConfig
) => {
  return async (...args: P): Promise<{ data: T | null; error: ApiError | null }> => {
    try {
      const data = await apiCall(...args);
      return { data, error: null };
    } catch (error) {
      const apiError = handleApiError(error, config);
      return { data: null, error: apiError };
    }
  };
};

/**
 * 获取友好的错误消息
 * @param error API错误对象
 * @returns 用户友好的错误消息
 */
export const getFriendlyErrorMessage = (error: ApiError): string => {
  // 根据错误状态码或错误代码返回友好的错误消息
  if (error.status === 401 || error.code === 'UNAUTHORIZED') {
    return '登录已过期，请重新登录';
  }
  
  if (error.status === 403 || error.code === 'FORBIDDEN') {
    return '您没有权限执行此操作';
  }
  
  if (error.status === 404 || error.code === 'NOT_FOUND') {
    return '请求的资源不存在';
  }
  
  if (error.status === 500 || error.code === 'SERVER_ERROR') {
    return '服务器错误，请稍后再试';
  }
  
  // 返回原始错误消息或默认消息
  return error.message || '发生未知错误，请稍后再试';
};