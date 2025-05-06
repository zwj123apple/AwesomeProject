/**
 * 服务模块导出
 * 为了保持向后兼容性，同时引导开发者使用新的API结构
 */

// 导入新的API模块
import { apiService } from '../api/service';
import * as authApi from '../api/modules/auth';
import * as productApi from '../api/modules/product';
import * as transactionApi from '../api/modules/transaction';
import * as assetApi from '../api/modules/asset';

// 创建兼容性服务对象
const authService = {
  login: authApi.login,
  register: authApi.register,
  logout: authApi.logout,
  getCurrentUser: authApi.getCurrentUser,
  isAuthenticated: authApi.isAuthenticated,
  updateUserProfile: authApi.updateUserProfile,
  changePassword: authApi.changePassword,
  forgotPassword: authApi.forgotPassword,
  resetPassword: authApi.resetPassword
};

const productService = {
  getProducts: productApi.getProducts,
  getProductById: productApi.getProductById,
  getCategories: productApi.getCategories,
  searchProducts: productApi.searchProducts,
  getRelatedProducts: productApi.getRelatedProducts
};

const transactionService = {
  getTransactions: transactionApi.getTransactions,
  getTransactionDetail: transactionApi.getTransactionDetail
};

const assetService = {
  getAssets: assetApi.getAssets,
  getAssetById: assetApi.getAssetById,
  getAssetTrend: assetApi.getAssetTrend,
  getAssetDistribution: assetApi.getAssetDistribution,
  getAssetAllocation: assetApi.getAssetAllocation
};

export {
  apiService,
  authService,
  productService,
  transactionService,
  assetService
};

// 默认导出所有服务
export default {
  api: apiService,
  auth: authService,
  product: productService,
  transaction: transactionService,
  asset: assetService
};

/**
 * @deprecated 请使用 import { apiService } from '../api' 代替
 */
export { apiService as api };

/**
 * @deprecated 请使用 import api from '../api' 代替
 */
export { default as services } from '../api';