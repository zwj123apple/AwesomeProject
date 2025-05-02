# 多后端API服务使用指南

## 概述

多后端API服务允许应用程序与多个不同的后端服务进行通信，适用于以下场景：

- 应用需要连接到多个微服务
- 需要同时支持测试环境和生产环境
- 需要根据不同用户或功能模块连接到不同的后端服务

## 基本用法

### 使用默认后端

```typescript
import apiService from '../services/api.service';

// 使用默认后端发送GET请求
const fetchData = async () => {
  try {
    const response = await apiService.get('/users');
    console.log('用户数据:', response.data);
  } catch (error) {
    console.error('获取数据失败:', error.message);
  }
};

// 使用默认后端发送POST请求
const createUser = async (userData) => {
  try {
    const response = await apiService.post('/users', userData);
    console.log('创建成功:', response.data);
  } catch (error) {
    console.error('创建用户失败:', error.message);
  }
};
```

### 指定后端发送请求

```typescript
import apiService from '../services/api.service';

// 使用指定后端发送GET请求
const fetchDataFromBackend2 = async () => {
  try {
    // 使用ID为'backend2'的后端服务
    const response = await apiService.get('/products', undefined, 'backend2');
    console.log('产品数据:', response.data);
  } catch (error) {
    console.error('获取数据失败:', error.message);
  }
};

// 使用指定后端发送POST请求
const createOrder = async (orderData) => {
  try {
    // 使用ID为'backend3'的后端服务
    const response = await apiService.post('/orders', orderData, undefined, 'backend3');
    console.log('订单创建成功:', response.data);
  } catch (error) {
    console.error('创建订单失败:', error.message);
  }
};
```

## 后端配置管理

### 获取所有可用后端

```typescript
import apiService from '../services/api.service';

// 获取所有可用的后端配置
const showAvailableBackends = () => {
  const backends = apiService.getAvailableBackends();
  console.log('可用后端列表:', backends);
  
  // 可以用于构建后端选择界面
  return backends.map(backend => ({
    label: backend.name,
    value: backend.id
  }));
};
```

### 动态添加新后端

```typescript
import apiService, { ApiBackendConfig } from '../services/api.service';

// 添加新的后端配置
const addNewBackend = () => {
  const newBackendConfig: ApiBackendConfig = {
    id: 'custom-backend',
    name: '自定义后端',
    baseURL: 'https://custom-api.example.com',
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
      'X-Custom-Header': 'CustomValue'
    }
  };
  
  apiService.addBackend(newBackendConfig);
  console.log('新后端已添加');
};
```

## 高级用法

### 根据用户角色选择不同后端

```typescript
import apiService from '../services/api.service';
import { getUserRole } from '../utils/auth';

const fetchUserSpecificData = async (userId) => {
  // 根据用户角色选择不同的后端
  const userRole = await getUserRole();
  let backendId;
  
  switch(userRole) {
    case 'admin':
      backendId = 'backend2'; // 管理员使用backend2
      break;
    case 'customer':
      backendId = 'backend3'; // 普通客户使用backend3
      break;
    default:
      backendId = 'default'; // 默认后端
  }
  
  try {
    const response = await apiService.get(`/users/${userId}/dashboard`, undefined, backendId);
    return response.data;
  } catch (error) {
    console.error('获取用户数据失败:', error.message);
    throw error;
  }
};
```

### 批量请求不同后端

```typescript
import apiService from '../services/api.service';

const fetchCrossBackendData = async () => {
  try {
    // 并行请求多个后端
    const [usersResponse, productsResponse, ordersResponse] = await Promise.all([
      apiService.get('/users', undefined, 'default'),
      apiService.get('/products', undefined, 'backend2'),
      apiService.get('/orders', undefined, 'backend3')
    ]);
    
    // 合并数据
    return {
      users: usersResponse.data,
      products: productsResponse.data,
      orders: ordersResponse.data
    };
  } catch (error) {
    console.error('获取跨后端数据失败:', error.message);
    throw error;
  }
};
```

## 错误处理

所有API请求都会自动处理常见的错误情况，包括：

- 网络错误
- 服务器错误
- 认证错误（401）

当发生401未授权错误时，系统会自动清除本地存储的认证令牌。

## 自定义请求配置

每个请求方法都接受一个可选的`config`参数，可用于自定义请求配置：

```typescript
import apiService from '../services/api.service';

const fetchWithCustomConfig = async () => {
  try {
    const response = await apiService.get('/large-data', {
      timeout: 30000, // 增加超时时间
      headers: {
        'Cache-Control': 'no-cache'
      },
      params: {
        limit: 100,
        offset: 0
      }
    }, 'backend2');
    
    return response.data;
  } catch (error) {
    console.error('请求失败:', error.message);
    throw error;
  }
};
```

## 最佳实践

1. **创建专用服务**：为不同的业务领域创建专用的API服务，内部使用多后端API服务。

```typescript
// userService.ts
import apiService from './api.service';

export const userService = {
  getProfile: async (userId) => {
    return apiService.get(`/users/${userId}`, undefined, 'default');
  },
  
  updateProfile: async (userId, data) => {
    return apiService.put(`/users/${userId}`, data, undefined, 'default');
  }
};

// productService.ts
import apiService from './api.service';

export const productService = {
  getProducts: async () => {
    return apiService.get('/products', undefined, 'backend2');
  },
  
  getProductDetails: async (productId) => {
    return apiService.get(`/products/${productId}`, undefined, 'backend2');
  }
};
```

2. **环境配置**：根据不同环境（开发、测试、生产）动态配置后端。

3. **错误处理**：创建统一的错误处理机制，处理不同后端的错误格式差异。

4. **缓存策略**：对不同后端的响应实施不同的缓存策略。

## 注意事项

- 确保所有后端的认证机制兼容
- 注意不同后端的API格式可能存在差异
- 监控各个后端的性能和可用性
- 实施适当的重试和降级策略