/**
 * 用户状态管理
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import apiService from '../../services/api.service';
import { ApiError } from '../../types';

// 用户类型定义
interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

// 登录凭证
interface Credentials {
  username: string;
  password: string;
}

// 用户状态
interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: ApiError | null;
}

// 初始状态
const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// 异步登录操作
export const login = createAsyncThunk<User, Credentials, { rejectValue: ApiError }>(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // 导入auth服务
      const authService = require('../../services/auth.service').default;
      // 使用auth服务进行登录，它会处理token存储
      const user = await authService.login(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// 获取当前用户信息
export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: ApiError }>(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      // 导入auth服务
      const authService = require('../../services/auth.service').default;
      // 使用auth服务获取当前用户信息
      const user = await authService.getCurrentUser();
      if (!user) {
        throw {
          code: 'USER_NOT_FOUND',
          message: '用户未登录或会话已过期'
        };
      }
      return user;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  }
);

// 用户切片
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.error = null;
      // 清除本地存储的token
      // 注意：React Native中不能使用localStorage，应该使用AsyncStorage
      // 这里不直接调用AsyncStorage，因为这是同步函数，而AsyncStorage是异步的
      // 实际的存储清理应该在auth.service.ts的logout方法中处理
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 处理登录状态
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action: PayloadAction<ApiError | undefined>) => {
        state.loading = false;
        state.error = action.payload || {
          code: 'UNKNOWN_ERROR',
          message: '登录失败',
        };
      });

    // 处理获取用户信息状态
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action: PayloadAction<ApiError | undefined>) => {
        state.loading = false;
        state.error = action.payload || {
          code: 'UNKNOWN_ERROR',
          message: '获取用户信息失败',
        };
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;