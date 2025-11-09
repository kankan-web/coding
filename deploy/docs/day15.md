# Day 15: 性能监控和故障排查 - 详细学习计划

## 📚 学习目标

完成本日学习后，你将能够：

- 理解性能监控的重要性和核心指标（Core Web Vitals）
- 掌握前端错误监控工具（Sentry）的配置和使用
- 了解服务端监控体系（Prometheus、Grafana）
- 理解日志收集和分析方案（ELK Stack、Loki）
- 掌握性能指标监控和告警配置
- 具备故障排查和应急响应能力
- 能够生成性能优化报告，指导后续优化工作
- **（可选）分析公司部署方案的监控和告警机制**

## 🎯 核心目标

**建立完整的性能监控和故障排查体系，确保应用稳定运行和持续优化**

## ⏰ 学习时间分配

- **理论学习**: 2-2.5 小时
  - 性能监控概念和指标
  - 监控工具对比和选型
  - 故障排查方法论
- **实践操作**: 4-5 小时
  - Sentry 错误监控配置
  - 性能监控实现
  - 告警配置
  - 日志收集配置
- **故障排查实践**: 1-1.5 小时
  - 模拟故障场景
  - 排查流程实践
- **文档编写**: 1 小时
  - 故障排查手册
  - 性能优化报告

## 📖 核心知识点

### 1. 性能监控概述

#### 1.1 为什么需要性能监控

**性能监控的价值**：

1. **问题发现**：及时发现性能问题和错误
2. **用户体验**：确保良好的用户体验（Core Web Vitals）
3. **业务影响**：性能问题直接影响业务指标（转化率、留存率）
4. **持续优化**：通过数据驱动优化决策
5. **故障预警**：提前发现潜在问题，避免故障

**监控的层次**：

```
用户层（前端监控）
    ↓
应用层（应用性能监控 APM）
    ↓
基础设施层（服务器监控、网络监控）
```

#### 1.2 监控分类

**按监控对象分类**：

- **前端监控**：页面性能、用户行为、错误监控
- **后端监控**：API 性能、服务器资源、数据库性能
- **基础设施监控**：服务器 CPU、内存、磁盘、网络

**按监控方式分类**：

- **实时监控**：实时查看当前状态
- **历史监控**：查看历史趋势和对比
- **告警监控**：异常时自动通知

### 2. Web 性能指标（Core Web Vitals）

#### 2.1 Core Web Vitals 核心指标

**Core Web Vitals** 是 Google 提出的衡量用户体验的关键指标，直接影响 SEO 排名。

**三大核心指标**：

**1. LCP（Largest Contentful Paint）- 最大内容绘制**

- **定义**：页面最大内容元素（图片、视频、文本块）渲染完成的时间
- **目标值**：≤ 2.5 秒（良好）
- **测量方式**：
  ```javascript
  // 使用 Performance Observer API
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
  }).observe({ entryTypes: ['largest-contentful-paint'] });
  ```
- **优化方向**：
  - 优化图片加载（懒加载、WebP、压缩）
  - 优化关键 CSS（内联、预加载）
  - 使用 CDN 加速
  - 优化服务器响应时间（TTFB）

**2. FID（First Input Delay）- 首次输入延迟**

- **定义**：用户首次与页面交互（点击、输入）到浏览器响应该交互的时间
- **目标值**：≤ 100 毫秒（良好）
- **测量方式**：
  ```javascript
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      console.log('FID:', entry.processingStart - entry.startTime);
    });
  }).observe({ entryTypes: ['first-input'] });
  ```
- **优化方向**：
  - 减少 JavaScript 执行时间
  - 代码分割和懒加载
  - 优化第三方脚本
  - 使用 Web Workers

**3. CLS（Cumulative Layout Shift）- 累积布局偏移**

- **定义**：页面加载过程中，元素位置发生意外移动的程度
- **目标值**：≤ 0.1（良好）
- **测量方式**：
  ```javascript
  let clsValue = 0;
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        clsValue += entry.value;
      }
    }
    console.log('CLS:', clsValue);
  }).observe({ entryTypes: ['layout-shift'] });
  ```
