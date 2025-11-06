# Day 8: Nginx 高级配置 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 掌握 Nginx 限流配置，防止 API 滥用和 DDoS 攻击
- 理解并实现多种安全配置（防盗链、防爬虫、安全响应头）
- 优化 Nginx 压缩配置（Gzip、Brotli），提升传输效率
- 掌握多站点配置（虚拟主机），实现一台服务器托管多个网站
- 理解日志分析和监控，能够通过日志排查问题
- 配置日志切割和归档，管理日志文件

## 学习时间分配

- **理论学习**: 2-2.5 小时
- **实践操作**: 3-4 小时
- **日志分析和问题排查**: 30 分钟
- **总结和文档**: 30 分钟

## 核心知识点

### 1. 限流配置

#### 1.1 限流原理和场景

**限流的作用**
- 防止 API 滥用，保护后端服务
- 防止 DDoS 攻击和恶意请求
- 保证服务器资源合理分配
- 提升系统稳定性和可用性

**限流类型**
- **请求速率限制（rate limiting）**: 限制单位时间内的请求数
- **连接数限制（connection limiting）**: 限制并发连接数
- **带宽限制**: 限制传输速度

**限流算法**
- **令牌桶算法（Token Bucket）**: Nginx 默认使用，允许突发流量
- **漏桶算法（Leaky Bucket）**: 平滑流量，不允许突发
- **固定窗口**: 简单但可能在窗口边界出现突发
- **滑动窗口**: 更平滑，但消耗更多内存

#### 1.2 请求速率限制（limit_req）

**limit_req 模块配置**

```nginx
# 在 http 块中定义限流区域
http {
    # 定义限流区域，名称：api_limit，速率：每秒 10 个请求
    # zone=api_limit:10m 表示分配 10MB 内存存储状态
    # rate=10r/s 表示每秒允许 10 个请求
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    # 或者限制每分钟请求数
    limit_req_zone $binary_remote_addr zone=api_limit_min:10m rate=10r/m;
    
    server {
        location /api/ {
            # 应用限流规则
            limit_req zone=api_limit;
            
            # 允许突发请求（burst），超过速率的部分可以排队
            # burst=20 表示允许 20 个请求排队
            # nodelay 表示不延迟，立即处理突发请求（但受 rate 限制）
            limit_req zone=api_limit burst=20 nodelay;
            
            # 限制排队请求数（queue），超过的直接拒绝
            # queue=10 表示最多允许 10 个请求排队
            limit_req zone=api_limit burst=20 queue=10;
            
            proxy_pass http://backend;
        }
    }
}
```

**限流键值选择**

```nginx
# 基于 IP 地址限流（常用）
limit_req_zone $binary_remote_addr zone=ip_limit:10m rate=10r/s;

# 基于服务器名称限流
limit_req_zone $server_name zone=server_limit:10m rate=10r/s;

# 基于自定义变量限流（如用户ID）
limit_req_zone $remote_user zone=user_limit:10m rate=5r/s;

# 组合多个变量（更精确）
limit_req_zone "$binary_remote_addr$request_uri" zone=combined:10m rate=10r/s;
```

**限流响应配置**

```nginx
http {
    # 自定义限流错误页面
    limit_req_status 429;  # 默认 503，改为 429 Too Many Requests
    
    server {
        location /api/ {
            limit_req zone=api_limit burst=20;
            
            # 返回自定义错误页面
            error_page 429 /429.html;
            location = /429.html {
                root /usr/share/nginx/html;
            }
        }
    }
}
```

**限流日志记录**

```nginx
http {
    # 记录限流日志
    log_format limit_req_log '$remote_addr - $remote_user [$time_local] '
                             '"$request" $status $body_bytes_sent '
                             '"$http_referer" "$http_user_agent" '
                             'limit_req_status=$limit_req_status '
                             'limit_req_limit=$limit_req_limit '
                             'limit_req_remaining=$limit_req_remaining';
    
    server {
        access_log /var/log/nginx/limit_req.log limit_req_log;
        
        location /api/ {
            limit_req zone=api_limit burst=20;
            proxy_pass http://backend;
        }
    }
}
```

#### 1.3 连接数限制（limit_conn）

**limit_conn 模块配置**

```nginx
http {
    # 定义连接数限制区域
    # zone=conn_limit:10m 分配 10MB 内存
    # 限制每个 IP 最多 10 个并发连接
    limit_conn_zone $binary_remote_addr zone=conn_limit:10m;
    
    server {
        # 限制整个 server 的连接数
        limit_conn conn_limit 10;
        
        # 限制特定 location 的连接数
        location /download/ {
            limit_conn conn_limit 5;  # 每个 IP 最多 5 个并发连接
            limit_rate 1m;  # 限制每个连接的带宽为 1MB/s
            
            alias /var/www/downloads/;
        }
        
        # 限制单个 IP 的总连接数
        limit_conn conn_limit 20;
        
        # 限制服务器总连接数
        limit_conn_zone $server_name zone=server_conn:10m;
        limit_conn server_conn 1000;
    }
}
```

**连接数限制配置示例**

