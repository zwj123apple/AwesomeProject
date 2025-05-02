/**
 * Redux Store配置
 */

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice.tsx';
import uiReducer from './slices/uiSlice.tsx';

export const store = configureStore({
  reducer: {
    user: userReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 从store本身推断出RootState和AppDispatch类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;