- **优化方向**：
  - 为图片和视频设置尺寸属性（width、height）
  - 避免在现有内容上方插入内容
  - 使用 transform 动画代替改变布局的属性
  - 预加载字体，避免字体闪烁

#### 2.2 其他重要性能指标

**TTFB（Time to First Byte）- 首字节时间**

- **定义**：从请求发送到收到第一个字节的时间
- **目标值**：≤ 800 毫秒
- **影响因素**：服务器响应速度、网络延迟、DNS 解析时间

**FCP（First Contentful Paint）- 首次内容绘制**

- **定义**：浏览器首次渲染任何文本、图片或非空白 canvas/SVG 的时间
- **目标值**：≤ 1.8 秒
- **优化方向**：优化关键渲染路径

**TTI（Time to Interactive）- 可交互时间**

- **定义**：页面完全可交互的时间
- **目标值**：≤ 3.8 秒
- **优化方向**：减少 JavaScript 执行时间

**TBT（Total Blocking Time）- 总阻塞时间**

- **定义**：FCP 到 TTI 之间，主线程被阻塞的总时间
- **目标值**：≤ 200 毫秒
- **优化方向**：代码分割、异步加载

### 3. 前端错误监控（Sentry）

#### 3.1 Sentry 简介

**Sentry** 是一个开源的错误监控和性能监控平台，支持多种语言和框架。

**核心功能**：

- **错误捕获**：自动捕获 JavaScript 错误、Promise 拒绝、未处理的异常
- **性能监控**：追踪 API 请求、页面加载性能
- **用户反馈**：收集用户反馈和上下文信息
- **告警通知**：支持邮件、Slack、钉钉、企业微信等通知方式
- **错误分组**：自动将相似错误分组，便于分析
- **源码映射**：支持 Source Map，定位原始代码位置

**定价**：

- **免费版**：每月 5,000 错误事件
- **团队版**：$26/月起，更多错误事件和功能
- **自托管**：开源版本，可自行部署

#### 3.2 Sentry 安装和配置

**步骤 1：创建 Sentry 项目**