```nginx
http {
    # 基于 IP 的连接数限制
    limit_conn_zone $binary_remote_addr zone=perip:10m;
    
    # 基于服务器名称的连接数限制
    limit_conn_zone $server_name zone=perserver:10m;
    
    server {
        # 每个 IP 最多 10 个连接
        limit_conn perip 10;
        
        # 整个服务器最多 1000 个连接
        limit_conn perserver 1000;
        
        # 限制连接数的同时限制带宽
        location /api/ {
            limit_conn perip 5;
            limit_rate 100k;  # 每个连接最多 100KB/s
            
            proxy_pass http://backend;
        }
    }
}
```

**连接数限制响应配置**

```nginx
http {
    # 自定义连接数限制错误状态码
    limit_conn_status 503;
    
    server {
        location / {
            limit_conn perip 10;
            
            # 自定义错误页面
            error_page 503 /503.html;
            location = /503.html {
                root /usr/share/nginx/html;
            }
        }
    }
}
```

#### 1.4 限流最佳实践

**多级限流策略**

```nginx
http {
    # 第一级：基于 IP 的全局限流（宽松）
    limit_req_zone $binary_remote_addr zone=global_limit:10m rate=50r/s;
    
    # 第二级：基于 IP 的 API 限流（严格）
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    # 第三级：基于路径的限流（更严格）
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=2r/s;
    
    server {
        # 全局限流
        limit_req zone=global_limit burst=100;
        
        location /api/ {
            # API 限流（更严格）
            limit_req zone=api_limit burst=20 nodelay;
            proxy_pass http://backend;
        }
        
        location /api/login {
            # 登录接口限流（最严格）
            limit_req zone=login_limit burst=5 nodelay;
            proxy_pass http://backend;
        }
        
        location /static/ {
            # 静态资源不限流
            alias /var/www/static/;
        }
    }
}
```

**白名单配置**

```nginx
http {
    # 定义白名单 IP
    geo $limit {
        default 1;
        # 白名单 IP 返回 0，不限流
        192.168.1.0/24 0;
        10.0.0.0/8 0;
    }
    
    map $limit $limit_key {
        0 "";
        1 $binary_remote_addr;
    }
    
    limit_req_zone $limit_key zone=api_limit:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api_limit burst=20;
            proxy_pass http://backend;
        }
    }
}
```

### 2. 安全配置

#### 2.1 防盗链配置

**防盗链原理**
- 检查 HTTP Referer 请求头
- 只允许特定域名访问资源
- 防止其他网站直接链接你的资源

**基础防盗链配置**

```nginx
server {
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        # 允许空 Referer（直接访问）
        valid_referers none blocked;
        
        # 允许自己的域名
        valid_referers *.example.com example.com;
        
        # 允许特定域名
        valid_referers www.example.com api.example.com;
        
        # 如果 Referer 不合法，返回 403
        if ($invalid_referer) {
            return 403;
        }
        
        # 或者返回自定义图片
        # if ($invalid_referer) {
        #     rewrite ^ /images/forbidden.jpg break;
        # }
        
        root /var/www/html;
    }
}
```

**防盗链进阶配置**

```nginx
server {
    # 图片防盗链
    location ~* \.(jpg|jpeg|png|gif|webp|svg)$ {
        valid_referers none blocked 
                      server_names 
                      *.example.com 
                      example.com
                      *.google.com 
                      *.bing.com;
        
        if ($invalid_referer) {
            # 返回 403 禁止访问
            return 403;
            
            # 或者返回默认图片
            # rewrite ^ /images/403.jpg break;
        }
        
        expires 30d;
        add_header Cache-Control "public, immutable";
        root /var/www/html;
    }
    
    # 视频防盗链（更严格）
    location ~* \.(mp4|avi|mov|wmv|flv)$ {
        valid_referers none blocked server_names *.example.com;
        
        if ($invalid_referer) {
            return 403;
        }
        
        # 限制视频访问速度，防止下载
        limit_rate 2m;
        
        root /var/www/html;
    }
}
```

**防盗链 + 签名验证**

```nginx
server {
    location ~* \.(jpg|jpeg|png|gif)$ {
        # 检查签名参数
        set $signature $arg_sign;
        set $expected_signature "";
        
        # 计算签名（需要在应用层实现）
        # access_by_lua_block {
        #     local md5 = require "resty.md5"
        #     local str = require "resty.string"
        #     local secret = "your_secret_key"
        #     local timestamp = ngx.var.arg_t
        #     local url = ngx.var.uri
        #     local sign = str.to_hex(md5:new():update(secret .. timestamp .. url):final())
        #     ngx.var.expected_signature = sign
        # }
        
        # 简单的 Referer 检查
        valid_referers none blocked server_names *.example.com;
        
        if ($invalid_referer) {
            return 403;
        }
        
        root /var/www/html;
    }
}
```

#### 2.2 防爬虫配置

**User-Agent 过滤**

```nginx
server {
    # 阻止常见爬虫（谨慎使用，可能误杀）
    if ($http_user_agent ~* (bot|crawler|spider|scraper)) {
        return 403;
    }
    
    # 只允许特定 User-Agent
    if ($http_user_agent !~* (Mozilla|Chrome|Safari|Firefox|Edge)) {
        return 403;
    }
    
    # 更精确的爬虫检测
    set $block_user_agent 0;
    
    if ($http_user_agent ~ "BadBot|EvilBot|SpamBot") {
        set $block_user_agent 1;
    }
    
    if ($block_user_agent = 1) {
        return 403;
    }
    
    location / {
        root /var/www/html;
    }
}
```

**robots.txt 配置**

