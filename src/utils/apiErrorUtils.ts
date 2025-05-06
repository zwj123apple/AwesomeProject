import { store } from '../store';
import { setGlobalError } from '../store/slices/uiSlice';
import { ApiError, handleApiError } from '../services/apiErrorHandler';

/**
 * 统一处理API错误并显示错误提示
 * @param error 捕获的错误对象
 */
export const showApiError = (error: any): ApiError => {
  // 使用已有的handleApiError函数处理错误
  const apiError = handleApiError(error);
  
  // 将错误消息设置到全局状态
  store.dispatch(setGlobalError(apiError.message));
  
  return apiError;
};

/**
 * 包装API调用，统一处理错误
 * @param apiCall API调用函数
 */
export const withGlobalErrorHandling = <T>(apiCall: () => Promise<T>) => {
  return async (): Promise<T | null> => {
    try {
      return await apiCall();
    } catch (error) {
      showApiError(error);
      return null;
    }
  };
};