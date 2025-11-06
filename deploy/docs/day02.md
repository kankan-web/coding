# Day 2: HTTP 服务器基础 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 理解 HTTP 协议的核心概念（状态码、请求头、响应头）
- 使用 Node.js 框架（Express、Koa）搭建静态文件服务器
- 正确配置 MIME 类型，确保浏览器正确识别资源类型
- 理解并配置 CORS 跨域处理，解决前后端分离项目的跨域问题
- 配置安全响应头，防护 XSS、CSRF 等常见 Web 攻击
- 实现简单的路由和中间件，理解服务器请求处理流程

## 核心知识点

### 1. HTTP 协议基础

#### HTTP 状态码

HTTP 状态码用于表示服务器对请求的处理结果，分为 5 大类：

- **1xx（信息性状态码）**
  - `100 Continue`: 服务器已收到请求头，客户端应继续发送请求体
  - `101 Switching Protocols`: 服务器根据客户端请求切换协议

- **2xx（成功状态码）**
  - `200 OK`: 请求成功，返回响应数据
  - `201 Created`: 请求成功，资源已创建
  - `204 No Content`: 请求成功，但无内容返回
  - `206 Partial Content`: 部分内容请求成功（用于断点续传）

- **3xx（重定向状态码）**
  - `301 Moved Permanently`: 永久重定向
  - `302 Found`: 临时重定向
  - `304 Not Modified`: 资源未修改，使用缓存（协商缓存）

- **4xx（客户端错误状态码）**
  - `400 Bad Request`: 请求语法错误
  - `401 Unauthorized`: 未授权，需要身份验证
  - `403 Forbidden`: 服务器拒绝请求
  - `404 Not Found`: 资源不存在
  - `405 Method Not Allowed`: 请求方法不允许

- **5xx（服务器错误状态码）**
  - `500 Internal Server Error`: 服务器内部错误
  - `502 Bad Gateway`: 网关错误
  - `503 Service Unavailable`: 服务不可用
  - `504 Gateway Timeout`: 网关超时

#### HTTP 请求头（Request Headers）

常见的请求头及其作用：

- **Accept**: 客户端可接受的响应内容类型
  ```
  Accept: text/html,application/json,image/webp,*/*
  ```

- **Accept-Encoding**: 客户端支持的压缩编码
  ```
  Accept-Encoding: gzip, deflate, br
  ```

- **Accept-Language**: 客户端支持的语言
  ```
  Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
  ```

- **Authorization**: 身份验证信息（Bearer Token、Basic Auth 等）
  ```
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

- **Content-Type**: 请求体的媒体类型
  ```
  Content-Type: application/json
  Content-Type: application/x-www-form-urlencoded
  Content-Type: multipart/form-data
  ```

- **Cookie**: 客户端发送的 Cookie 信息
  ```
  Cookie: sessionId=abc123; theme=dark
  ```

- **Origin**: 请求的来源（用于 CORS）
  ```
  Origin: https://example.com
  ```

- **Referer**: 当前请求的来源页面
  ```
  Referer: https://example.com/page1
  ```

- **User-Agent**: 客户端信息（浏览器、操作系统等）
  ```
  User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) ...
  ```

#### HTTP 响应头（Response Headers）

常见的响应头及其作用：

- **Content-Type**: 响应体的媒体类型（MIME 类型）
  ```
  Content-Type: text/html; charset=utf-8
  Content-Type: application/json
  Content-Type: image/png
  ```

- **Content-Length**: 响应体的字节长度
  ```
  Content-Length: 2048
  ```

- **Content-Encoding**: 响应体的压缩编码
  ```
  Content-Encoding: gzip
  ```

- **Cache-Control**: 缓存控制指令
  ```
  Cache-Control: public, max-age=3600
  Cache-Control: no-cache, no-store, must-revalidate
  ```

- **ETag**: 资源的版本标识符（用于协商缓存）
  ```
  ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
  ```

- **Last-Modified**: 资源最后修改时间（用于协商缓存）
  ```
  Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
  ```

- **Set-Cookie**: 服务器设置 Cookie
  ```
  Set-Cookie: sessionId=abc123; Path=/; HttpOnly; Secure
  ```

- **Access-Control-Allow-Origin**: CORS 跨域允许的来源
  ```
  Access-Control-Allow-Origin: https://example.com
  Access-Control-Allow-Origin: *
  ```

- **Location**: 重定向目标 URL
  ```
  Location: https://example.com/new-page
  ```

- **X-Frame-Options**: 防止页面被嵌入 iframe（XSS 防护）
  ```
  X-Frame-Options: DENY
  X-Frame-Options: SAMEORIGIN
  ```

- **X-Content-Type-Options**: 防止 MIME 类型嗅探
  ```
  X-Content-Type-Options: nosniff
  ```

- **X-XSS-Protection**: 启用浏览器 XSS 过滤器
  ```
  X-XSS-Protection: 1; mode=block
  ```

- **Strict-Transport-Security**: 强制 HTTPS（HSTS）
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  ```