```nginx
server {
    # 提供 robots.txt 文件
    location = /robots.txt {
        root /var/www/html;
        add_header Content-Type text/plain;
    }
    
    # 禁止访问特定目录
    location ~ ^/(admin|private|api/internal)/ {
        # 返回 403 或 404
        return 403;
        # 或者 return 404;
    }
}
```

**访问频率限制（防爬虫）**

```nginx
http {
    # 针对爬虫的严格限流
    limit_req_zone $binary_remote_addr zone=antibot:10m rate=1r/s;
    
    map $http_user_agent $is_bot {
        default 0;
        ~*bot 1;
        ~*crawler 1;
        ~*spider 1;
    }
    
    server {
        location / {
            # 如果是爬虫，应用更严格的限流
            if ($is_bot) {
                limit_req zone=antibot burst=2;
            }
            
            root /var/www/html;
        }
    }
}
```

#### 2.3 安全响应头配置

**常用安全响应头**

```nginx
server {
    location / {
        # X-Frame-Options: 防止点击劫持
        add_header X-Frame-Options "SAMEORIGIN" always;
        # 或 "DENY" 完全禁止嵌入
        
        # X-Content-Type-Options: 防止 MIME 类型嗅探
        add_header X-Content-Type-Options "nosniff" always;
        
        # X-XSS-Protection: XSS 保护（旧浏览器）
        add_header X-XSS-Protection "1; mode=block" always;
        
        # Strict-Transport-Security (HSTS): 强制 HTTPS
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        
        # Content-Security-Policy: 内容安全策略
        add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;" always;
        
        # Referrer-Policy: 控制 Referer 信息
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # Permissions-Policy: 控制浏览器功能
        add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
        
        root /var/www/html;
    }
}
```

**CSP 策略详解**

```nginx
server {
    location / {
        # 严格的 CSP 策略
        add_header Content-Security-Policy "
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://cdn.example.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            img-src 'self' data: https:;
            font-src 'self' https://fonts.gstatic.com;
            connect-src 'self' https://api.example.com;
            frame-ancestors 'none';
            base-uri 'self';
            form-action 'self';
        " always;
        
        root /var/www/html;
    }
}
```

**安全头配置优化**

```nginx
# 在 http 块中统一配置（避免重复）
http {
    # 定义安全头映射
    map $sent_http_content_type $security_headers {
        default "";
        ~*text/html "add_header X-Frame-Options 'SAMEORIGIN' always; "
                    "add_header X-Content-Type-Options 'nosniff' always; "
                    "add_header X-XSS-Protection '1; mode=block' always; "
                    "add_header Referrer-Policy 'strict-origin-when-cross-origin' always;";
    }
    
    server {
        location / {
            # 只在 HTML 响应中添加安全头
            eval $security_headers {
                set $sent_http_content_type $sent_http_content_type;
            }
            
            root /var/www/html;
        }
    }
}

# 更简单的方式：统一添加
http {
    server {
        # 对所有响应添加安全头
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
        
        # HTTPS 站点添加 HSTS
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
        
        location / {
            root /var/www/html;
        }
    }
}
```

#### 2.4 WAF 规则配置（基础）

**基础 WAF 规则示例**

```nginx
server {
    # 阻止 SQL 注入攻击
    set $block_sql_injection 0;
    
    if ($query_string ~* (union.*select|insert.*into|delete.*from|drop.*table)) {
        set $block_sql_injection 1;
    }
    
    if ($request_uri ~* (union.*select|insert.*into|delete.*from|drop.*table)) {
        set $block_sql_injection 1;
    }
    
    if ($block_sql_injection = 1) {
        return 403;
    }
    
    # 阻止 XSS 攻击
    set $block_xss 0;
    
    if ($query_string ~* (<script|javascript:|onerror=|onload=)) {
        set $block_xss 1;
    }
    
    if ($block_xss = 1) {
        return 403;
    }
    
    # 阻止路径遍历攻击
    if ($request_uri ~* (\.\.|\.\.\/|\.\.\\) {
        return 403;
    }
    
    # 阻止命令注入
    if ($query_string ~* (\||`|\$\(|wget|curl)) {
        return 403;
    }
    
    location / {
        proxy_pass http://backend;
    }
}
```

**使用 Lua 实现更复杂的 WAF**

```nginx
# 需要安装 ngx_lua 模块
http {
    lua_package_path "/etc/nginx/lua/?.lua;;";
    
    init_by_lua_block {
        -- 加载 WAF 规则
        waf = require "waf"
    }
    
    server {
        access_by_lua_block {
            -- 执行 WAF 检查
            local action = waf.check()
            if action == "deny" then
                ngx.exit(403)
            end
        }
        
        location / {
            proxy_pass http://backend;
        }
    }
}
```

### 3. 压缩配置优化

#### 3.1 Gzip 压缩配置

**基础 Gzip 配置**

```nginx
http {
    # 开启 Gzip 压缩
    gzip on;
    
    # 压缩级别（1-9），6 是平衡点
    gzip_comp_level 6;
    
    # 最小压缩文件大小（小于 1KB 不压缩）
    gzip_min_length 1000;
    
    # 压缩类型（MIME types）
    gzip_types text/plain text/css text/xml text/javascript 
               application/json application/javascript application/xml+rss 
               application/rss+xml font/truetype font/opentype 
               application/vnd.ms-fontobject image/svg+xml;
    
    # 禁用旧版本 IE 的 Gzip（IE 6 有 bug）
    gzip_disable "msie6";
    
    # 启用 Vary: Accept-Encoding 响应头
    gzip_vary on;
    
    # 缓冲区大小（默认 4k 或 8k）
    gzip_buffers 16 8k;
    
    # 代理压缩配置
    gzip_proxied any;  # 对所有代理请求压缩
    # gzip_proxied expired no-cache no-store private auth;
    
    server {
        location / {
            root /var/www/html;
        }
    }
}
```

**Gzip 预压缩（静态文件）**

```nginx
http {
    gzip on;
    gzip_vary on;
    gzip_static on;  # 优先使用预压缩文件（.gz）
    
    server {
        location / {
            # 查找顺序：file.gz -> file
            root /var/www/html;
        }
    }
}
```

**Gzip 优化配置**

```nginx
http {
    # 压缩配置
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_min_length 1000;
    
    # 压缩类型（包含所有文本类型）
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        text/x-component
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        application/atom+xml
        application/xhtml+xml
        application/x-font-ttf
        application/vnd.ms-fontobject
        font/opentype
        image/svg+xml
        image/x-icon;
    
    # 禁用旧浏览器
    gzip_disable "msie6";
    
    # 缓冲区配置
    gzip_buffers 16 8k;
    
    # HTTP 版本
    gzip_http_version 1.1;
    
    server {
        location / {
            root /var/www/html;
        }
    }
}
```

#### 3.2 Brotli 压缩配置

**Brotli 简介**
- 比 Gzip 压缩率高 15-20%
- 需要安装 `ngx_brotli` 模块
- 现代浏览器支持良好

**安装 ngx_brotli 模块**

```bash
# 需要编译安装 Nginx（动态模块）
# 或使用预编译版本（如 Ubuntu 的 nginx-extras）