1. 访问 [sentry.io](https://sentry.io)
2. 注册账号并创建组织
3. 创建新项目，选择平台（React、Vue、JavaScript 等）
4. 获取 DSN（Data Source Name）

**步骤 2：安装 Sentry SDK**

**Vue 3 项目**：

```bash
npm install @sentry/vue @sentry/tracing
```

**React 项目**：

```bash
npm install @sentry/react @sentry/tracing
```

**纯 JavaScript 项目**：

```bash
npm install @sentry/browser @sentry/tracing
```

**步骤 3：初始化 Sentry**

**Vue 3 示例**：

```javascript
// main.js
import { createApp } from 'vue';
import * as Sentry from '@sentry/vue';
import { BrowserTracing } from '@sentry/tracing';
import App from './App.vue';

Sentry.init({
  app,
  dsn: 'https://your-dsn@sentry.io/project-id',
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', 'yourdomain.com', /^\//],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  // 性能监控采样率（0.0 - 1.0）
  tracesSampleRate: 1.0,
  // 错误采样率
  sampleRate: 1.0,
  // 环境标识
  environment: process.env.NODE_ENV,
  // 发布版本（用于追踪版本）
  release: process.env.VITE_APP_VERSION || 'unknown',
  // 忽略的错误类型
  ignoreErrors: [
    'ResizeObserver loop limit exceeded',
    'Non-Error promise rejection captured',
  ],
  // 忽略的 URL（不发送错误）
  denyUrls: [
    /extensions\//i,
    /^chrome:\/\//i,
    /^chrome-extension:\/\//i,
  ],
  // 用户信息（可选）
  beforeSend(event, hint) {
    // 可以在这里修改事件或返回 null 来忽略错误
    if (event.exception) {
      const error = hint.originalException;
      // 忽略特定错误
      if (error && error.message === 'Network Error') {
        return null;
      }
    }
    return event;
  },
});

const app = createApp(App);
app.mount('#app');
```

**React 示例**：

```javascript
// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import App from './App';

Sentry.init({
  dsn: 'https://your-dsn@sentry.io/project-id',
  integrations: [
    new BrowserTracing({
      tracingOrigins: ['localhost', 'yourdomain.com', /^\//],
    }),
  ],
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  release: process.env.REACT_APP_VERSION || 'unknown',
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**步骤 4：配置 Source Map**

**Vite 项目配置**：

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    sourcemap: true, // 生成 Source Map
    rollupOptions: {
      output: {
        // 上传 Source Map 到 Sentry
        sourcemapIgnoreList: false,
      },
    },
  },
});
```

**上传 Source Map 到 Sentry**：

```bash
# 安装 Sentry CLI
npm install -g @sentry/cli

# 配置认证
sentry-cli login

# 上传 Source Map
sentry-cli sourcemaps inject ./dist
sentry-cli sourcemaps upload ./dist \
  --org your-org \
  --project your-project \
  --release your-release
```

**步骤 5：手动捕获错误**

```javascript
// 捕获异常
try {
  // 可能出错的代码
  riskyOperation();
} catch (error) {
  Sentry.captureException(error);
}

// 捕获消息
Sentry.captureMessage('Something went wrong', 'warning');

// 设置用户上下文
Sentry.setUser({
  id: '123',
  email: 'user@example.com',
  username: 'username',
});

// 设置标签
Sentry.setTag('page', 'home');
Sentry.setTag('feature', 'checkout');

// 设置额外上下文
Sentry.setContext('device', {
  type: 'mobile',
  os: 'iOS',
  version: '15.0',
});
```

#### 3.3 Sentry 性能监控

**自动性能监控**：

Sentry 会自动追踪：
- 页面加载性能
- API 请求性能
- 路由导航性能

**手动性能监控**：

```javascript
// 创建事务（Transaction）
const transaction = Sentry.startTransaction({
  name: 'checkout-process',
  op: 'task',
});

// 创建 Span
const span = transaction.startChild({
  op: 'http',
  description: 'fetch user data',
});

// 执行操作
await fetchUserData();

// 结束 Span
span.finish();

// 结束事务
transaction.finish();
```

**API 请求监控**：

```javascript
// 使用 fetch 拦截器
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const transaction = Sentry.startTransaction({
    name: `fetch ${args[0]}`,
    op: 'http.client',
  });

  return originalFetch.apply(this, args)
    .then(response => {
      transaction.setHttpStatus(response.status);
      transaction.finish();
      return response;
    })
    .catch(error => {
      transaction.setHttpStatus(500);
      transaction.finish();
      throw error;
    });
};
```

#### 3.4 Sentry 告警配置

**创建告警规则**：

1. 进入 Sentry 项目设置 → Alerts
2. 创建新的告警规则：
   - **条件**：错误数量 > 10（5 分钟内）
   - **频率**：每 5 分钟检查一次
   - **通知方式**：邮件、Slack、钉钉、企业微信等

**钉钉通知配置**：

1. 在钉钉群中添加"自定义机器人"
2. 获取 Webhook URL
3. 在 Sentry 中配置 Webhook：
   ```
   https://oapi.dingtalk.com/robot/send?access_token=your-token
   ```

**企业微信通知配置**：

1. 在企业微信中添加"群机器人"
2. 获取 Webhook URL
3. 在 Sentry 中配置 Webhook

### 4. 服务端监控（Prometheus + Grafana）

#### 4.1 Prometheus 简介

**Prometheus** 是一个开源的监控和告警系统，主要用于服务端监控。

**核心概念**：

- **指标（Metrics）**：时间序列数据
- **采集器（Exporter）**：收集指标的工具
- **查询语言（PromQL）**：查询指标的语言
- **告警管理器（Alertmanager）**：处理告警

**适用场景**：

- 服务器资源监控（CPU、内存、磁盘）
- 应用性能监控（API 响应时间、请求量）
- 数据库监控
- 容器监控（Docker、Kubernetes）

#### 4.2 Grafana 简介

**Grafana** 是一个开源的数据可视化平台，通常与 Prometheus 配合使用。

**核心功能**：

- 数据可视化（图表、仪表盘）
- 告警配置
- 多数据源支持（Prometheus、InfluxDB、Elasticsearch 等）

#### 4.3 前端应用集成 Prometheus

**使用 prom-client 库**：

```bash
npm install prom-client
```

**示例代码**：

```javascript
// server.js (Node.js 后端)
const express = require('express');
const client = require('prom-client');

// 创建指标注册表
const register = new client.Registry();

// 添加默认指标（CPU、内存等）
client.collectDefaultMetrics({ register });

// 创建自定义指标
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// 注册指标
register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestTotal);

const app = express();

// 中间件：记录请求指标
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
    httpRequestTotal
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .inc();
  });
  
  next();
});

// 暴露指标端点
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000);
```

**访问指标**：

访问 `http://localhost:3000/metrics` 可以看到 Prometheus 格式的指标数据。

### 5. 日志收集和分析

#### 5.1 ELK Stack 简介

**ELK Stack** 是三个开源工具的集合：

- **Elasticsearch**：搜索引擎和数据库
- **Logstash**：日志收集和处理
- **Kibana**：数据可视化

**工作流程**：

```
应用日志 → Logstash → Elasticsearch → Kibana（可视化）
```

**适用场景**：

- 大规模日志收集和分析
- 日志搜索和过滤
- 日志可视化
- 安全审计

#### 5.2 Loki 简介

**Loki** 是 Grafana 开发的日志聚合系统，设计理念类似 Prometheus。

**优势**：

- 轻量级，资源占用少
- 与 Grafana 集成好
- 查询语法类似 PromQL
- 适合容器化环境

**架构**：

```
应用日志 → Promtail（采集） → Loki（存储） → Grafana（可视化）
```

#### 5.3 前端日志收集

**使用 winston 库（Node.js）**：

```bash
npm install winston
```

**示例代码**：

```javascript
// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // 控制台输出
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    // 文件输出
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

module.exports = logger;
```

**使用示例**：

```javascript
const logger = require('./logger');

logger.info('User logged in', { userId: '123', ip: '192.168.1.1' });
logger.error('Database connection failed', { error: error.message });
```

**前端日志收集**：

```javascript
// 前端日志收集工具
class Logger {
  constructor() {
    this.logs = [];
  }

  log(level, message, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
    };

    this.logs.push(logEntry);

    // 发送到服务器
    this.sendToServer(logEntry);
  }

  sendToServer(logEntry) {
    // 批量发送，减少请求
    if (this.logs.length >= 10) {
      fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.logs),
      });
      this.logs = [];
    }
  }

  getUserId() {
    // 从 localStorage 或 cookie 获取用户 ID
    return localStorage.getItem('userId') || 'anonymous';
  }
}

const logger = new Logger();

// 使用
logger.log('info', 'Page loaded', { page: 'home' });
logger.log('error', 'API request failed', { url: '/api/users', error: 'Network Error' });
```

### 6. 故障排查和应急响应

#### 6.1 故障排查流程

**故障排查步骤**：

1. **确认问题**：
   - 问题现象是什么？
   - 影响范围有多大？
   - 什么时候开始的？

2. **收集信息**：
   - 查看错误日志（Sentry、服务器日志）
   - 查看性能监控（响应时间、错误率）
   - 查看用户反馈

3. **定位问题**：
   - 前端问题还是后端问题？
   - 是代码问题还是配置问题？
   - 是性能问题还是功能问题？

4. **解决问题**：
   - 快速修复（热修复、回滚）
   - 根本解决（代码修复、配置调整）

5. **验证和总结**：
   - 验证问题是否解决
   - 总结问题和解决方案
   - 更新文档和流程

#### 6.2 常见故障场景和排查

**场景 1：页面白屏**

**排查步骤**：

1. 检查浏览器控制台错误
2. 检查网络请求（Network 面板）
3. 检查 Sentry 错误报告
4. 检查资源加载（JS、CSS 文件）

**常见原因**：

- JavaScript 错误导致应用崩溃
- 资源加载失败（404、CORS）
- 构建配置错误（路径错误）

**解决方案**：

```javascript
// 添加全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  Sentry.captureException(event.error);
  // 显示友好的错误提示
  showErrorPage();
});

// 添加未处理的 Promise 拒绝处理
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  Sentry.captureException(event.reason);
});
```

**场景 2：API 请求失败**

**排查步骤**：

1. 检查网络连接
2. 检查 API 端点是否正确
3. 检查请求头和参数
4. 检查服务器日志
5. 检查 CORS 配置

**常见原因**：

- 网络问题
- 服务器宕机
- CORS 配置错误
- 认证失败

**解决方案**：

```javascript
// 添加请求重试机制
async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// 添加请求拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // 服务器返回错误
      Sentry.captureException(error);
      if (error.response.status === 500) {
        // 服务器错误，显示友好提示
        showServerError();
      }
    } else if (error.request) {
      // 请求发送失败
      showNetworkError();
    }
    return Promise.reject(error);
  }
);
```

**场景 3：性能问题（页面加载慢）**

**排查步骤**：

1. 使用 Chrome DevTools Performance 面板分析
2. 检查 Core Web Vitals 指标
3. 检查资源加载时间（Network 面板）
4. 检查服务器响应时间（TTFB）

**常见原因**：

- 资源文件过大
- 服务器响应慢
- 第三方脚本阻塞
- 未使用 CDN

**解决方案**：

- 代码分割和懒加载
- 图片优化（压缩、WebP、懒加载）
- 使用 CDN 加速
- 优化服务器配置

**场景 4：内存泄漏**

**排查步骤**：

1. 使用 Chrome DevTools Memory 面板
2. 检查内存使用趋势
3. 查找未清理的事件监听器
4. 查找未清理的定时器

**常见原因**：

- 事件监听器未移除
- 定时器未清理
- 闭包引用
- 全局变量累积

**解决方案**：

```javascript
// Vue 组件中清理
export default {
  mounted() {
    this.timer = setInterval(() => {
      // 定时任务
    }, 1000);
    
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // 清理定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    // 移除事件监听器
    window.removeEventListener('resize', this.handleResize);
  },
};

// React 组件中清理
useEffect(() => {
  const timer = setInterval(() => {
    // 定时任务
  }, 1000);
  
  const handleResize = () => {
    // 处理 resize
  };
  window.addEventListener('resize', handleResize);
  
  return () => {
    clearInterval(timer);
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

#### 6.3 应急响应流程

**应急响应步骤**：

1. **快速响应**（5 分钟内）：
   - 确认问题影响范围
   - 通知相关人员
   - 启动应急响应流程

2. **问题定位**（15 分钟内）：
   - 查看监控和日志
   - 定位问题根因
   - 评估修复时间

3. **快速修复**（30 分钟内）：
   - 实施快速修复（回滚、热修复）
   - 验证修复效果
   - 监控恢复情况

4. **后续处理**（24 小时内）：
   - 根本原因分析（RCA）
   - 制定长期解决方案
   - 更新文档和流程
   - 团队复盘

**回滚策略**：

```bash
# Git 回滚到上一个版本
git revert HEAD
git push origin main

# 或者回滚到指定版本
git checkout <commit-hash>
git push origin main --force

# Docker 镜像回滚
docker pull your-registry/app:v1.0.0
docker-compose up -d
```

### 7. 性能优化报告生成

#### 7.1 报告内容结构

**性能优化报告应包含**：

1. **执行摘要**：
   - 优化目标
   - 优化成果（数据对比）
   - 关键指标改善

2. **现状分析**：
   - 当前性能指标
   - 问题识别
   - 瓶颈分析

3. **优化措施**：
   - 具体优化项
   - 实施步骤
   - 技术方案

4. **效果对比**：
   - 优化前后数据对比
   - 性能指标改善
   - 用户体验提升

5. **后续计划**：
   - 持续优化方向
   - 监控指标
   - 优化计划

#### 7.2 数据收集和分析

**使用 Lighthouse CI**：

```bash
# 安装
npm install -g @lhci/cli

# 配置 .lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

# 运行
lhci autorun
```

**使用 Web Vitals 库**：

```bash
npm install web-vitals
```

```javascript
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  // 发送到分析服务
  console.log(metric);
  
  // 发送到 Sentry
  Sentry.metrics.distribution(metric.name, metric.value, {
    tags: {
      id: metric.id,
      name: metric.name,
      rating: metric.rating,
    },
  });
}