### 2. 静态文件服务器

#### Express 框架

Express 是 Node.js 最流行的 Web 框架，特点：

- **简单易用**: API 设计简洁，学习曲线平缓
- **中间件机制**: 丰富的中间件生态
- **路由系统**: 灵活的路由配置
- **静态文件服务**: 内置 `express.static` 中间件

#### Koa 框架

Koa 是 Express 团队开发的下一代 Web 框架，特点：

- **异步流程控制**: 基于 async/await，更好的错误处理
- **轻量级**: 核心功能精简，通过中间件扩展
- **上下文对象**: 封装 request 和 response，提供更优雅的 API
- **中间件机制**: 基于洋葱模型，执行顺序更清晰

#### Express vs Koa 对比

| 特性 | Express | Koa |
|------|---------|-----|
| 异步处理 | 回调函数 | async/await |
| 中间件机制 | 线性执行 | 洋葱模型 |
| 错误处理 | 需要手动处理 | 更好的错误捕获 |
| 学习曲线 | 平缓 | 需要理解 async/await |
| 生态成熟度 | 非常成熟 | 成熟，但生态相对较小 |
| 适用场景 | 中小型项目、快速开发 | 大型项目、需要更好的异步控制 |

#### 静态文件服务原理

静态文件服务器的主要功能：

1. **文件读取**: 根据请求路径读取对应的文件
2. **MIME 类型识别**: 根据文件扩展名设置正确的 Content-Type
3. **目录索引**: 可选的目录列表功能
4. **缓存控制**: 设置适当的缓存响应头
5. **错误处理**: 文件不存在时返回 404

### 3. MIME 类型配置

#### MIME 类型概念

MIME（Multipurpose Internet Mail Extensions）类型用于标识资源的媒体类型，格式为：

```
type/subtype
```

例如：
- `text/html`: HTML 文档
- `text/css`: CSS 样式表
- `text/javascript`: JavaScript 文件
- `application/json`: JSON 数据
- `image/png`: PNG 图片
- `video/mp4`: MP4 视频

#### 常见 MIME 类型映射

| 文件扩展名 | MIME 类型 |
|-----------|----------|
| .html | text/html |
| .css | text/css |
| .js | text/javascript 或 application/javascript |
| .json | application/json |
| .png | image/png |
| .jpg, .jpeg | image/jpeg |
| .gif | image/gif |
| .svg | image/svg+xml |
| .woff | font/woff |
| .woff2 | font/woff2 |
| .ttf | font/ttf |
| .pdf | application/pdf |
| .zip | application/zip |

#### MIME 类型配置的重要性

- **浏览器正确解析**: 确保浏览器使用正确的解析器处理资源
- **安全防护**: 防止 MIME 类型嗅探攻击
- **性能优化**: 浏览器可以根据类型优化处理方式

#### 配置 MIME 类型的方法

1. **Express 配置**
   ```javascript
   app.use(express.static('public', {
     setHeaders: (res, path) => {
       if (path.endsWith('.js')) {
         res.setHeader('Content-Type', 'application/javascript');
       }
     }
   }));
   ```

