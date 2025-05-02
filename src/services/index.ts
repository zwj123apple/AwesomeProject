/**
 * 服务模块导出
 */

import apiService from './api.service';
import authService from './auth.service';
import productService from './product.service';

export {
  apiService,
  authService,
  productService,
};

// 默认导出所有服务
export default {
  api: apiService,
  auth: authService,
  product: productService,
};