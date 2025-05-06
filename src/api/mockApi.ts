/**
 * 模拟后端API
 * 用于开发和测试环境模拟后端API响应
 */

import { ApiResponse } from '../types';

// 模拟延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// 模拟用户数据
const users = [
  { id: '1', username: 'admin', password: 'admin123', name: '管理员', email: 'admin@example.com' },
  { id: '2', username: 'user', password: 'user123', name: '普通用户', email: 'user@example.com' },
];

// 存储活跃的token
interface TokenData {
  token: string;
  refreshToken: string;
  userId: string;
  expiresAt: number; // 过期时间戳
  refreshExpiresAt: number; // 刷新令牌过期时间戳
}

// 模拟令牌存储
const tokens: Map<string, TokenData> = new Map();

// 生成随机令牌
const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// 模拟API响应
export const mockApi = {
  /**
   * 模拟登录API
   * @param username 用户名
   * @param password 密码
   */
  async login(username: string, password: string): Promise<ApiResponse<any>> {
    await delay(500); // 模拟网络延迟
    
    // 查找用户
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: '用户名或密码错误',
        },
      };
    }
    
    // 创建新令牌 (有效期15分钟)
    const token = generateToken();
    const refreshToken = generateToken();
    const now = Date.now();
    
    // 存储令牌信息
    tokens.set(token, {
      token,
      refreshToken,
      userId: user.id,
      expiresAt: now + 15 * 60 * 1000, // 15分钟后过期
      refreshExpiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7天后过期
    });
    
    // 返回用户信息和令牌
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
        refreshToken,
      },
    };
  },
  
  /**
   * 模拟刷新令牌API
   * @param refreshToken 刷新令牌
   */
  async refreshToken(refreshToken: string): Promise<ApiResponse<any>> {
    await delay(300); // 模拟网络延迟
    
    // 查找对应的令牌数据
    let tokenData: TokenData | undefined;
    let tokenKey: string | undefined;
    
    for (const [key, data] of tokens.entries()) {
      if (data.refreshToken === refreshToken) {
        tokenData = data;
        tokenKey = key;
        break;
      }
    }
    
    if (!tokenData || !tokenKey) {
      return {
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: '无效的刷新令牌',
        },
      };
    }
    
    // 检查刷新令牌是否过期
    if (Date.now() > tokenData.refreshExpiresAt) {
      // 移除过期的令牌
      tokens.delete(tokenKey);
      return {
        success: false,
        error: {
          code: 'REFRESH_TOKEN_EXPIRED',
          message: '刷新令牌已过期，请重新登录',
        },
      };
    }
    
    // 生成新的访问令牌
    const newToken = generateToken();
    const now = Date.now();
    
    // 更新令牌信息
    tokens.delete(tokenKey); // 删除旧令牌
    tokens.set(newToken, {
      token: newToken,
      refreshToken: tokenData.refreshToken, // 保持相同的刷新令牌
      userId: tokenData.userId,
      expiresAt: now + 15 * 60 * 1000, // 15分钟后过期
      refreshExpiresAt: tokenData.refreshExpiresAt, // 保持原来的刷新令牌过期时间
    });
    
    // 查找用户信息
    const user = users.find(u => u.id === tokenData.userId);
    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '用户不存在',
        },
      };
    }
    
    // 返回令牌验证结果，包含剩余有效时间
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        token: newToken,
        // 不返回refreshToken，因为它没有改变
      },
    };
  },
  
  /**
   * 模拟验证令牌API
   * @param token 访问令牌
   */
  async validateToken(token: string): Promise<ApiResponse<any>> {
    await delay(200); // 模拟网络延迟
    
    // 查找令牌数据
    const tokenData = tokens.get(token);
    
    if (!tokenData) {
      return {
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: '无效的访问令牌',
        },
      };
    }
    
    // 检查令牌是否过期
    if (Date.now() > tokenData.expiresAt) {
      return {
        success: false,
        error: {
          code: 'TOKEN_EXPIRED',
          message: '访问令牌已过期',
        },
      };
    }
    
    // 计算令牌剩余有效时间（毫秒）
    const expiresIn = tokenData.expiresAt - Date.now();
    
    // 查找用户信息
    const user = users.find(u => u.id === tokenData.userId);
    if (!user) {
      return {
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: '用户不存在',
        },
      };
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      success: true,
      data: {
        user: userWithoutPassword,
        expiresIn: expiresIn // 包含令牌剩余有效时间
      },
    };
  },
  
  /**
   * 模拟获取当前用户信息API
   * @param token 访问令牌
   */
  async getCurrentUser(token: string): Promise<ApiResponse<any>> {
    // 直接复用验证令牌的逻辑
    return this.validateToken(token);
  },
  
  /**
   * 模拟登出API
   * @param token 访问令牌
   */
  async logout(token: string): Promise<ApiResponse<any>> {
    await delay(300); // 模拟网络延迟
    
    // 移除令牌
    tokens.delete(token);
    
    return {
      success: true,
      data: {
        message: '登出成功',
      },
    };
  },
};

// 导出模拟API
export default mockApi;