2. **Koa 配置**
   ```javascript
   const serve = require('koa-static');
   const mime = require('mime-types');
   
   app.use(async (ctx, next) => {
     await next();
     if (ctx.path.startsWith('/static')) {
       const mimeType = mime.lookup(ctx.path);
       if (mimeType) {
         ctx.type = mimeType;
       }
     }
   });
   ```

3. **使用第三方库**
   - `mime-types`: 根据文件扩展名自动识别 MIME 类型
   - `mime`: 功能类似，提供 MIME 类型映射

### 4. CORS 跨域处理

#### 同源策略

浏览器同源策略限制：

- **协议相同**: http 和 https 不同源
- **域名相同**: example.com 和 subdomain.example.com 不同源
- **端口相同**: localhost:3000 和 localhost:8080 不同源

#### CORS 机制

CORS（Cross-Origin Resource Sharing）允许服务器声明允许哪些源访问资源。

**简单请求（Simple Request）**:
- 方法：GET、POST、HEAD
- 请求头：仅允许标准请求头
- 服务器返回 `Access-Control-Allow-Origin` 即可

**预检请求（Preflight Request）**:
- 方法：PUT、DELETE、PATCH 等
- 自定义请求头（如 `Authorization`）
- 需要先发送 OPTIONS 请求，服务器返回允许的请求方法和头

#### CORS 响应头

- **Access-Control-Allow-Origin**: 允许的源
  ```
  Access-Control-Allow-Origin: https://example.com
  Access-Control-Allow-Origin: *  // 允许所有源（不推荐）
  ```

- **Access-Control-Allow-Methods**: 允许的 HTTP 方法
  ```
  Access-Control-Allow-Methods: GET, POST, PUT, DELETE
  ```

- **Access-Control-Allow-Headers**: 允许的请求头
  ```
  Access-Control-Allow-Headers: Content-Type, Authorization
  ```

- **Access-Control-Allow-Credentials**: 是否允许携带凭证（Cookie）
  ```
  Access-Control-Allow-Credentials: true
  ```

- **Access-Control-Max-Age**: 预检请求缓存时间
  ```
  Access-Control-Max-Age: 86400
  ```

#### CORS 配置最佳实践

1. **明确指定允许的源**: 不要使用 `*`，明确列出允许的域名
2. **限制允许的方法**: 只允许必要的 HTTP 方法
3. **限制允许的请求头**: 只允许必要的请求头
4. **谨慎使用 Credentials**: 设置 `Access-Control-Allow-Credentials: true` 时，不能使用 `*` 作为源

### 5. 安全头配置

#### XSS（跨站脚本攻击）防护

**X-Frame-Options**: 防止页面被嵌入 iframe
```
X-Frame-Options: DENY          // 禁止嵌入
X-Frame-Options: SAMEORIGIN    // 只允许同源嵌入
```

**X-Content-Type-Options**: 防止 MIME 类型嗅探
```
X-Content-Type-Options: nosniff
```
防止浏览器将非脚本文件当作脚本执行

**X-XSS-Protection**: 启用浏览器内置 XSS 过滤器
```
X-XSS-Protection: 1; mode=block
```
现代浏览器已内置，但设置此头可兼容旧浏览器

**Content-Security-Policy (CSP)**: 内容安全策略（最强大的防护）
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```
限制页面可以加载的资源来源，防止 XSS 攻击

#### CSRF（跨站请求伪造）防护

**SameSite Cookie**: Cookie 的 SameSite 属性
```
Set-Cookie: sessionId=abc123; SameSite=Strict
SameSite=Lax    // 允许 GET 请求携带，阻止 POST 请求
SameSite=Strict // 完全阻止跨站请求携带 Cookie
```

**Referer 检查**: 验证请求来源
```javascript
const referer = req.headers.referer;
if (referer && !referer.startsWith('https://example.com')) {
  return res.status(403).send('Forbidden');
}
```

**CSRF Token**: 使用 CSRF Token 验证请求
```javascript
// 生成 Token
const csrfToken = crypto.randomBytes(32).toString('hex');
// 返回给客户端，客户端在请求时携带
```

#### 其他安全头

**Strict-Transport-Security (HSTS)**: 强制 HTTPS
```
Strict-Transport-Security: max-age=31536000; includeSubDomains
```
告诉浏览器在指定时间内只使用 HTTPS 访问

**Permissions-Policy**: 控制浏览器功能权限
```
Permissions-Policy: geolocation=(), microphone=()
```
限制页面对浏览器功能的访问

**Referrer-Policy**: 控制 Referer 头的发送
```
Referrer-Policy: strict-origin-when-cross-origin
```

## 实战任务

### 任务 1: 使用 Express 搭建静态文件服务器

#### 步骤 1: 创建项目并安装依赖

```bash
# 创建项目目录
mkdir express-static-server
cd express-static-server

