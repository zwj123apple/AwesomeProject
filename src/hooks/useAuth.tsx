import React, { useState, useEffect, createContext, useContext } from 'react';
import { getData, storeData, removeData, STORAGE_KEYS } from '../utils/storage';
import mockApi from '../api/mockApi';
import { refreshToken, isTokenValid, clearTokens } from '../services/tokenRefresh';
import { useDispatch } from 'react-redux';
import { setGlobalError } from '../store/slices/uiSlice';

type User = {
  id: string;
  username: string;
  name: string;
  email?: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<{success: boolean; error?: any}>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false }),
  logout: async () => {},
  refreshSession: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  // 检查用户是否已登录
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        setIsLoading(true);
        // 验证令牌是否有效
        const tokenValid = await isTokenValid();
        
        if (tokenValid) {
          // 获取用户信息
          const userJson = await getData(STORAGE_KEYS.USER_INFO);
          if (userJson) {
            const userData = JSON.parse(userJson);
            setUser(userData);
            setIsAuthenticated(true);
          } else {
            // 令牌有效但没有用户信息，尝试获取用户信息
            const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
            if (token) {
              const response = await mockApi.getCurrentUser(token);
              if (response.success && response.data.user) {
                setUser(response.data.user);
                await storeData(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data.user));
                setIsAuthenticated(true);
              }
            }
          }
        } else {
          // 令牌无效，尝试刷新
          const newToken = await refreshToken();
          if (newToken) {
            // 刷新成功，获取用户信息
            const response = await mockApi.getCurrentUser(newToken);
            if (response.success && response.data.user) {
              setUser(response.data.user);
              await storeData(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data.user));
              setIsAuthenticated(true);
            }
          } else {
            // 刷新失败，需要重新登录
            await clearTokens();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('检查登录状态失败', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<{success: boolean; error?: any}> => {
    if (!username || !password) {
      return { success: false, error: { message: '请输入用户名和密码' } };
    }

    try {
      // 调用登录API
      const response = await mockApi.login(username, password);
      
      if (!response.success || !response.data) {
        return { success: false, error: response.error };
      }
      
      // 存储令牌和用户信息
      await storeData(STORAGE_KEYS.AUTH_TOKEN, response.data.token);
      await storeData(STORAGE_KEYS.REFRESH_TOKEN, response.data.refreshToken);
      await storeData(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data.user));
      
      setUser(response.data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      console.error('登录失败', error);
      dispatch(setGlobalError(error.message || '登录失败，请稍后再试'));
      return { success: false, error };
    }
  };

  // 登出函数
  const logout = async (): Promise<void> => {
    try {
      // 获取当前令牌
      const token = await getData(STORAGE_KEYS.AUTH_TOKEN);
      if (token) {
        // 调用登出API
        await mockApi.logout(token);
      }
      
      // 清除所有令牌和用户信息
      await clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('登出失败', error);
      // 即使API调用失败，也清除本地存储
      await clearTokens();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // 刷新会话
  const refreshSession = async (): Promise<boolean> => {
    try {
      const newToken = await refreshToken();
      if (newToken) {
        // 刷新成功，获取最新用户信息
        const response = await mockApi.getCurrentUser(newToken);
        if (response.success && response.data.user) {
          setUser(response.data.user);
          await storeData(STORAGE_KEYS.USER_INFO, JSON.stringify(response.data.user));
          setIsAuthenticated(true);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('刷新会话失败', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);