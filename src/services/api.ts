import { withErrorHandling, handleApiError, ApiError } from './apiErrorHandler';

// 基础API配置
const API_BASE_URL = 'https://api.example.com';

// 定义API响应类型
type ApiResponse<T> = {
  data: T;
  message: string;
  code: number;
};

/**
 * 基础fetch请求封装
 * @param url 请求地址
 * @param options 请求选项
 * @returns 响应数据
 */
async function fetchApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // 在实际应用中，这里可能需要添加认证token
      // 'Authorization': `Bearer ${getToken()}`
    },
    ...options,
  });

  // 检查HTTP状态码
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // 构造API错误对象
    const apiError: ApiError = {
      status: response.status,
      code: errorData.code || String(response.status),
      message: errorData.message || response.statusText,
      details: errorData
    };
    
    throw apiError;
  }

  return response.json();
}

/**
 * 用户认证相关API
 */
export const authApi = {
  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @returns 登录结果
   */
  login: withErrorHandling(async (username: string, password: string) => {
    const data = await fetchApi<ApiResponse<{token: string; user: any}>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return data.data;
  }),

  /**
   * 用户注册
   * @param userData 用户数据
   * @returns 注册结果
   */
  register: withErrorHandling(async (userData: {
    username: string;
    password: string;
    email: string;
    name?: string;
  }) => {
    const data = await fetchApi<ApiResponse<{user: any}>>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return data.data;
  }),

  /**
   * 重置密码
   * @param email 用户邮箱
   * @returns 重置结果
   */
  resetPassword: withErrorHandling(async (email: string) => {
    const data = await fetchApi<ApiResponse<{success: boolean}>>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data.data;
  }),
};

/**
 * 用户相关API
 */
export const userApi = {
  /**
   * 获取用户信息
   * @param userId 用户ID
   * @returns 用户信息
   */
  getUserInfo: withErrorHandling(async (userId: string) => {
    const data = await fetchApi<ApiResponse<{user: any}>>(`/users/${userId}`);
    return data.data;
  }),

  /**
   * 更新用户信息
   * @param userId 用户ID
   * @param userData 用户数据
   * @returns 更新结果
   */
  updateUserInfo: withErrorHandling(async (userId: string, userData: any) => {
    const data = await fetchApi<ApiResponse<{user: any}>>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
    return data.data;
  }),
};

/**
 * 通用API错误处理示例
 * @param apiCall API调用函数
 * @returns 处理后的结果
 */
export async function callApiWithErrorHandling<T>(apiCall: () => Promise<T>): Promise<{data: T | null; error: ApiError | null}> {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error) {
    const apiError = handleApiError(error);
    return { data: null, error: apiError };
  }
}