# 初始化项目
npm init -y

# 安装 Express
npm install express

# 安装开发依赖（用于开发时的热重载）
npm install --save-dev nodemon
```

#### 步骤 2: 创建基础服务器

创建 `server.js` 文件：

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static('public'));

// 基础路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

#### 步骤 3: 配置 MIME 类型

```javascript
const express = require('express');
const path = require('path');
const mime = require('mime-types');

const app = express();

// 自定义静态文件中间件，配置 MIME 类型
app.use((req, res, next) => {
  if (req.path.startsWith('/static/')) {
    const filePath = path.join(__dirname, 'public', req.path);
    const ext = path.extname(filePath);
    const mimeType = mime.lookup(ext);
    
    if (mimeType) {
      res.setHeader('Content-Type', mimeType);
    }
    
    // 设置字符编码（文本文件）
    if (mimeType && mimeType.startsWith('text/')) {
      res.setHeader('Content-Type', `${mimeType}; charset=utf-8`);
    }
  }
  next();
});

app.use(express.static('public'));
```

#### 步骤 4: 配置 CORS

```javascript
const express = require('express');

const app = express();

// CORS 中间件
app.use((req, res, next) => {
  // 允许的源列表（生产环境应从环境变量读取）
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://example.com'
  ];
  
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // 允许的 HTTP 方法
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  // 允许的请求头
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 允许携带凭证
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // 预检请求缓存时间（24小时）
  res.setHeader('Access-Control-Max-Age', '86400');
  
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
```

或者使用 `cors` 中间件（推荐）：

```bash
npm install cors
```

```javascript
const cors = require('cors');

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://example.com'
    ];
    
    // 允许无 origin 的请求（如移动应用）
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('不允许的 CORS 源'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
};

app.use(cors(corsOptions));
```

#### 步骤 5: 配置安全响应头

```javascript
const express = require('express');
const helmet = require('helmet');

const app = express();

// 使用 helmet 中间件（推荐）
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // 生产环境应移除 'unsafe-inline'
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

或者手动配置：

```javascript
app.use((req, res, next) => {
  // XSS 防护
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // CSP（内容安全策略）
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  
  // HSTS
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  next();
});
```

#### 步骤 6: 实现简单的路由和中间件

```javascript
const express = require('express');

const app = express();

// 中间件：请求日志
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 中间件：JSON 解析
app.use(express.json());

// 中间件：URL 编码解析
app.use(express.urlencoded({ extended: true }));

// 路由：获取用户信息
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  res.json({
    id: userId,
    name: 'John Doe',
    email: 'john@example.com'
  });
});

// 路由：创建用户
app.post('/api/user', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '资源未找到',
    path: req.path
  });
});
```

#### 步骤 7: 完整的 Express 服务器示例

创建 `server.js`：

```javascript
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// 安全头配置
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true
  }
}));

// CORS 配置
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// 请求体解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 静态文件服务（带 MIME 类型配置）
app.use(express.static('public', {
  setHeaders: (res, filePath) => {
    // 设置缓存控制
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// API 路由
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    error: '资源未找到',
    path: req.path
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});
```

创建 `package.json` 的 scripts：

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 任务 2: 使用 Koa 搭建静态文件服务器

#### 步骤 1: 创建项目并安装依赖

