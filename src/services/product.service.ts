/**
 * 产品服务
 * 处理产品相关的API调用
 */

import apiService from './api.service';
import { ApiResponse, PaginatedData } from '../types';

// 产品类型
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

// 产品过滤条件
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 产品服务
 */
const productService = {
  /**
   * 获取产品列表
   * @param page 页码
   * @param pageSize 每页数量
   * @param filters 过滤条件
   * @returns 分页产品数据
   */
  async getProducts(
    page = 1,
    pageSize = 10,
    filters?: ProductFilters
  ): Promise<PaginatedData<Product>> {
    try {
      const response = await apiService.get<PaginatedData<Product>>('/products', {
        params: {
          page,
          pageSize,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.error('获取产品列表失败:', error);
      throw error;
    }
  },

  /**
   * 获取产品详情
   * @param productId 产品ID
   * @returns 产品详情
   */
  async getProductById(productId: string): Promise<Product> {
    try {
      const response = await apiService.get<Product>(`/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`获取产品(ID: ${productId})详情失败:`, error);
      throw error;
    }
  },

  /**
   * 获取产品分类列表
   * @returns 分类列表
   */
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiService.get<string[]>('/products/categories');
      return response.data;
    } catch (error) {
      console.error('获取产品分类失败:', error);
      throw error;
    }
  },

  /**
   * 搜索产品
   * @param query 搜索关键词
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 搜索结果
   */
  async searchProducts(
    query: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedData<Product>> {
    try {
      const response = await apiService.get<PaginatedData<Product>>('/products/search', {
        params: {
          q: query,
          page,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('搜索产品失败:', error);
      throw error;
    }
  },

  /**
   * 获取推荐产品
   * @param productId 当前产品ID
   * @param limit 数量限制
   * @returns 推荐产品列表
   */
  async getRelatedProducts(productId: string, limit = 5): Promise<Product[]> {
    try {
      const response = await apiService.get<Product[]>(`/products/${productId}/related`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('获取推荐产品失败:', error);
      throw error;
    }
  },
};

export default productService;