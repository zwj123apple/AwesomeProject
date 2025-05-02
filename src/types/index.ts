/**
 * 全局类型定义
 */

// 通用响应类型
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 分页数据类型
export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// 错误类型
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}