```bash
# 创建项目目录
mkdir koa-static-server
cd koa-static-server

# 初始化项目
npm init -y

# 安装 Koa 和相关中间件
npm install koa koa-static koa-router koa-bodyparser koa-cors
npm install --save-dev nodemon
```

#### 步骤 2: 创建基础服务器

创建 `server.js`：

```javascript
const Koa = require('koa');
const serve = require('koa-static');
const path = require('path');

const app = new Koa();
const PORT = process.env.PORT || 3000;

// 静态文件服务
app.use(serve(path.join(__dirname, 'public')));

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
```

#### 步骤 3: 配置 MIME 类型

```javascript
const Koa = require('koa');
const serve = require('koa-static');
const mime = require('mime-types');
const path = require('path');

const app = new Koa();

// MIME 类型配置中间件
app.use(async (ctx, next) => {
  await next();
  
  // 设置 MIME 类型
  if (ctx.path.startsWith('/static/')) {
    const mimeType = mime.lookup(ctx.path);
    if (mimeType) {
      ctx.type = mimeType;
    }
  }
});

app.use(serve(path.join(__dirname, 'public')));
```

#### 步骤 4: 配置 CORS

```javascript
const Koa = require('koa');
const cors = require('koa-cors');

const app = new Koa();

// CORS 配置
app.use(cors({
  origin: (ctx) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:8080',
      'https://example.com'
    ];
    
    const origin = ctx.headers.origin;
    if (allowedOrigins.includes(origin)) {
      return origin;
    }
    return false;
  },
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));
```

或者手动实现：

```javascript
app.use(async (ctx, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:8080'];
  const origin = ctx.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    ctx.set('Access-Control-Allow-Origin', origin);
  }
  
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Max-Age', '86400');
  
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
    return;
  }
  
  await next();
});
```

#### 步骤 5: 配置安全响应头

```javascript
const Koa = require('koa');

const app = new Koa();

// 安全头配置中间件
app.use(async (ctx, next) => {
  // XSS 防护
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
  
  // CSP
  ctx.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  
  // HSTS
  ctx.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  
  // Referrer Policy
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  await next();
});
```

#### 步骤 6: 实现路由和中间件

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

// 请求日志中间件
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// 请求体解析
app.use(bodyParser());

// 路由定义
router.get('/api/user/:id', async (ctx) => {
  const userId = ctx.params.id;
  ctx.body = {
    id: userId,
    name: 'John Doe',
    email: 'john@example.com'
  };
});

router.post('/api/user', async (ctx) => {
  const { name, email } = ctx.request.body;
  ctx.body = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  ctx.status = 201;
});

// 应用路由
app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
  console.error('服务器错误:', err);
  ctx.status = 500;
  ctx.body = {
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  };
});
```

#### 步骤 7: 完整的 Koa 服务器示例

创建 `server.js`：

```javascript
const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const mime = require('mime-types');

const app = new Koa();
const router = new Router();
const PORT = process.env.PORT || 3000;

// 安全头配置
app.use(async (ctx, next) => {
  ctx.set('X-Content-Type-Options', 'nosniff');
  ctx.set('X-Frame-Options', 'DENY');
  ctx.set('X-XSS-Protection', '1; mode=block');
  ctx.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  ctx.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains'
  );
  ctx.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  await next();
});

// CORS 配置
app.use(async (ctx, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
  const origin = ctx.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    ctx.set('Access-Control-Allow-Origin', origin);
  }
  
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  ctx.set('Access-Control-Allow-Credentials', 'true');
  ctx.set('Access-Control-Max-Age', '86400');
  
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200;
    return;
  }
  
  await next();
});

