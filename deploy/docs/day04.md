# Day 4: Nginx 进阶配置 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 理解 Nginx 反向代理的工作原理和配置方法
- 掌握多种负载均衡算法及其适用场景
- 实现动静分离配置，优化服务器性能
- 熟练使用 URL 重写规则，支持 SPA 路由和 SEO 优化
- 正确处理请求头和响应头，实现完整的代理功能
- 配置多后端服务的负载均衡
- 解决 SPA 应用的路由问题

## 核心知识点

### 1. 反向代理配置（proxy_pass）

#### 反向代理基础概念

**什么是反向代理**

- 反向代理位于客户端和服务器之间，客户端将请求发送给反向代理，反向代理将请求转发给后端服务器
- 客户端不知道真正的后端服务器地址，提高了后端服务器的安全性
- 反向代理可以负载均衡、缓存、SSL 终止等

**反向代理 vs 正向代理**

- **正向代理**：代理客户端，隐藏客户端身份（如 VPN、代理服务器）
- **反向代理**：代理服务器，隐藏服务器身份（如 Nginx、负载均衡器）

#### proxy_pass 指令详解

**基本语法**

```nginx
location /api/ {
    proxy_pass http://backend_server;
}
```

**proxy_pass 后带 URI 和不带 URI 的区别**

- **不带 URI**（末尾没有 `/`）：完整的请求路径会被转发
  ```nginx
  location /api/ {
      proxy_pass http://127.0.0.1:3000;
  }
  # 请求: /api/users
  # 转发到: http://127.0.0.1:3000/api/users
  ```

- **带 URI**（末尾有 `/`）：匹配的 location 路径会被替换
  ```nginx
  location /api/ {
      proxy_pass http://127.0.0.1:3000/;
  }
  # 请求: /api/users
  # 转发到: http://127.0.0.1:3000/users
  ```

**重要配置指令**

1. **proxy_set_header**：设置转发给后端服务器的请求头
   ```nginx
   proxy_set_header Host $host;
   proxy_set_header X-Real-IP $remote_addr;
   proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
   proxy_set_header X-Forwarded-Proto $scheme;
   ```

2. **proxy_connect_timeout**：连接后端服务器的超时时间
   ```nginx
   proxy_connect_timeout 60s;
   ```

3. **proxy_send_timeout**：向后端服务器发送请求的超时时间
   ```nginx
   proxy_send_timeout 60s;
   ```

4. **proxy_read_timeout**：从后端服务器读取响应的超时时间
   ```nginx
   proxy_read_timeout 60s;
   ```

5. **proxy_buffering**：是否启用代理缓冲
   ```nginx
   proxy_buffering on;
   proxy_buffer_size 4k;
   proxy_buffers 8 4k;
   ```

6. **proxy_redirect**：修改后端服务器返回的重定向响应头
   ```nginx
   proxy_redirect http://backend/ http://frontend/;
   ```

#### 完整反向代理配置示例

```nginx
location /api/ {
    # 后端服务器地址
    proxy_pass http://127.0.0.1:3000/;
    
    # 请求头设置
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 超时设置
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
    
    # 缓冲设置
    proxy_buffering on;
    proxy_buffer_size 4k;
    proxy_buffers 8 4k;
    
    # 错误处理
    proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
}
```

### 2. 负载均衡算法

#### 负载均衡基础

**为什么需要负载均衡**

- 提高服务的可用性和可靠性
- 分发请求，避免单点过载
- 支持水平扩展，提高系统吞吐量

**upstream 模块**

- 使用 `upstream` 定义后端服务器组
- 在 `proxy_pass` 中使用 upstream 名称

#### 负载均衡算法详解

**1. 轮询（Round Robin）**

- **默认算法**，按顺序依次将请求分发到每个服务器
- **适用场景**：后端服务器性能相近
- **配置示例**：
  ```nginx
  upstream backend {
      server 127.0.0.1:3001;
      server 127.0.0.1:3002;
      server 127.0.0.1:3003;
  }
  ```

**2. 权重轮询（Weighted Round Robin）**

- 根据权重分配请求，权重高的服务器接收更多请求
- **适用场景**：后端服务器性能不同
- **配置示例**：
  ```nginx
  upstream backend {
      server 127.0.0.1:3001 weight=3;
      server 127.0.0.1:3002 weight=2;
      server 127.0.0.1:3003 weight=1;
  }
  ```

**3. IP Hash（ip_hash）**

