/**
 * API服务入口
 * 统一导出所有API模块
 */

import { apiService } from './service';
import { api8080Service } from './service8080';
import * as authApi from './modules/auth';
import * as productApi from './modules/product';
import * as transactionApi from './modules/transaction';
import * as assetApi from './modules/asset';
import * as exampleApi from './modules/example';

// 导出API服务
export { apiService, api8080Service };

// 导出API模块
export {
  authApi,
  productApi,
  transactionApi,
  assetApi,
  exampleApi
};

// 默认导出
export default {
  service: apiService,      // 默认使用5000端口服务
  service8080: api8080Service, // 8080端口服务
  auth: authApi,
  product: productApi,
  transaction: transactionApi,
  asset: assetApi,
  example: exampleApi
};