# API 模块使用指南

本模块提供了统一的API请求封装，用于处理与后端服务的通信。API模块采用了模块化的结构，每个后端服务对应一个API配置文件，使代码更加清晰和可维护。

## 目录结构

```
api/
  ├── client.ts          # API客户端工厂，处理底层HTTP请求
  ├── config.ts          # API配置，包含所有后端服务的配置信息
  ├── service.ts         # 通用API服务，提供HTTP方法封装
  ├── index.ts           # 模块入口，统一导出所有API
  └── modules/           # API模块，按业务领域划分
      ├── auth.ts        # 认证相关API
      ├── product.ts     # 产品相关API
      └── transaction.ts # 交易相关API
```

## 使用方法

### 1. 直接使用API模块

推荐的使用方式是直接导入需要的API模块：

```typescript
// 导入认证API模块
import * as authApi from '../api/modules/auth';

// 使用API函数
const handleLogin = async (credentials) => {
  try {
    const user = await authApi.login(credentials);
    // 处理登录成功
  } catch (error) {
    // 处理错误
  }
};
```

### 2. 使用通用API服务

如果需要直接发送HTTP请求，可以使用通用API服务：

```typescript
import { apiService } from '../api/service';

// 发送GET请求
const fetchData = async () => {
  try {
    const response = await apiService.get('/some-endpoint');
    // 处理响应
  } catch (error) {
    // 处理错误
  }
};
```

### 3. 多后端服务支持

系统支持与多个后端服务通信：

```typescript
import { apiService } from '../api/service';

// 使用特定后端服务
const fetchProducts = async () => {
  try {
    // 使用产品服务后端
    const response = await apiService.get('/products', undefined, 'backend2');
    // 处理响应
  } catch (error) {
    // 处理错误
  }
};
```

## 添加新的API模块

要添加新的API模块，请按照以下步骤操作：

1. 在 `modules` 目录下创建新的模块文件，例如 `user.ts`
2. 在模块文件中定义API函数
3. 在 `index.ts` 中导出新模块

示例：

```typescript
// modules/user.ts
import { apiService } from '../service';

export const getUserProfile = async (userId: string) => {
  try {
    const response = await apiService.get(`/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error('获取用户资料失败:', error);
    throw error;
  }
};
```

然后在 `index.ts` 中添加：

```typescript
import * as userApi from './modules/user';

export { userApi };

// 更新默认导出
export default {
  // ...
  user: userApi,
};
```

## 配置新的后端服务

要添加新的后端服务，请在 `config.ts` 中的 `API_BACKENDS` 数组中添加新的配置：

```typescript
// 添加新的后端服务
{
  id: 'new-backend',
  name: '新服务',
  baseURL: getBaseUrl(CURRENT_ENV, 'new-service'),
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
},
```

## 兼容性说明

为了保持向后兼容性，原有的服务模块 (`services/`) 仍然可以使用，但它们现在是对新API模块的包装。建议在新代码中直接使用API模块。

```typescript
// 旧方式 (仍然有效，但不推荐)
import authService from '../services/auth.service';

// 新方式 (推荐)
import * as authApi from '../api/modules/auth';
```