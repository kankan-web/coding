import { createRequest } from './index';

// 创建请求实例
const request = createRequest({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  interceptors: {
    requestInterceptors: (config) => {
      // 在请求发送前添加token
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    responseInterceptors: (response) => {
      // 统一处理响应数据
      return response.data;
    },
    responseInterceptorsCatch: (error) => {
      // 统一处理错误
      if (error.response?.status === 401) {
        // 处理未授权
        console.log('未授权，请重新登录');
      }
      return Promise.reject(error);
    }
  }
});

// 使用示例
async function fetchUserData(userId: string) {
  try {
    const response = await request.request({
      url: `/users/${userId}`,
      method: 'GET',
      showLoading: true
    });
    return response;
  } catch (error) {
    console.error('获取用户数据失败:', error);
    throw error;
  }
}

// 取消请求示例
async function cancelableRequest() {
  const controller = new AbortController();
  try {
    const response = await request.request({
      url: '/long-running-request',
      signal: controller.signal
    });
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('请求被取消');
    }
    throw error;
  }
} 