onCLS(sendToAnalytics);
onFID(sendToAnalytics);
onFCP(sendToAnalytics);
onLCP(sendToAnalytics);
onTTFB(sendToAnalytics);
```

#### 7.3 报告模板

**Markdown 报告模板**：

```markdown
# 性能优化报告

## 执行摘要

### 优化目标
- 提升页面加载速度
- 改善 Core Web Vitals 指标
- 降低错误率

### 优化成果
| 指标 | 优化前 | 优化后 | 改善 |
|------|--------|--------|------|
| LCP | 3.2s | 1.8s | 43.8% ↓ |
| FID | 150ms | 80ms | 46.7% ↓ |
| CLS | 0.25 | 0.05 | 80% ↓ |
| 错误率 | 2.5% | 0.5% | 80% ↓ |

## 现状分析

### 当前性能指标
- LCP: 3.2s（需要改进）
- FID: 150ms（需要改进）
- CLS: 0.25（需要改进）

### 问题识别
1. 图片未优化，导致 LCP 过高
2. JavaScript 执行时间过长，导致 FID 过高
3. 布局偏移严重，导致 CLS 过高

## 优化措施

### 1. 图片优化
- 实施 WebP 格式转换
- 添加图片懒加载
- 压缩图片大小

### 2. JavaScript 优化
- 代码分割和懒加载
- 移除未使用的代码
- 优化第三方脚本

