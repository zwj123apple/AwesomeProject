import React, { useState, useEffect, createContext, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<{success: boolean; error?: any}>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => ({ success: false }),
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any | null>(null);

  // 检查用户是否已登录
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Failed to get user data', error);
      }
    };

    checkLoginStatus();
  }, []);

  // 登录函数
  const login = async (username: string, password: string): Promise<{success: boolean; error?: any}> => {
    // 这里应该是实际的API调用，现在简化为模拟验证
    if (username && password) {
      try {
        // 模拟API调用
        // 在实际应用中，这里应该是一个fetch或axios请求
        // 模拟随机错误，实际项目中删除这段代码
        if (Math.random() < 0.3) {
          throw {
            status: 401,
            code: 'INVALID_CREDENTIALS',
            message: '用户名或密码错误'
          };
        }
        
        // 模拟成功登录
        const userData = { id: '1', username, name: '测试用户' };
        
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true };
      } catch (error) {
        console.error('Login failed', error);
        return { success: false, error };
      }
    }
    return { success: false, error: { message: '请输入用户名和密码' } };
  };

  // 登出函数
  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Failed to remove user data', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);