/**
 * UI状态管理
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// UI状态接口
interface UiState {
  theme: 'light' | 'dark';
  isLoading: boolean;
  globalError: string | null;
  toasts: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  }>;
}

// 初始状态
const initialState: UiState = {
  theme: 'light',
  isLoading: false,
  globalError: null,
  toasts: [],
};

// UI切片
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGlobalError: (state, action: PayloadAction<string | null>) => {
      state.globalError = action.payload;
    },
    addToast: (state, action: PayloadAction<{
      message: string;
      type: 'success' | 'error' | 'info' | 'warning';
    }>) => {
      const id = Date.now().toString();
      state.toasts.push({
        id,
        message: action.payload.message,
        type: action.payload.type,
      });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {
  setTheme,
  setLoading,
  setGlobalError,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

export default uiSlice.reducer;