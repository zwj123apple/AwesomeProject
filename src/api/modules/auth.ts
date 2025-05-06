/**
 * 认证API模块
 * 处理用户登录、注册和认证相关API请求
 */

import { apiService } from '..';
import { storeData, removeData, STORAGE_KEYS } from '../../utils/storage';

// 用户类型
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// 登录凭证
export interface LoginCredentials {
  username: string;
  password: string;
}

// 注册数据
export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// 认证响应
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * 用户登录
 * @param credentials 登录凭证
 * @returns 登录响应
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    // 存储认证token
    await storeData(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    // 存储用户信息
    await storeData(STORAGE_KEYS.USER_INFO, response.data.user);
    
    return response.data.user;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 用户注册
 * @param data 注册数据
 * @returns 注册响应
 */
export const register = async (data: RegisterData): Promise<User> => {
  try {
    const response = await apiService.post<AuthResponse>('/auth/register', data);
    
    // 存储认证token
    await storeData(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
    // 存储用户信息
    await storeData(STORAGE_KEYS.USER_INFO, response.data.user);
    
    return response.data.user;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

/**
 * 用户登出
 */
export const logout = async (): Promise<void> => {
  try {
    // 调用登出API
    await apiService.post('/auth/logout');
  } catch (error) {
    console.error('登出API调用失败:', error);
    // 即使API调用失败，也继续清除本地存储
  } finally {
    // 清除本地存储的认证信息
    await removeData(STORAGE_KEYS.AUTH_TOKEN);
    await removeData(STORAGE_KEYS.USER_INFO);
  }
};

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await apiService.get<User>('/user/profile');
    return response.data;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

/**
 * 检查用户是否已认证
 * @returns 是否已认证
 */
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    // 尝试获取当前用户信息
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    return false;
  }
};

/**
 * 更新用户信息
 * @param userData 用户数据
 * @returns 更新后的用户信息
 */
export const updateUserProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    const response = await apiService.put<User>('/user/profile', userData);
    // 更新本地存储的用户信息
    await storeData(STORAGE_KEYS.USER_INFO, response.data);
    return response.data;
  } catch (error) {
    console.error('更新用户信息失败:', error);
    throw error;
  }
};

/**
 * 修改密码
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export const changePassword = async (oldPassword: string, newPassword: string): Promise<void> => {
  try {
    await apiService.put('/user/password', { oldPassword, newPassword });
  } catch (error) {
    console.error('修改密码失败:', error);
    throw error;
  }
};

/**
 * 发送密码重置邮件
 * @param email 用户邮箱
 */
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await apiService.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('发送密码重置邮件失败:', error);
    throw error;
  }
};

/**
 * 重置密码
 * @param token 重置令牌
 * @param newPassword 新密码
 */
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await apiService.post('/auth/reset-password', { token, newPassword });
  } catch (error) {
    console.error('重置密码失败:', error);
    throw error;
  }
};