- 根据客户端 IP 地址的 hash 值分配请求
- 同一 IP 的请求总是转发到同一服务器
- **适用场景**：需要会话保持（Session Affinity）
- **配置示例**：
  ```nginx
  upstream backend {
      ip_hash;
      server 127.0.0.1:3001;
      server 127.0.0.1:3002;
      server 127.0.0.1:3003;
  }
  ```

**4. 最少连接（least_conn）**

- 将请求分发到当前连接数最少的服务器
- **适用场景**：后端服务器处理时间差异较大
- **配置示例**：
  ```nginx
  upstream backend {
      least_conn;
      server 127.0.0.1:3001;
      server 127.0.0.1:3002;
      server 127.0.0.1:3003;
  }
  ```

**5. 一致性哈希（consistent_hash）**

- 基于请求的某个 key（如 URL）进行 hash 分配
- 当服务器增加或减少时，影响范围最小
- **适用场景**：需要缓存亲和性
- **注意**：需要安装 `nginx-module-consistent-hash` 模块

**服务器状态参数**

- **down**：标记服务器为不可用
  ```nginx
  server 127.0.0.1:3001 down;
  ```

- **backup**：标记为备用服务器，其他服务器不可用时使用
  ```nginx
  server 127.0.0.1:3001 backup;
  ```

- **max_fails**：最大失败次数
  ```nginx
  server 127.0.0.1:3001 max_fails=3;
  ```

- **fail_timeout**：失败超时时间
  ```nginx
  server 127.0.0.1:3001 max_fails=3 fail_timeout=30s;
  ```

#### 完整负载均衡配置示例

```nginx
upstream backend {
    # 使用最少连接算法
    least_conn;
    
    # 主服务器
    server 127.0.0.1:3001 weight=3 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 weight=2 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 weight=1 max_fails=3 fail_timeout=30s;
    
    # 备用服务器
    server 127.0.0.1:3004 backup;
}

server {
    location /api/ {
        proxy_pass http://backend/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 动静分离配置

#### 动静分离原理

**什么是动静分离**

- 将静态资源（HTML、CSS、JS、图片等）和动态请求（API）分开处理
- 静态资源由 Nginx 直接提供，动态请求转发给后端服务器
- **优点**：
  - 减轻后端服务器压力
  - 提高静态资源访问速度
  - 更好的缓存控制

#### 动静分离配置方法

**方法一：基于 location 路径分离**

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    
    # 静态资源直接由 Nginx 提供
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        root /var/www/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # API 请求转发到后端
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # 其他请求转发到后端（如 SSR）
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

**方法二：基于文件类型分离**

```nginx
# 静态资源服务器
server {
    listen 80;
    server_name static.example.com;
    root /var/www/static;
    
    location / {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}

# 动态请求服务器
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```

**方法三：使用 alias 精确控制**

```nginx
location /static/ {
    alias /var/www/static/;
    expires 30d;
    access_log off;
}

location /api/ {
    proxy_pass http://127.0.0.1:3000/;
}
```

#### 动静分离优化技巧

1. **启用 Gzip 压缩**
   ```nginx
   location ~* \.(css|js|json|xml|html)$ {
       gzip on;
       gzip_types text/css application/javascript application/json;
       gzip_min_length 1000;
   }
   ```

2. **静态资源缓存策略**
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
       expires 365d;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **禁用静态资源日志**
   ```nginx
   location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
       access_log off;
   }
   ```

### 4. URL 重写规则（rewrite、return）

#### rewrite 指令详解

**基本语法**

```nginx
rewrite regex replacement [flag];
```

**flag 参数**

- **last**：停止处理当前 rewrite 规则，重新匹配 location
- **break**：停止处理当前 rewrite 规则，不再匹配其他 location
- **redirect**：返回 302 临时重定向
- **permanent**：返回 301 永久重定向

#### 常见 URL 重写场景

**1. SPA 路由支持（重要）**

```nginx
location / {
    try_files $uri $uri/ /index.html;
    # 或者使用 rewrite
    # rewrite ^.*$ /index.html last;
}
```

**2. 去除 .html 扩展名**

```nginx
location / {
    rewrite ^/(.*)\.html$ /$1 permanent;
}
```

**3. 强制 HTTPS**

```nginx
if ($scheme != "https") {
    rewrite ^ https://$host$request_uri permanent;
}
```

**4. 域名重定向**

```nginx
if ($host != "www.example.com") {
    rewrite ^(.*)$ https://www.example.com$1 permanent;
}
```

**5. API 版本控制**

```nginx
location /api/ {
    rewrite ^/api/v1/(.*)$ /api/$1 last;
    proxy_pass http://127.0.0.1:3000;
}
```

**6. 路径重写**

```nginx
# /user/123 -> /api/user?id=123
location /user/ {
    rewrite ^/user/(\d+)$ /api/user?id=$1 last;
    proxy_pass http://127.0.0.1:3000;
}
```

#### return 指令详解

**基本语法**

```nginx
return code [text];
return code URL;
return URL;
```

**常见用法**

```nginx
# 返回状态码
return 403;

