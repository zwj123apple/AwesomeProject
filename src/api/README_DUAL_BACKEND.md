# 双后端API服务使用指南

## 概述

本项目支持连接两个不同的后端服务：
- 端口5000的后端服务（默认）
- 端口8080的后端服务（扩展）

## 配置说明

### 后端服务配置

两个后端服务的配置定义在 `src/config/apiConfig.ts` 文件中：

```typescript
// 后端服务ID
export const BACKEND_IDS = {
  PORT_5000: 'port5000',
  PORT_8080: 'port8080'
};

// 默认后端ID (端口5000)
export const DEFAULT_BACKEND_ID = BACKEND_IDS.PORT_5000;
```

### API服务初始化

在应用启动时，需要初始化API服务，确保两个后端服务都被正确配置：

```typescript
import { initApiService } from './api/initApi';

// 在应用启动时调用
initApiService();
```

## 使用方法

### 使用默认后端服务（端口5000）

默认情况下，所有API请求都会使用端口5000的后端服务：

```typescript
import { apiService } from '../api';

// 使用默认后端服务（端口5000）
const response = await apiService.get('/users');
```

### 使用端口8080的后端服务

有两种方式可以使用端口8080的后端服务：

#### 方式1：通过backendId参数指定

```typescript
import { apiService } from '../api';
import { BACKEND_IDS } from '../config/apiConfig';

// 通过backendId参数指定使用8080端口服务
const response = await apiService.get('/data', {}, BACKEND_IDS.PORT_8080);
```

#### 方式2：直接使用api8080Service

```typescript
import { api8080Service } from '../api';

// 直接使用api8080Service，固定使用8080端口服务
const response = await api8080Service.get('/data');
```

## 示例模块

`src/api/modules/example.ts` 提供了使用不同后端服务的示例：

```typescript
// 使用默认5000端口服务的API
export const getDataFromDefault = async () => {
  // 默认使用5000端口服务
  const response = await apiService.get('/data');
  return response.data;
};

// 使用8080端口服务的API
export const getDataFrom8080Direct = async () => {
  // 直接使用api8080Service，固定使用8080端口服务
  const response = await api8080Service.get('/data');
  return response.data;
};
```

## 创建新的API模块

创建新的API模块时，可以根据需要选择使用哪个后端服务：

```typescript
// modules/newModule.ts
import { apiService, api8080Service } from '../service';
import { BACKEND_IDS } from '../../config/apiConfig';

// 使用默认5000端口服务
export const getDataFromDefault = async () => {
  const response = await apiService.get('/endpoint');
  return response.data;
};

// 使用8080端口服务
export const getDataFrom8080 = async () => {
  const response = await api8080Service.get('/endpoint');
  return response.data;
};
```

然后在 `src/api/index.ts` 中导出新模块：

```typescript
import * as newModuleApi from './modules/newModule';

// 导出API模块
export { newModuleApi };

// 更新默认导出
export default {
  // ...
  newModule: newModuleApi
};
```