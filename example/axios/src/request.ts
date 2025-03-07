import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import {  MyHttpRequestConfig } from './type';

import { stringify } from "qs";

const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

// class Request {

//   // axios 实例
//   instance: AxiosInstance;
//   // 拦截器对象
//   interceptorsObj?: RequestInterceptors;
//   // 存放取消请求控制器Map
//   abortControllerMap: Map<string, AbortController>;

//   constructor(config: RequestConfig) {
//     this.instance = axios.create(config);
//     this.interceptorsObj = config.interceptors;
//     this.abortControllerMap = new Map();
    
//     // 注册实例拦截器
//     this.instance.interceptors.request.use(
//       (config: AxiosRequestConfig) => {
//         return this.interceptorsObj?.requestInterceptors?.(config) || config;
//       },
//       (error: any) => {
//         return this.interceptorsObj?.requestInterceptorsCatch?.(error) || error;
//       }
//     );

//     this.instance.interceptors.response.use(
//       (response: AxiosResponse) => {
//         return this.interceptorsObj?.responseInterceptors?.(response) || response;
//       },
//       (error: any) => {
//         return this.interceptorsObj?.responseInterceptorsCatch?.(error) || error;
//       }
//     );
//   }

//   request<T = any>(config: RequestConfig<T>): Promise<T> {
//     // 如果需要取消请求，生成取消令牌
//     if (config.signal) {
//       const controller = new AbortController();
//       const url = config.url || '';
//       config.signal = controller.signal;
//       this.abortControllerMap.set(url, controller);
//     }

//     return new Promise((resolve, reject) => {
//       // 如果有单独的拦截器，执行单独的拦截器
//       if (config.interceptors?.requestInterceptors) {
//         config = config.interceptors.requestInterceptors(config);
//       }

//       this.instance
//         .request<any, T>(config)
//         .then(res => {
//           // 如果有单独的响应拦截器，执行单独的响应拦截器
//           if (config.interceptors?.responseInterceptors) {
//             res = config.interceptors.responseInterceptors(res);
//           }
//           resolve(res);
//         })
//         .catch((err: any) => {
//           reject(err);
//         })
//         .finally(() => {
//           const url = config.url || '';
//           this.abortControllerMap.delete(url);
//         });
//     });
//   }

//   // 取消请求
//   cancelRequest(url: string | string[]) {
//     const urlList = Array.isArray(url) ? url : [url];
//     urlList.forEach(u => {
//       this.abortControllerMap.get(u)?.abort();
//       this.abortControllerMap.delete(u);
//     });
//   }

//   // 取消全部请求
//   cancelAllRequest() {
//     this.abortControllerMap.forEach(controller => {
//       controller.abort();
//     });
//     this.abortControllerMap.clear();
//   }
// } 

class Request {
  constructor(){}


  /** 初始化配置对象 */
  private static initConfig: MyHttpRequestConfig = {};

  /** 保存当前axios实例对象 */
  private static axiosInstance: AxiosInstance=Axios.create(defaultConfig);

  
}