# 返回状态码和文本
return 403 "Access Denied";

# 返回重定向
return 301 https://$host$request_uri;
return 302 http://example.com;

# 直接返回 URL（301 重定向）
return https://$host$request_uri;
```

#### SPA 应用完整配置示例

```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/dist;
    index index.html;

    # SPA 路由支持：所有路由都返回 index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 请求转发
    location /api/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
}
```

### 5. 请求头和响应头处理

#### 请求头处理

**proxy_set_header 设置请求头**

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    
    # 必须设置的请求头
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # 自定义请求头
    proxy_set_header X-Custom-Header "value";
    
    # 移除请求头
    proxy_set_header X-Forwarded-For "";
}
```

**常用内置变量**

- `$host`：请求的主机名
- `$remote_addr`：客户端 IP 地址
- `$proxy_add_x_forwarded_for`：追加客户端 IP 到 X-Forwarded-For
- `$scheme`：请求协议（http 或 https）
- `$request_uri`：完整的请求 URI
- `$args`：请求参数

#### 响应头处理

**proxy_hide_header 隐藏响应头**

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    
    # 隐藏后端服务器的响应头
    proxy_hide_header X-Powered-By;
    proxy_hide_header Server;
}
```

**proxy_pass_header 传递响应头**

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    
    # 传递后端服务器的响应头（默认被隐藏的）
    proxy_pass_header X-Custom-Header;
}
```

**add_header 添加响应头**

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    
    # 添加自定义响应头
    add_header X-Custom-Header "value" always;
    
    # 添加安全响应头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

**注意：add_header 的 always 参数**

- 不使用 `always`：只在 2xx、3xx 状态码时添加响应头
- 使用 `always`：在所有状态码时都添加响应头

#### CORS 跨域配置

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3000/;
    
    # 处理预检请求
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range';
        add_header 'Access-Control-Max-Age' 1728000;
        add_header 'Content-Type' 'text/plain; charset=utf-8';
        add_header 'Content-Length' 0;
        return 204;
    }
    
    # 处理实际请求
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' always;
}
```

## 实战任务

### 任务 1: 配置反向代理到后端 API

**目标**：配置 Nginx 将 `/api/` 路径的请求转发到后端 Node.js 服务器

**步骤**：

1. **准备后端服务器**
   - 创建一个简单的 Node.js Express 服务器
   - 监听 3000 端口
   - 提供 `/users` 和 `/posts` 接口

2. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name localhost;
       
       location /api/ {
           proxy_pass http://127.0.0.1:3000/;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **测试验证**
   - 访问 `http://localhost/api/users`
   - 验证请求是否成功转发到后端
   - 检查后端日志，确认收到请求

**验证要点**：

- [ ] 请求成功转发到后端服务器
- [ ] 后端能正确获取客户端 IP（通过 X-Real-IP）
- [ ] 请求路径正确（/api/users -> /users）

### 任务 2: 实践负载均衡配置（多后端服务）

**目标**：配置 Nginx 负载均衡，将请求分发到多个后端服务器

**步骤**：

1. **启动多个后端服务器**
   - 启动 3 个 Node.js 服务器，分别监听 3001、3002、3003 端口
   - 每个服务器返回不同的标识（如服务器编号）

2. **配置负载均衡**
   ```nginx
   upstream backend {
       least_conn;
       server 127.0.0.1:3001 weight=3;
       server 127.0.0.1:3002 weight=2;
       server 127.0.0.1:3003 weight=1;
   }
   
   server {
       listen 80;
       server_name localhost;
       
       location /api/ {
           proxy_pass http://backend/;
           proxy_set_header Host $host;
       }
   }
   ```

3. **测试不同负载均衡算法**
   - 测试轮询算法
   - 测试权重轮询算法
   - 测试 IP Hash 算法
   - 测试最少连接算法

4. **测试故障转移**
   - 停止一个后端服务器
   - 验证请求是否自动转发到其他服务器
   - 配置 max_fails 和 fail_timeout，测试自动恢复

**验证要点**：

- [ ] 请求被正确分发到多个后端服务器
- [ ] 不同负载均衡算法按预期工作
- [ ] 后端服务器故障时能自动切换
- [ ] 后端服务器恢复后能自动加入负载均衡