// 请求日志
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${new Date().toISOString()} - ${ctx.method} ${ctx.path} - ${ms}ms`);
});

// 请求体解析
app.use(bodyParser());

// MIME 类型配置
app.use(async (ctx, next) => {
  await next();
  if (ctx.path.startsWith('/static/')) {
    const mimeType = mime.lookup(ctx.path);
    if (mimeType) {
      ctx.type = mimeType;
    }
  }
});

// 静态文件服务
app.use(serve(path.join(__dirname, 'public'), {
  maxage: 31536000, // 1 年缓存
  gzip: true
}));

// API 路由
router.get('/api/health', async (ctx) => {
  ctx.body = {
    status: 'ok',
    timestamp: new Date().toISOString()
  };
});

router.get('/api/user/:id', async (ctx) => {
  ctx.body = {
    id: ctx.params.id,
    name: 'John Doe',
    email: 'john@example.com'
  };
});

router.post('/api/user', async (ctx) => {
  const { name, email } = ctx.request.body;
  ctx.body = {
    id: Date.now(),
    name,
    email,
    createdAt: new Date().toISOString()
  };
  ctx.status = 201;
});

app.use(router.routes());
app.use(router.allowedMethods());

// 错误处理
app.on('error', (err, ctx) => {
  console.error('服务器错误:', err);
  ctx.status = err.status || 500;
  ctx.body = {
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  };
});

// 404 处理
app.use(async (ctx) => {
  if (ctx.status === 404) {
    ctx.status = 404;
    ctx.body = {
      error: '资源未找到',
      path: ctx.path
    };
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
});
```

### 任务 3: 配置 CORS 和 MIME 类型

参考任务 1 和任务 2 中的相关配置。

### 任务 4: 实现简单的路由和中间件

参考任务 1 和任务 2 中的路由和中间件示例。

### 任务 5: 配置安全响应头

参考任务 1 和任务 2 中的安全头配置示例。

## 需要关注的知识点

### 1. HTTP 协议深入理解

- **请求/响应模型**: HTTP 是基于请求-响应模式的协议
- **无状态性**: HTTP 是无状态协议，每次请求都是独立的
- **持久连接**: HTTP/1.1 支持 Keep-Alive，可以复用 TCP 连接
- **HTTP/2**: 多路复用、服务器推送等特性，提升性能

### 2. 静态文件服务器性能优化

- **Gzip 压缩**: 在服务器层面压缩文本资源
- **缓存策略**: 设置合理的缓存响应头
- **ETag 验证**: 使用 ETag 实现协商缓存
- **文件系统缓存**: Node.js 的文件系统缓存可以减少磁盘 I/O

### 3. CORS 配置的安全考虑

- **不要使用 `*` 作为源**: 明确指定允许的域名
- **限制允许的方法**: 只允许必要的 HTTP 方法
- **限制允许的请求头**: 避免暴露不必要的头信息
- **Credentials 使用**: 设置 `credentials: true` 时，必须明确指定源

### 4. 安全头配置的最佳实践

- **CSP 策略**: 从宽松到严格逐步收紧策略
- **HSTS 配置**: 生产环境 HTTPS 必须配置
- **定期更新**: 关注安全头的最新标准和最佳实践

### 5. Express vs Koa 选择建议

- **Express**: 适合快速开发、中小型项目、团队熟悉回调风格
- **Koa**: 适合大型项目、需要更好的异步控制、团队熟悉 async/await

### 6. 常见问题和解决方案

**问题 1: 静态文件返回错误的 MIME 类型**

- **症状**: 浏览器无法正确解析文件（如 JS 文件当作文本显示）
- **原因**: 服务器未正确设置 Content-Type 响应头
- **解决**:
  1. 使用 `mime-types` 库自动识别
  2. 手动配置常见文件类型的 MIME 映射
  3. 检查服务器配置（Express/Koa）是否正确

**问题 2: CORS 跨域请求失败**

- **症状**: 浏览器控制台报 CORS 错误，请求被阻止
- **原因**: 服务器未正确配置 CORS 响应头
- **解决**:
  1. 检查 `Access-Control-Allow-Origin` 是否正确设置
  2. 预检请求需要处理 OPTIONS 方法
  3. 检查是否允许了必要的请求头和 HTTP 方法
  4. 使用浏览器 DevTools 查看实际的请求和响应头

**问题 3: 安全头配置后页面无法正常加载**

- **症状**: 配置 CSP 后，页面样式或脚本无法加载
- **原因**: CSP 策略过于严格，阻止了必要的资源
- **解决**:
  1. 逐步放宽 CSP 策略，找出被阻止的资源
  2. 使用浏览器控制台的 CSP 错误信息
  3. 生产环境移除 `'unsafe-inline'`，使用 nonce 或 hash