### 3. 布局优化
- 为图片设置尺寸属性
- 使用骨架屏
- 优化字体加载

## 效果对比

### 性能指标对比
[图表展示优化前后对比]

### 用户体验提升
- 页面加载速度提升 43.8%
- 交互响应速度提升 46.7%
- 布局稳定性提升 80%

## 后续计划

1. 持续监控 Core Web Vitals
2. 定期进行性能审计
3. 优化第三方脚本加载
4. 实施 Service Worker 缓存策略
```

## 🛠️ 实践任务

### 任务 1：配置 Sentry 错误监控（2 小时）

**目标**：为前端项目配置 Sentry 错误监控，实现错误自动捕获和告警。

**步骤**：

1. **创建 Sentry 项目**：
   - 访问 [sentry.io](https://sentry.io) 注册账号
   - 创建新项目（选择 Vue/React/JavaScript）
   - 获取 DSN

2. **安装和配置 Sentry**：
   ```bash
   # Vue 项目
   npm install @sentry/vue @sentry/tracing
   
   # React 项目
   npm install @sentry/react @sentry/tracing
   
   # 纯 JavaScript 项目
   npm install @sentry/browser @sentry/tracing
   ```

3. **初始化 Sentry**：
   - 在 `main.js` 或 `main.jsx` 中初始化 Sentry
   - 配置 DSN、环境、版本等信息
   - 配置性能监控采样率

4. **配置 Source Map**：
   - 在构建配置中启用 Source Map
   - 配置上传 Source Map 到 Sentry（可选）

5. **测试错误捕获**：
   ```javascript
   // 故意触发错误
   throw new Error('Test error');
   
   // 查看 Sentry 是否捕获到错误
   ```

6. **配置告警**：
   - 创建告警规则（错误数量阈值）
   - 配置通知方式（邮件、钉钉、企业微信）

**验收标准**：
- [ ] Sentry 成功捕获 JavaScript 错误
- [ ] 错误信息包含堆栈跟踪和上下文
- [ ] 告警规则配置成功，能够收到通知
- [ ] Source Map 配置成功（可选），能够定位原始代码位置

### 任务 2：实现性能监控和告警（2 小时）

**目标**：实现 Core Web Vitals 监控，并配置性能告警。

**步骤**：

1. **安装 Web Vitals 库**：
   ```bash
   npm install web-vitals
   ```

2. **集成性能监控**：
   ```javascript
   // performance-monitor.js
   import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
   import * as Sentry from '@sentry/browser';

   function sendToAnalytics(metric) {
     // 发送到 Sentry
     Sentry.metrics.distribution(metric.name, metric.value, {
       tags: {
         id: metric.id,
         name: metric.name,
         rating: metric.rating,
       },
     });

     // 发送到自定义分析服务（可选）
     fetch('/api/performance', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(metric),
     });
   }

   // 监控所有 Core Web Vitals
   onCLS(sendToAnalytics);
   onFID(sendToAnalytics);
   onFCP(sendToAnalytics);
   onLCP(sendToAnalytics);
   onTTFB(sendToAnalytics);
   ```

3. **在应用入口引入**：
   ```javascript
   // main.js
   import './performance-monitor';
   ```

4. **配置性能告警**：
   - 在 Sentry 中创建性能告警规则
   - 设置阈值（如 LCP > 2.5s）
   - 配置通知方式

5. **测试性能监控**：
   - 使用 Chrome DevTools 模拟慢网络
   - 验证性能指标是否被正确收集
   - 验证告警是否触发

**验收标准**：
- [ ] Core Web Vitals 指标成功收集
- [ ] 性能数据发送到 Sentry
- [ ] 性能告警规则配置成功
- [ ] 能够收到性能告警通知

### 任务 3：编写故障排查手册（1.5 小时）

**目标**：编写一份详细的故障排查手册，包含常见故障场景和排查流程。

**步骤**：

1. **创建故障排查手册文档**：
   ```markdown
   # 故障排查手册

   ## 1. 页面白屏

   ### 现象
   - 页面完全空白，没有任何内容

   ### 排查步骤
   1. 打开浏览器控制台，查看错误信息
   2. 检查 Network 面板，查看资源加载情况
   3. 查看 Sentry 错误报告
   4. 检查构建配置和资源路径

   ### 常见原因
   - JavaScript 错误导致应用崩溃
   - 资源加载失败（404、CORS）
   - 构建配置错误

   ### 解决方案
   - 修复 JavaScript 错误
   - 检查资源路径和 CORS 配置
   - 验证构建配置

   ## 2. API 请求失败

   ### 现象
   - API 请求返回错误或超时

   ### 排查步骤
   1. 检查网络连接
   2. 检查 API 端点是否正确
   3. 检查请求头和参数
   4. 查看服务器日志
   ...
   ```

2. **包含以下内容**：
   - 常见故障场景（至少 5 个）
   - 每个场景的排查步骤
   - 常见原因和解决方案
   - 应急响应流程
   - 回滚策略

3. **添加排查工具和命令**：
   - 浏览器 DevTools 使用技巧
   - 服务器日志查看命令
   - 监控平台使用指南

**验收标准**：
- [ ] 包含至少 5 个常见故障场景
- [ ] 每个场景有详细的排查步骤
- [ ] 包含应急响应流程
- [ ] 文档清晰易懂，便于团队使用

### 任务 4：生成性能优化报告（1.5 小时）

**目标**：使用 Lighthouse 和 Web Vitals 收集性能数据，生成性能优化报告。

**步骤**：

1. **安装 Lighthouse CI**：
   ```bash
   npm install -g @lhci/cli
   ```

2. **配置 Lighthouse CI**：
   ```javascript
   // .lighthouserc.js
   module.exports = {
     ci: {
       collect: {
         url: ['http://localhost:3000'],
         numberOfRuns: 3,
       },
       assert: {
         assertions: {
           'categories:performance': ['error', { minScore: 0.9 }],
         },
       },
     },
   };
   ```

3. **运行性能测试**：
   ```bash
   # 开发环境
   npm run dev
   
   # 另一个终端运行 Lighthouse
   lhci autorun
   ```

4. **收集性能数据**：
   - 使用 Chrome DevTools Performance 面板
   - 使用 Web Vitals 库收集真实用户数据
   - 使用 Sentry 性能监控数据

5. **生成优化报告**：
   - 对比优化前后的性能指标
   - 分析性能瓶颈
   - 提出优化建议
   - 使用 Markdown 格式编写报告

6. **报告内容**：
   - 执行摘要（优化目标和成果）
   - 现状分析（当前性能指标）
   - 优化措施（具体优化项）
   - 效果对比（优化前后数据）
   - 后续计划（持续优化方向）

**验收标准**：
- [ ] 使用 Lighthouse 收集性能数据
- [ ] 报告包含优化前后的数据对比
- [ ] 报告包含具体的优化措施和效果
- [ ] 报告格式清晰，数据可视化

### 任务 5：（可选）分析公司部署方案的监控和告警机制（2 小时）

**目标**：调研公司当前的监控和告警机制，分析优缺点并提出改进建议。

**步骤**：

1. **调研当前监控方案**：
   - 使用的监控工具（Sentry、Prometheus、自研等）
   - 监控的指标和范围
   - 告警配置和通知方式

2. **分析优缺点**：
   - 与学习的最佳实践对比
   - 识别可以优化的点
   - 分析成本和收益

3. **提出改进建议**：
   - 针对识别的问题设计优化方案
   - 评估实施成本和难度
   - 制定实施计划

4. **编写分析报告**：
   - 当前方案概述
   - 优缺点分析
   - 改进建议和实施计划

**验收标准**：
- [ ] 完成公司监控方案调研
- [ ] 识别至少 3 个优化点
- [ ] 提出具体的改进建议
- [ ] 编写完整的分析报告

## 📝 学习检查清单

完成本日学习后，检查以下内容：

- [ ] 理解性能监控的重要性和核心指标
- [ ] 掌握 Sentry 错误监控的配置和使用
- [ ] 了解 Prometheus 和 Grafana 的基本概念
- [ ] 理解日志收集和分析方案（ELK、Loki）
- [ ] 掌握 Core Web Vitals 指标的含义和优化方法
- [ ] 完成 Sentry 错误监控配置
- [ ] 完成性能监控和告警配置
- [ ] 编写故障排查手册
- [ ] 生成性能优化报告
- [ ] （可选）完成公司监控方案分析

## 🔗 学习资源推荐

### 官方文档

- **Sentry 文档**：https://docs.sentry.io/
- **Prometheus 文档**：https://prometheus.io/docs/
- **Grafana 文档**：https://grafana.com/docs/
- **Web Vitals**：https://web.dev/vitals/
- **Lighthouse**：https://developers.google.com/web/tools/lighthouse

### 工具和库

- **Sentry**：https://sentry.io/
- **Prometheus**：https://prometheus.io/
- **Grafana**：https://grafana.com/
- **Loki**：https://grafana.com/oss/loki/
- **ELK Stack**：https://www.elastic.co/what-is/elk-stack

### 文章和教程

- **Core Web Vitals 优化指南**：https://web.dev/vitals/
- **前端监控最佳实践**：https://developer.mozilla.org/zh-CN/docs/Web/Performance
- **Sentry 使用教程**：https://docs.sentry.io/platforms/javascript/

## 💡 注意事项

1. **监控采样率**：生产环境建议设置合理的采样率，避免数据量过大
2. **隐私保护**：注意用户隐私，不要收集敏感信息
3. **成本控制**：监控服务可能产生费用，注意控制使用量
4. **告警阈值**：设置合理的告警阈值，避免告警疲劳
5. **持续优化**：监控是持续的过程，需要定期审查和优化

## 🎯 总结

Day 15 的学习重点是建立完整的性能监控和故障排查体系。通过今天的学习，你将能够：

1. **监控应用性能**：使用 Sentry、Web Vitals 等工具监控应用性能和错误
2. **快速定位问题**：通过日志和监控数据快速定位问题根因
3. **及时响应故障**：建立应急响应流程，快速修复问题
4. **持续优化**：通过性能报告指导后续优化工作

性能监控和故障排查是确保应用稳定运行的关键，需要持续关注和优化。建议在实际项目中持续实践，积累经验。