### 任务 3: 实现 URL 重写规则（SPA 路由支持）

**目标**：配置 Nginx 支持单页应用（SPA）的路由，确保刷新页面不会 404

**步骤**：

1. **准备 SPA 项目**
   - 使用 Vue 或 React 创建一个简单的 SPA 项目
   - 配置路由（如 `/home`、`/about`、`/user/:id`）
   - 构建生产版本

2. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name localhost;
       root /var/www/spa/dist;
       index index.html;
       
       # SPA 路由支持
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # API 请求转发
       location /api/ {
           proxy_pass http://127.0.0.1:3000/;
           proxy_set_header Host $host;
       }
       
       # 静态资源缓存
       location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
           expires 365d;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

3. **测试路由**
   - 访问 `http://localhost/home`
   - 访问 `http://localhost/about`
   - 访问 `http://localhost/user/123`
   - 验证刷新页面不会 404

**验证要点**：

- [ ] 所有路由都能正常访问
- [ ] 刷新页面不会出现 404
- [ ] API 请求正常转发
- [ ] 静态资源正常加载

### 任务 4: 配置请求头转发

**目标**：配置 Nginx 正确转发请求头，确保后端能获取客户端真实信息

**步骤**：

1. **配置完整的请求头转发**
   ```nginx
   location /api/ {
       proxy_pass http://127.0.0.1:3000/;
       
       # 基础请求头
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
       proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header X-Forwarded-Proto $scheme;
       
       # 转发原始请求头
       proxy_set_header X-Forwarded-Host $host;
       proxy_set_header X-Forwarded-Server $host;
       
       # 自定义请求头
       proxy_set_header X-Custom-Header "nginx-proxy";
   }
   ```

2. **后端验证**
   - 在后端打印接收到的请求头
   - 验证 `X-Real-IP` 是否为客户端真实 IP
   - 验证 `X-Forwarded-For` 是否正确设置
   - 验证 `X-Forwarded-Proto` 是否为正确的协议

3. **配置响应头处理**
   ```nginx
   location /api/ {
       proxy_pass http://127.0.0.1:3000/;
       
       # 隐藏后端服务器信息
       proxy_hide_header X-Powered-By;
       proxy_hide_header Server;
       
       # 添加安全响应头
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
   }
   ```

**验证要点**：

- [ ] 后端能正确获取客户端 IP
- [ ] 后端能正确获取请求协议
- [ ] 响应头中隐藏了后端服务器信息
- [ ] 安全响应头正确添加

## 完整配置示例

### 示例 1: 基础反向代理配置

```nginx
# /etc/nginx/conf.d/default.conf

upstream backend {
    least_conn;
    server 127.0.0.1:3001 weight=3 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3002 weight=2 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3003 weight=1 max_fails=3 fail_timeout=30s;
    server 127.0.0.1:3004 backup;
}

server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    index index.html;

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 请求转发
    location /api/ {
        proxy_pass http://backend/;
        
        # 请求头设置
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # 错误处理
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        
        # 响应头处理
        proxy_hide_header X-Powered-By;
        proxy_hide_header Server;
        add_header X-Frame-Options "SAMEORIGIN" always;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Gzip 压缩
        gzip on;
        gzip_types text/css application/javascript application/json;
    }
}
```

### 示例 2: 动静分离配置

```nginx
# 静态资源服务器
server {
    listen 80;
    server_name static.example.com;
    root /var/www/static;
    
    location / {
        expires 30d;
        add_header Cache-Control "public, immutable";
        access_log off;
        
        # Gzip 压缩
        gzip on;
        gzip_types text/css application/javascript image/svg+xml;
        gzip_min_length 1000;
    }
}

# 动态请求服务器
server {
    listen 80;
    server_name api.example.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 常见问题和解决方案

**问题 1: proxy_pass 后路径不正确**

- **症状**: 请求 `/api/users` 被转发到 `/api/users` 而不是 `/users`
- **原因**: `proxy_pass` 后没有添加 `/`，导致完整路径被转发
- **解决**:
  ```nginx
  # 错误配置
  location /api/ {
      proxy_pass http://127.0.0.1:3000;
  }
  
  # 正确配置
  location /api/ {
      proxy_pass http://127.0.0.1:3000/;  # 注意末尾的 /
  }
  ```

**问题 2: SPA 路由刷新后 404**

- **症状**: 直接访问 `/home` 路由返回 404
- **原因**: 没有配置 `try_files` 或 `rewrite` 规则
- **解决**:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```

**问题 3: 后端获取不到客户端真实 IP**