# 检查是否已安装
nginx -V 2>&1 | grep -o brotli

# 如果没有，需要重新编译 Nginx 并添加 brotli 模块
```

**Brotli 配置**

```nginx
http {
    # Brotli 压缩配置
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css text/xml text/javascript 
                 application/json application/javascript application/xml+rss 
                 application/rss+xml font/truetype font/opentype 
                 application/vnd.ms-fontobject image/svg+xml;
    brotli_min_length 1000;
    
    # 同时启用 Gzip（作为后备）
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript;
    
    server {
        location / {
            root /var/www/html;
        }
    }
}
```

**Gzip + Brotli 最佳实践**

```nginx
http {
    # Brotli 配置（优先）
    brotli on;
    brotli_comp_level 6;
    brotli_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        font/truetype
        font/opentype
        image/svg+xml;
    brotli_min_length 1000;
    
    # Gzip 配置（后备）
    gzip on;
    gzip_vary on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml;
    
    # 浏览器会自动选择支持的压缩方式
    server {
        location / {
            root /var/www/html;
        }
    }
}
```

#### 3.3 压缩配置优化建议

**压缩级别选择**
- **构建时压缩**: 可以使用级别 9（最高压缩率）
- **服务器动态压缩**: 推荐级别 6（平衡压缩率和 CPU 消耗）
- **高流量场景**: 使用级别 4-5（降低 CPU 负载）

**压缩类型选择**
- **文本文件**: HTML、CSS、JS、JSON、XML 等
- **字体文件**: TTF、OTF、WOFF 等
- **SVG 图片**: 文本格式，压缩效果好
- **不要压缩**: 已经是压缩格式的文件（JPEG、PNG、GIF、MP4 等）

**压缩缓存策略**

```nginx
http {
    gzip on;
    gzip_vary on;
    
    # 压缩后设置缓存
    server {
        location ~* \.(css|js|json)$ {
            gzip on;
            expires 30d;
            add_header Cache-Control "public, immutable";
            root /var/www/html;
        }
    }
}
```

### 4. 多站点配置

#### 4.1 Server Blocks（虚拟主机）基础

**单个 Server Block**

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html index.htm;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

**多个 Server Blocks**

```nginx
# 第一个站点
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 第二个站点
server {
    listen 80;
    server_name blog.example.com;
    
    root /var/www/blog;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 第三个站点（不同端口）
server {
    listen 8080;
    server_name api.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

**默认 Server Block**

```nginx
# 默认服务器（处理未匹配的请求）
server {
    listen 80 default_server;
    server_name _;
    
    return 444;  # 关闭连接，不返回响应
    # 或返回 403
    # return 403;
}

# 具体站点
server {
    listen 80;
    server_name example.com;
    
    root /var/www/example.com;
    index index.html;
}
```

#### 4.2 基于域名的虚拟主机

**多个域名指向同一服务器**

```nginx
# 站点 1: example.com
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html;
    
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 站点 2: blog.example.com
server {
    listen 80;
    server_name blog.example.com;
    
    root /var/www/blog;
    index index.html;
    
    access_log /var/log/nginx/blog.access.log;
    error_log /var/log/nginx/blog.error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 站点 3: api.example.com
server {
    listen 80;
    server_name api.example.com;
    
    access_log /var/log/nginx/api.access.log;
    error_log /var/log/nginx/api.error.log;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**HTTPS 多站点配置**

```nginx
# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 站点 1
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP 重定向（站点 2）
server {
    listen 80;
    server_name blog.example.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS 站点 2
server {
    listen 443 ssl http2;
    server_name blog.example.com;
    
    ssl_certificate /etc/nginx/ssl/blog.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/blog.example.com.key;
    
    root /var/www/blog;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

**通配符证书配置**

```nginx
# 使用通配符证书（*.example.com）
server {
    listen 443 ssl http2;
    server_name *.example.com;
    
    ssl_certificate /etc/nginx/ssl/wildcard.example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/wildcard.example.com.key;
    
    # 根据域名动态设置 root
    set $site_root /var/www/default;
    
    if ($host = "blog.example.com") {
        set $site_root /var/www/blog;
    }
    
    if ($host = "api.example.com") {
        set $site_root /var/www/api;
    }
    
    root $site_root;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### 4.3 多站点配置最佳实践

**使用 include 组织配置**

```nginx
# /etc/nginx/nginx.conf
http {
    include /etc/nginx/conf.d/*.conf;
    
    # 或者按站点组织
    include /etc/nginx/sites-enabled/*;
}
```

**站点配置文件结构**

```bash
# 创建站点配置目录
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# 站点配置文件示例：/etc/nginx/sites-available/example.com
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html;
    
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# 启用站点（创建符号链接）
ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# 禁用站点（删除符号链接）
rm /etc/nginx/sites-enabled/example.com

# 测试配置
nginx -t

# 重新加载配置
nginx -s reload
```

**多站点配置模板**

```nginx
# /etc/nginx/sites-available/template.conf
# 站点配置模板

server {
    listen 80;
    server_name DOMAIN_NAME;
    
    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name DOMAIN_NAME;
    
    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/DOMAIN_NAME.crt;
    ssl_certificate_key /etc/nginx/ssl/DOMAIN_NAME.key;
    
    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # 网站根目录
    root /var/www/DOMAIN_NAME;
    index index.html index.htm;
    
    # 日志配置
    access_log /var/log/nginx/DOMAIN_NAME.access.log;
    error_log /var/log/nginx/DOMAIN_NAME.error.log;
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # 主 location
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5. 日志分析和监控

#### 5.1 Nginx 日志格式

**默认日志格式**

```nginx
http {
    # 默认访问日志格式
    log_format combined '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent"';
    
    # 扩展日志格式（包含更多信息）
    log_format extended '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent" '
                       'rt=$request_time uct="$upstream_connect_time" '
                       'uht="$upstream_header_time" urt="$upstream_response_time"';
    
    server {
        access_log /var/log/nginx/access.log combined;
        error_log /var/log/nginx/error.log;
    }
}
```

**自定义日志格式**

```nginx
http {
    # JSON 格式日志（便于解析）
    log_format json_combined escape=json
        '{'
            '"time_local":"$time_local",'
            '"remote_addr":"$remote_addr",'
            '"remote_user":"$remote_user",'
            '"request":"$request",'
            '"status": "$status",'
            '"body_bytes_sent":"$body_bytes_sent",'
            '"request_time":"$request_time",'
            '"http_referrer":"$http_referer",'
            '"http_user_agent":"$http_user_agent"'
        '}';
    
    # 详细日志格式
    log_format detailed '$remote_addr - $remote_user [$time_local] '
                       '"$request" $status $body_bytes_sent '
                       '"$http_referer" "$http_user_agent" '
                       'rt=$request_time '
                       'ua="$upstream_addr" '
                       'us="$upstream_status" '
                       'ut="$upstream_response_time" '
                       'ul="$upstream_response_length" '
                       'cs=$upstream_cache_status';
    
    server {
        access_log /var/log/nginx/access.json json_combined;
        access_log /var/log/nginx/access.detailed.log detailed;
    }
}
```

**日志变量说明**

```
$remote_addr          - 客户端 IP 地址
$remote_user          - 认证用户名
$time_local           - 本地时间
$request              - 完整的请求行
$status               - 响应状态码
$body_bytes_sent      - 发送给客户端的字节数
$http_referer         - Referer 头
$http_user_agent      - User-Agent 头
$request_time         - 请求处理时间（秒）
$upstream_response_time - 上游服务器响应时间
$upstream_addr        - 上游服务器地址
$upstream_status      - 上游服务器状态码
```

#### 5.2 日志分析工具

**使用 awk 分析日志**

```bash
# 统计访问量最多的 IP
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计访问量最多的 URL
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计状态码分布
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 统计响应时间大于 1 秒的请求
awk '$NF > 1 {print}' /var/log/nginx/access.log

# 统计特定时间段的访问量
awk '/25\/Dec\/2023/ {print}' /var/log/nginx/access.log | wc -l
```

**使用 GoAccess 分析日志**

```bash
# 安装 GoAccess
# macOS
brew install goaccess

# Ubuntu
sudo apt-get install goaccess

# 实时分析访问日志
goaccess /var/log/nginx/access.log --log-format=COMBINED --real-time-html

# 生成 HTML 报告
goaccess /var/log/nginx/access.log --log-format=COMBINED -o /var/www/report.html
```

**使用 ELK Stack 分析日志**

```nginx
# Nginx 配置 JSON 日志
http {
    log_format json_combined escape=json
        '{'
            '"@timestamp":"$time_iso8601",'
            '"remote_addr":"$remote_addr",'
            '"request":"$request",'
            '"status": "$status",'
            '"request_time":"$request_time"'
        '}';
    
    server {
        access_log /var/log/nginx/access.json json_combined;
    }
}
```

#### 5.3 日志切割和归档

**使用 logrotate（推荐）**

```bash
# 创建 logrotate 配置：/etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily                    # 每天切割
    missingok                # 文件不存在也不报错
    rotate 52                # 保留 52 个文件（52 周）
    compress                 # 压缩旧日志
    delaycompress            # 延迟压缩（不压缩当前日志）
    notifempty               # 空文件不切割
    create 0640 nginx nginx  # 创建新文件权限和所有者
    sharedscripts            # 共享脚本
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

**手动日志切割脚本**

```bash
#!/bin/bash
# logrotate.sh - 手动日志切割脚本

LOG_DIR="/var/log/nginx"
DATE=$(date +%Y%m%d)
NGINX_PID="/var/run/nginx.pid"

# 切割访问日志
if [ -f "$LOG_DIR/access.log" ]; then
    mv "$LOG_DIR/access.log" "$LOG_DIR/access.log.$DATE"
fi

# 切割错误日志
if [ -f "$LOG_DIR/error.log" ]; then
    mv "$LOG_DIR/error.log" "$LOG_DIR/error.log.$DATE"
fi

# 压缩旧日志
find "$LOG_DIR" -name "*.log.*" -mtime +7 -exec gzip {} \;

# 删除 30 天前的日志
find "$LOG_DIR" -name "*.log.*.gz" -mtime +30 -delete

# 重新打开日志文件
if [ -f "$NGINX_PID" ]; then
    kill -USR1 `cat $NGINX_PID`
fi

echo "日志切割完成：$DATE"
```

**使用 cron 定时切割**

```bash
# 编辑 crontab
crontab -e

# 每天凌晨 2 点切割日志
0 2 * * * /path/to/logrotate.sh >> /var/log/logrotate.log 2>&1
```

**Nginx 内置日志切割**

```nginx
# 使用 open_file_cache 和 error_log 的日志级别控制
http {
    # 设置错误日志级别
    error_log /var/log/nginx/error.log warn;
    
    # 不同站点使用不同的日志文件
    server {
        error_log /var/log/nginx/example.com.error.log warn;
        access_log /var/log/nginx/example.com.access.log;
    }
}
```

## 实践任务

### 任务 1: 配置接口限流

**目标**: 为 API 接口配置限流，防止 API 滥用

**步骤**:

1. **创建测试 API 后端服务**

```bash
# 创建一个简单的 Node.js API 服务器
# api-server.js
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
        message: 'API Response',
        timestamp: new Date().toISOString()
    }));
});

server.listen(3000, () => {
    console.log('API server running on port 3000');
});
```

2. **配置 Nginx 限流规则**

```nginx
# /etc/nginx/conf.d/api-limit.conf
http {
    # 定义限流区域
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    
    server {
        listen 80;
        server_name api.example.com;
        
        location /api/ {
            # 应用限流：每秒 10 个请求，允许 20 个突发请求
            limit_req zone=api_limit burst=20 nodelay;
            
            # 记录限流日志
            limit_req_status 429;
            access_log /var/log/nginx/api-limit.log;
            
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        # 限流错误页面
        error_page 429 /429.html;
        location = /429.html {
            root /usr/share/nginx/html;
        }
    }
}
```

3. **测试限流效果**

```bash
# 使用 ab (Apache Bench) 测试
ab -n 100 -c 10 http://api.example.com/api/test

# 使用 curl 测试
for i in {1..30}; do
    curl http://api.example.com/api/test
    sleep 0.1
done

# 查看限流日志
tail -f /var/log/nginx/api-limit.log
```

4. **验证和优化**

- 检查日志，确认限流生效
- 调整限流参数（rate、burst）
- 测试不同 IP 的限流效果
- 配置白名单 IP

**预期结果**:
- API 请求超过限制时返回 429 状态码
- 日志中记录限流信息
- 后端服务压力得到控制

### 任务 2: 实现防盗链和安全头配置

**目标**: 配置图片防盗链和安全响应头

**步骤**:

1. **准备测试资源**

```bash
# 创建测试目录和图片
mkdir -p /var/www/html/images
# 放置一些测试图片到 /var/www/html/images/
```

2. **配置防盗链**

```nginx
# /etc/nginx/conf.d/anti-hotlink.conf
server {
    listen 80;
    server_name example.com;
    
    root /var/www/html;
    
    # 图片防盗链配置
    location ~* \.(jpg|jpeg|png|gif|webp|svg)$ {
        # 允许空 Referer（直接访问）
        valid_referers none blocked server_names 
                      *.example.com 
                      example.com
                      *.google.com 
                      *.bing.com;
        
        # 如果不合法，返回 403 或自定义图片
        if ($invalid_referer) {
            # 方式 1: 返回 403
            return 403;
            
            # 方式 2: 返回自定义图片（取消注释）
            # rewrite ^ /images/forbidden.jpg break;
        }
        
        # 设置缓存
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **配置安全响应头**

```nginx
server {
    listen 80;
    server_name example.com;
    
    root /var/www/html;
    
    # 统一添加安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # HTTPS 站点添加 HSTS
    # add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    
    # CSP 策略（根据实际需求调整）
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;" always;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
```

4. **测试防盗链**

```bash
# 测试合法访问（直接访问）
curl -I http://example.com/images/test.jpg

# 测试合法 Referer
curl -I -H "Referer: http://example.com" http://example.com/images/test.jpg

# 测试非法 Referer（应该返回 403）
curl -I -H "Referer: http://evil.com" http://example.com/images/test.jpg

# 在浏览器中测试
# 1. 直接访问图片 URL（应该正常显示）
# 2. 在其他网站中引用图片（应该被阻止）
```

5. **验证安全头**

```bash
# 检查响应头
curl -I http://example.com

# 应该看到以下响应头：
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# X-XSS-Protection: 1; mode=block
# Referrer-Policy: strict-origin-when-cross-origin
```

**预期结果**:
- 非法 Referer 访问图片时返回 403
- 所有响应包含安全响应头
- 浏览器控制台可以验证安全头生效

### 任务 3: 配置多站点 Nginx

**目标**: 在一台服务器上配置多个网站

**步骤**:

1. **创建站点目录结构**

```bash
# 创建站点目录
mkdir -p /var/www/example.com
mkdir -p /var/www/blog.example.com
mkdir -p /var/www/api.example.com

# 创建测试页面
echo "<h1>Example.com</h1>" > /var/www/example.com/index.html
echo "<h1>Blog.example.com</h1>" > /var/www/blog.example.com/index.html
```

2. **创建站点配置文件**

```bash
# 创建配置目录
mkdir -p /etc/nginx/sites-available
mkdir -p /etc/nginx/sites-enabled

# 站点 1: example.com
cat > /etc/nginx/sites-available/example.com << 'EOF'
server {
    listen 80;
    server_name example.com www.example.com;
    
    root /var/www/example.com;
    index index.html;
    
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

# 站点 2: blog.example.com
cat > /etc/nginx/sites-available/blog.example.com << 'EOF'
server {
    listen 80;
    server_name blog.example.com;
    
    root /var/www/blog.example.com;
    index index.html;
    
    access_log /var/log/nginx/blog.access.log;
    error_log /var/log/nginx/blog.error.log;
    
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

3. **启用站点**

```bash
# 创建符号链接启用站点
ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/blog.example.com /etc/nginx/sites-enabled/

# 在 nginx.conf 中引入 sites-enabled
# 编辑 /etc/nginx/nginx.conf，在 http 块中添加：
# include /etc/nginx/sites-enabled/*;
```

4. **配置默认服务器**

```bash
# 创建默认服务器配置
cat > /etc/nginx/sites-available/default << 'EOF'
server {
    listen 80 default_server;
    server_name _;
    
    # 返回 444（关闭连接）
    return 444;
    
    # 或返回 403
    # return 403;
}
EOF

ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/
```

5. **测试配置**

```bash
# 测试 Nginx 配置
nginx -t

# 重新加载配置
nginx -s reload

# 测试访问（需要配置 hosts 文件或 DNS）
# macOS/Linux: /etc/hosts
# 127.0.0.1 example.com
# 127.0.0.1 blog.example.com

curl http://example.com
curl http://blog.example.com

# 测试未配置的域名（应该返回 444 或 403）
curl http://unknown.example.com
```

6. **配置 HTTPS（可选）**

```bash
# 为每个站点申请 SSL 证书
# 使用 acme.sh 或 Let's Encrypt

# 更新站点配置添加 HTTPS
cat >> /etc/nginx/sites-available/example.com << 'EOF'

server {
    listen 443 ssl http2;
    server_name example.com www.example.com;
    
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;
    
    root /var/www/example.com;
    index index.html;
    
    location / {
        try_files $uri $uri/ =404;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
EOF
```

**预期结果**:
- 每个域名正确指向对应的网站目录
- 未配置的域名返回默认响应
- 日志文件正确记录每个站点的访问

### 任务 4: 配置日志切割和归档

**目标**: 配置日志自动切割和归档

**步骤**:

1. **配置 logrotate**

```bash
# 创建 logrotate 配置
sudo cat > /etc/logrotate.d/nginx << 'EOF'
/var/log/nginx/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0640 nginx adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
EOF
```

2. **测试 logrotate 配置**

```bash
# 测试配置（不实际执行）
sudo logrotate -d /etc/logrotate.d/nginx

# 强制执行一次（用于测试）
sudo logrotate -f /etc/logrotate.d/nginx

# 查看 logrotate 状态
sudo logrotate -d /etc/logrotate.d/nginx
```

3. **创建日志切割脚本（可选）**

```bash
# 创建自定义日志切割脚本
sudo cat > /usr/local/bin/nginx-logrotate.sh << 'EOF'
#!/bin/bash

LOG_DIR="/var/log/nginx"
DATE=$(date +%Y%m%d)
NGINX_PID="/var/run/nginx.pid"

# 切割所有日志文件
for logfile in $(ls $LOG_DIR/*.log 2>/dev/null); do
    if [ -f "$logfile" ]; then
        mv "$logfile" "${logfile}.${DATE}"
    fi
done

# 压缩 7 天前的日志
find "$LOG_DIR" -name "*.log.*" -mtime +7 -not -name "*.gz" -exec gzip {} \;

# 删除 30 天前的压缩日志
find "$LOG_DIR" -name "*.log.*.gz" -mtime +30 -delete

# 重新打开日志文件
if [ -f "$NGINX_PID" ]; then
    kill -USR1 `cat $NGINX_PID`
fi

echo "日志切割完成：$DATE"
EOF

# 添加执行权限
sudo chmod +x /usr/local/bin/nginx-logrotate.sh
```

4. **配置定时任务**

```bash
# 编辑 crontab
sudo crontab -e

# 添加每天凌晨 2 点执行日志切割
0 2 * * * /usr/local/bin/nginx-logrotate.sh >> /var/log/nginx-logrotate.log 2>&1
```

5. **验证日志切割**

```bash
# 手动执行脚本测试
sudo /usr/local/bin/nginx-logrotate.sh

# 检查日志文件
ls -lh /var/log/nginx/

# 查看切割后的日志
tail -f /var/log/nginx/access.log.20231225

# 检查压缩日志
ls -lh /var/log/nginx/*.gz
```

6. **配置日志分析**

```bash
# 安装 GoAccess（可选）
# macOS
brew install goaccess

# Ubuntu
sudo apt-get install goaccess

# 生成日志分析报告
goaccess /var/log/nginx/access.log --log-format=COMBINED -o /var/www/report.html

# 实时监控（需要 Web 服务器）
goaccess /var/log/nginx/access.log --log-format=COMBINED --real-time-html --port=7890
```

**预期结果**:
- 日志文件每天自动切割
- 旧日志自动压缩
- 30 天前的日志自动删除
- 日志分析工具可以正常使用

## 学习检查清单

完成以下检查项，确保掌握核心知识点：

- [ ] 理解限流原理和配置方法（limit_req、limit_conn）
- [ ] 能够配置接口限流，防止 API 滥用
- [ ] 理解防盗链原理，能够配置图片防盗链
- [ ] 掌握安全响应头配置（X-Frame-Options、CSP 等）
- [ ] 能够配置防爬虫规则
- [ ] 理解 Gzip 和 Brotli 压缩配置
- [ ] 能够优化压缩配置，提升传输效率
- [ ] 掌握多站点配置（Server Blocks）
- [ ] 能够在一台服务器上配置多个网站
- [ ] 理解 Nginx 日志格式和变量
- [ ] 能够配置日志切割和归档
- [ ] 掌握基础的日志分析方法

## 常见问题排查

### 1. 限流不生效

**问题**: 配置了限流但没效果

**排查步骤**:
```bash
# 检查 Nginx 配置语法
nginx -t

# 检查 limit_req 模块是否加载
nginx -V 2>&1 | grep limit_req

# 检查日志中的限流信息
grep "limit_req_status" /var/log/nginx/access.log

# 检查 zone 内存是否足够
# 如果请求量大，需要增加 zone 大小
```

### 2. 防盗链不生效

**问题**: 配置了防盗链但其他网站仍能引用

**排查步骤**:
```bash
# 检查 Referer 头是否正确
curl -I -H "Referer: http://evil.com" http://example.com/image.jpg

# 检查 valid_referers 配置
# 注意：某些浏览器可能不发送 Referer

# 检查 $invalid_referer 变量
# 在 location 中添加日志记录
access_log /var/log/nginx/referer.log;
```

### 3. 压缩不生效

**问题**: 配置了 Gzip 但响应未压缩

**排查步骤**:
```bash
# 检查 Gzip 模块是否加载
nginx -V 2>&1 | grep gzip

# 检查响应头
curl -H "Accept-Encoding: gzip" -I http://example.com

# 应该看到：Content-Encoding: gzip

# 检查文件类型是否在 gzip_types 中
# 检查文件大小是否大于 gzip_min_length
```

### 4. 多站点配置冲突

**问题**: 多个站点配置冲突，访问错误

**排查步骤**:
```bash
# 检查 server_name 配置
nginx -T | grep server_name

# 检查默认服务器配置
# 确保只有一个 default_server

# 检查端口冲突
netstat -tlnp | grep :80

# 测试每个站点配置
nginx -t
```

### 5. 日志切割失败

**问题**: 日志切割后 Nginx 无法写入新日志

**排查步骤**:
```bash
# 检查文件权限
ls -l /var/log/nginx/

# 检查 Nginx 进程用户
ps aux | grep nginx

# 确保日志目录权限正确
sudo chown -R nginx:nginx /var/log/nginx/

# 检查磁盘空间
df -h /var/log/

# 手动触发日志重新打开
kill -USR1 $(cat /var/run/nginx.pid)
```

## 扩展学习资源

- **Nginx 官方文档**: https://nginx.org/en/docs/
- **Nginx 限流模块**: https://nginx.org/en/docs/http/ngx_http_limit_req_module.html
- **Nginx 安全配置指南**: https://nginx.org/en/docs/http/configuring_https_servers.html
- **Content Security Policy**: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP
- **GoAccess 文档**: https://goaccess.io/
- **logrotate 文档**: https://linux.die.net/man/8/logrotate

## 总结

Day 8 的学习重点在于掌握 Nginx 的高级配置，包括：

1. **限流配置**: 保护服务器和 API，防止滥用和攻击
2. **安全配置**: 防盗链、安全响应头、防爬虫等
3. **压缩优化**: Gzip 和 Brotli 配置，提升传输效率
4. **多站点配置**: 虚拟主机配置，一台服务器托管多个网站
5. **日志管理**: 日志格式、分析、切割和归档

通过本日的学习和实践，你将能够：
- 配置生产级别的 Nginx 安全策略
- 优化 Nginx 性能配置
- 管理多站点 Nginx 服务器
- 有效管理和分析 Nginx 日志

这些技能对于生产环境的 Nginx 部署至关重要，是保障服务稳定性和安全性的基础。

