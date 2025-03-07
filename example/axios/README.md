# Axios 封装工具库

这是一个基于 Axios 的 TypeScript 封装库，提供了更便捷的 HTTP 请求处理方式。

## 特性

- 完整的 TypeScript 支持
- 灵活的拦截器配置
- 请求取消功能
- 统一的错误处理
- 支持自定义配置

## 安装

```bash
npm install
```

## 使用方法

### 创建请求实例

```typescript
import { createRequest } from './index';

const request = createRequest({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  interceptors: {
    requestInterceptors: (config) => {
      // 自定义请求拦截器
      return config;
    },
    responseInterceptors: (response) => {
      // 自定义响应拦截器
      return response.data;
    }
  }
});
```

### 发送请求

```typescript
// 基础请求
const response = await request.request({
  url: '/api/data',
  method: 'GET'
});

// 带取消功能的请求
const controller = new AbortController();
const response = await request.request({
  url: '/api/data',
  signal: controller.signal
});

// 取消请求
request.cancelRequest('/api/data');
```

## 开发

```bash
# 安装依赖
npm install

# 构建
npm run build

# 运行测试
npm test

# 运行 lint
npm run lint
```

## 配置说明

### RequestConfig 接口

```typescript
interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
  showLoading?: boolean;
}
```

### RequestInterceptors 接口

```typescript
interface RequestInterceptors<T = AxiosResponse> {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (error: any) => any;
  responseInterceptors?: (response: T) => T;
  responseInterceptorsCatch?: (error: any) => any;
}
``` 