- **症状**: 后端日志显示的 IP 都是 Nginx 服务器的 IP
- **原因**: 没有设置 `X-Real-IP` 或 `X-Forwarded-For` 请求头
- **解决**:
  ```nginx
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  ```

**问题 4: 负载均衡不生效**

- **症状**: 请求总是转发到同一个后端服务器
- **原因**: 使用了 `ip_hash` 且测试时使用相同 IP
- **解决**:
  - 使用不同的客户端 IP 测试
  - 或者改用其他负载均衡算法（如 `least_conn`）

**问题 5: CORS 跨域问题**

- **症状**: 浏览器控制台报 CORS 错误
- **原因**: 没有配置 CORS 响应头
- **解决**:
  ```nginx
  location /api/ {
      proxy_pass http://127.0.0.1:3000/;
      
      # 处理预检请求
      if ($request_method = 'OPTIONS') {
          add_header 'Access-Control-Allow-Origin' '*';
          add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
          add_header 'Access-Control-Allow-Headers' 'Content-Type';
          return 204;
      }
      
      # 添加 CORS 响应头
      add_header 'Access-Control-Allow-Origin' '*' always;
  }
  ```

**问题 6: 后端服务器超时**

- **症状**: 请求超时，返回 502 或 504 错误
- **原因**: 超时时间设置过短
- **解决**:
  ```nginx
  proxy_connect_timeout 60s;
  proxy_send_timeout 60s;
  proxy_read_timeout 60s;
  ```

## 学习检查清单

完成以下检查项，确保掌握 Day 4 内容：

- [ ] 理解反向代理的工作原理和配置方法
- [ ] 能够配置 `proxy_pass` 并理解带 URI 和不带 URI 的区别
- [ ] 理解负载均衡的必要性和各种算法
- [ ] 能够配置多种负载均衡算法（轮询、权重、IP hash、最少连接）
- [ ] 理解动静分离的原理和优势
- [ ] 能够配置动静分离，优化服务器性能
- [ ] 理解 URL 重写的常用场景
- [ ] 能够配置 SPA 路由支持，解决刷新 404 问题
- [ ] 理解请求头和响应头的处理
- [ ] 能够正确配置请求头转发，确保后端获取客户端真实信息
- [ ] 完成了所有 4 个实战任务
- [ ] 记录了学习笔记和遇到的问题

## 参考资源

- [Nginx 官方文档 - 反向代理](http://nginx.org/en/docs/http/ngx_http_proxy_module.html)
- [Nginx 官方文档 - 负载均衡](http://nginx.org/en/docs/http/load_balancing.html)
- [Nginx 官方文档 - URL 重写](http://nginx.org/en/docs/http/ngx_http_rewrite_module.html)
- [Nginx 内置变量列表](http://nginx.org/en/docs/varindex.html)
- [MDN - HTTP 代理](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Proxy_servers_and_tunneling)
- [负载均衡算法详解](https://www.nginx.com/resources/glossary/load-balancing/)

## 学习时间分配建议

- **理论学习**: 2 小时
  - 反向代理概念和配置: 30 分钟
  - 负载均衡算法: 40 分钟
  - 动静分离配置: 20 分钟
  - URL 重写规则: 20 分钟
  - 请求头和响应头处理: 10 分钟

- **实践操作**: 3 小时
  - 配置反向代理: 40 分钟
  - 实践负载均衡配置: 50 分钟
  - 实现 SPA 路由支持: 40 分钟
  - 配置请求头转发: 30 分钟
  - 测试和调试: 20 分钟

- **总结笔记**: 30 分钟
  - 记录关键配置和代码
  - 记录遇到的问题和解决方案
  - 总结最佳实践和配置模板

## 实战练习建议

1. **准备测试环境**
   - 在本地安装 Nginx
   - 准备一个 Vue 或 React SPA 项目
   - 创建多个简单的后端服务器（可以使用 Express）

2. **按照任务顺序实践**
   - 先完成基础的反向代理配置
   - 然后添加负载均衡
   - 再配置 SPA 路由支持
   - 最后完善请求头处理

3. **测试不同场景**
   - 测试不同的负载均衡算法
   - 测试后端服务器故障时的行为
   - 测试 SPA 路由的刷新问题
   - 测试请求头转发的正确性

4. **记录实践过程**
   - 记录每个配置的关键点
   - 记录遇到的问题和解决方案
   - 记录性能测试结果

5. **总结最佳实践**
   - 整理常用的 Nginx 配置模板
   - 总结不同场景下的最佳配置
   - 形成自己的 Nginx 配置规范