**问题 4: 静态文件缓存不生效**

- **症状**: 文件更新后浏览器仍使用旧版本
- **原因**: 缓存策略配置不当或文件名未包含 hash
- **解决**:
  1. 确保静态资源文件名包含 hash（构建工具配置）
  2. 配置正确的缓存响应头
  3. HTML 文件使用协商缓存或禁用缓存

**问题 5: 路由匹配错误或 404**

- **症状**: 请求返回 404，但文件确实存在
- **原因**: 路由顺序错误或路径配置不正确
- **解决**:
  1. 检查路由定义的顺序（更具体的路由应该在前）
  2. 检查路径是否正确（绝对路径 vs 相对路径）
  3. 使用中间件记录请求路径，调试路由匹配

## 学习检查清单

完成以下检查项，确保掌握 Day 2 内容：

- [ ] 理解 HTTP 状态码的分类和常见状态码的含义
- [ ] 理解常见 HTTP 请求头和响应头的作用
- [ ] 能够使用 Express 搭建静态文件服务器
- [ ] 能够使用 Koa 搭建静态文件服务器
- [ ] 理解 Express 和 Koa 的区别和适用场景
- [ ] 能够正确配置 MIME 类型，确保浏览器正确识别资源
- [ ] 理解 CORS 机制，能够配置跨域请求
- [ ] 理解简单请求和预检请求的区别
- [ ] 能够配置常见的安全响应头（XSS、CSRF 防护）
- [ ] 理解 CSP 策略的作用和配置方法
- [ ] 能够实现简单的路由和中间件
- [ ] 理解中间件的执行顺序和作用
- [ ] 完成了 Express 和 Koa 两个版本的服务器实现
- [ ] 测试了 CORS、MIME 类型、安全头的配置效果
- [ ] 记录了学习笔记和遇到的问题

## 参考资源

- [HTTP 协议规范 (RFC 7231)](https://tools.ietf.org/html/rfc7231)
- [MDN - HTTP 概述](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Overview)
- [Express 官方文档](https://expressjs.com/)
- [Koa 官方文档](https://koajs.com/)
- [MDN - CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [MDN - MIME 类型](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/MIME_types)
- [OWASP - 安全头配置指南](https://owasp.org/www-project-secure-headers/)
- [Content Security Policy (CSP)](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
- [Helmet.js 文档](https://helmetjs.github.io/)

## 学习时间分配建议

- **理论学习**: 1.5 小时
  - HTTP 协议基础: 30 分钟
  - 静态文件服务器概念: 20 分钟
  - MIME 类型配置: 15 分钟
  - CORS 跨域处理: 25 分钟
  - 安全头配置: 20 分钟

- **实践操作**: 2.5 小时
  - Express 服务器搭建: 50 分钟
  - Koa 服务器搭建: 50 分钟
  - CORS 和 MIME 类型配置: 30 分钟
  - 安全头配置和测试: 30 分钟

- **总结笔记**: 30 分钟
  - 记录关键配置和代码
  - 记录遇到的问题和解决方案
  - 对比 Express 和 Koa 的使用体验
  - 总结最佳实践

## 实战练习建议

1. **创建测试项目**
   - 创建一个简单的前端项目（HTML + CSS + JS）
   - 使用 Express 或 Koa 搭建服务器提供静态文件服务

2. **测试不同场景**
   - 测试不同文件类型的 MIME 类型识别
   - 测试 CORS 跨域请求（使用不同端口或域名）
   - 测试安全头的效果（使用浏览器 DevTools）

3. **对比学习**
   - 使用 Express 和 Koa 分别实现相同的功能
   - 对比两者的代码风格和使用体验
   - 理解两者在异步处理上的差异

4. **记录实践过程**
   - 记录配置步骤
   - 记录遇到的问题和解决方案
   - 记录性能测试结果（如响应时间）

5. **总结最佳实践**
   - 整理常用的中间件配置
   - 总结安全头配置的最佳实践
   - 形成自己的服务器配置规范

