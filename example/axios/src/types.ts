import { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface RequestInterceptors<T = AxiosResponse> {
  // 请求拦截
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (error: any) => any;
  // 响应拦截
  responseInterceptors?: (response: T) => T;
  responseInterceptorsCatch?: (error: any) => any;
}

// 自定义传入的参数
export interface RequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: RequestInterceptors<T>;
  showLoading?: boolean;
} 