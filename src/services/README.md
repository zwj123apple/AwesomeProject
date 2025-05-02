# API错误处理服务

本服务提供了统一的API错误处理机制，用于在React Native应用中优雅地处理后端API返回的各种错误。

## 功能特点

- 统一的错误解析和处理
- 友好的错误提示
- 支持自定义错误处理逻辑
- 与UI组件集成，提供一致的用户体验

## 主要组件

### 1. apiErrorHandler.ts

提供核心错误处理功能：

- `parseApiError`: 解析API错误
- `handleApiError`: 处理API错误
- `withErrorHandling`: 创建带有错误处理的API请求包装函数
- `getFriendlyErrorMessage`: 获取友好的错误消息

### 2. ErrorModal.tsx

用于展示API错误的Modal组件，提供友好的用户界面。

### 3. api.ts

演示如何在实际API调用中集成错误处理逻辑。

## 使用方法

### 基本用法

```typescript
import { handleApiError } from '../services/apiErrorHandler';

try {
  // 调用API
  const response = await fetch('https://api.example.com/data');
  const data = await response.json();
  // 处理成功响应
} catch (error) {
  // 处理错误
  const apiError = handleApiError(error);
  // 显示错误信息
  console.error(apiError.message);
}
```

### 使用withErrorHandling包装API调用

```typescript
import { withErrorHandling } from '../services/apiErrorHandler';

// 创建带有错误处理的API调用
const fetchData = withErrorHandling(async () => {
  const response = await fetch('https://api.example.com/data');
  return response.json();
});

// 使用包装后的API调用
const { data, error } = await fetchData();
if (error) {
  // 处理错误
  console.error(error.message);
} else {
  // 处理数据
  console.log(data);
}
```

### 在组件中使用ErrorModal

```typescript
import React, { useState } from 'react';
import { ErrorModal } from '../components/common';
import { ApiError, handleApiError } from '../services/apiErrorHandler';

const MyComponent = () => {
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [apiError, setApiError] = useState<ApiError | null>(null);

  const handleApiCall = async () => {
    try {
      // 调用API
      const response = await fetch('https://api.example.com/data');
      const data = await response.json();
      // 处理成功响应
    } catch (error) {
      // 处理错误
      const apiError = handleApiError(error);
      setApiError(apiError);
      setErrorModalVisible(true);
    }
  };

  return (
    <>
      {/* 组件内容 */}
      <ErrorModal
        visible={errorModalVisible}
        error={apiError}
        onClose={() => setErrorModalVisible(false)}
      />
    </>
  );
};
```

## 错误类型

系统会自动处理以下常见错误类型：

- 网络错误 (Network Error)
- 超时错误 (Timeout)
- 认证错误 (401 Unauthorized)
- 权限错误 (403 Forbidden)
- 资源不存在 (404 Not Found)
- 服务器错误 (500 Internal Server Error)

## 自定义错误处理

可以通过配置`handleApiError`函数来自定义错误处理逻辑：

```typescript
import { handleApiError } from '../services/apiErrorHandler';

// 自定义错误处理
const apiError = handleApiError(error, {
  showError: true, // 是否显示错误提示
  logError: true, // 是否在控制台打印错误
  onError: (error) => {
    // 自定义错误处理逻辑
    console.log('自定义错误处理:', error);
  }
});
```