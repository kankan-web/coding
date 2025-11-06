# Day 3: Nginx 基础配置 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 在 macOS 和 Linux 系统上安装和配置 Nginx
- 理解 Nginx 配置文件的基本结构（http、server、location）
- 配置 Nginx 提供静态文件服务
- 配置和查看 Nginx 日志（访问日志、错误日志）
- 理解日志格式和日志切割机制
- 进行基础性能优化（worker_processes、keepalive）
- 测试和验证 Nginx 配置的有效性

## 核心知识点

### 1. Nginx 简介

#### Nginx 是什么

Nginx（发音为 "engine-x"）是一个高性能的 Web 服务器和反向代理服务器，特点：

- **高性能**: 事件驱动架构，能够处理大量并发连接
- **低内存占用**: 相比 Apache，内存占用更少
- **反向代理**: 可以作为反向代理服务器
- **负载均衡**: 支持多种负载均衡算法
- **静态文件服务**: 高效提供静态文件服务
- **高可扩展性**: 丰富的模块系统

#### Nginx vs Apache

| 特性 | Nginx | Apache |
|------|-------|--------|
| 架构 | 事件驱动 | 多进程/多线程 |
| 内存占用 | 较低 | 较高 |
| 并发处理 | 优秀 | 良好 |
| 配置复杂度 | 相对简单 | 较复杂 |
| 模块系统 | 动态加载 | 动态/静态加载 |
| 适用场景 | 高并发、反向代理 | 传统 Web 应用 |

### 2. Nginx 安装和启动

#### macOS 安装

**方法 1: 使用 Homebrew（推荐）**

```bash
# 安装 Homebrew（如果未安装）
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Nginx
brew install nginx

# 查看安装位置
brew info nginx
```

安装后的关键路径：
- 配置文件：`/opt/homebrew/etc/nginx/nginx.conf`（Apple Silicon）或 `/usr/local/etc/nginx/nginx.conf`（Intel）
- 网站根目录：`/opt/homebrew/var/www`（Apple Silicon）或 `/usr/local/var/www`（Intel）
- 日志目录：`/opt/homebrew/var/log/nginx`（Apple Silicon）或 `/usr/local/var/log/nginx`（Intel）

**方法 2: 使用 MacPorts**

```bash
# 安装 MacPorts（如果未安装）
# 从 https://www.macports.org/ 下载安装包

# 安装 Nginx
sudo port install nginx
```

#### Linux 安装

**Ubuntu/Debian:**

```bash
# 更新包管理器
sudo apt update

# 安装 Nginx
sudo apt install nginx

# 查看版本
nginx -v
```

**CentOS/RHEL:**

```bash
# 使用 yum 安装
sudo yum install nginx

# 或使用 dnf（CentOS 8+）
sudo dnf install nginx
```

**从源码编译安装（高级用户）:**

```bash
# 下载源码
wget http://nginx.org/download/nginx-1.24.0.tar.gz
tar -xzf nginx-1.24.0.tar.gz
cd nginx-1.24.0

# 配置编译选项
./configure --prefix=/usr/local/nginx \
            --with-http_ssl_module \
            --with-http_gzip_static_module

# 编译和安装
make
sudo make install
```

#### Nginx 启动和停止

**macOS (Homebrew):**

```bash
# 启动 Nginx
brew services start nginx

# 停止 Nginx
brew services stop nginx

# 重启 Nginx
brew services restart nginx

# 查看状态
brew services list
```

**Linux (systemd):**

```bash
# 启动 Nginx
sudo systemctl start nginx

# 停止 Nginx
sudo systemctl stop nginx

# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 设置开机自启
sudo systemctl enable nginx

# 取消开机自启
sudo systemctl disable nginx
```

**手动启动（调试用）:**

```bash
# 启动（前台运行）
sudo nginx

# 停止
sudo nginx -s stop

# 优雅停止（等待当前请求完成）
sudo nginx -s quit

# 重新加载配置（不停止服务）
sudo nginx -s reload

# 重新打开日志文件
sudo nginx -s reopen

# 测试配置文件语法
sudo nginx -t

# 查看 Nginx 版本和编译信息
nginx -V
```

#### 验证安装

安装完成后，访问 `http://localhost`，应该看到 Nginx 默认欢迎页面。

```bash
# 检查 Nginx 是否运行
ps aux | grep nginx

# 检查端口是否监听
netstat -an | grep 80
# 或使用
lsof -i :80

# 使用 curl 测试
curl http://localhost
```

### 3. Nginx 配置文件结构

#### 配置文件位置

- **macOS (Homebrew)**: `/opt/homebrew/etc/nginx/nginx.conf` 或 `/usr/local/etc/nginx/nginx.conf`
- **Linux (Ubuntu/Debian)**: `/etc/nginx/nginx.conf`
- **Linux (CentOS/RHEL)**: `/etc/nginx/nginx.conf`
- **源码安装**: `/usr/local/nginx/conf/nginx.conf`（取决于 configure 时的 prefix）

#### 配置文件结构

Nginx 配置文件采用层级结构，主要包含以下部分：

```
全局块（main）
├── events 块
└── http 块
    ├── server 块（虚拟主机）
    │   ├── location 块
    │   └── location 块
    └── server 块
        └── location 块
```

#### 全局块（main）

全局块配置影响整个 Nginx 服务器的行为：

```nginx
# 运行 Nginx 的用户和组
user nginx;

# Worker 进程数（通常设置为 CPU 核心数）
worker_processes auto;

# 错误日志位置和级别
error_log /var/log/nginx/error.log warn;

# PID 文件位置
pid /var/run/nginx.pid;

# 最大文件描述符数量
worker_rlimit_nofile 65535;
```

**关键配置说明：**

- `user`: 运行 Nginx 的用户，建议使用非 root 用户
- `worker_processes`: 
  - `auto`: 自动检测 CPU 核心数
  - 数字: 指定进程数（如 `4`）
  - 建议：设置为 CPU 核心数
- `error_log`: 错误日志位置和级别（debug、info、notice、warn、error、crit）
- `pid`: 主进程 ID 文件位置

#### events 块

events 块配置影响 Nginx 的网络连接处理：

```nginx
events {
    # 每个 worker 进程的最大连接数
    worker_connections 1024;
    
    # 使用 epoll（Linux）或 kqueue（macOS/FreeBSD）
    use epoll;
    
    # 允许一个 worker 进程同时接受多个连接
    multi_accept on;
}
```

**关键配置说明：**

- `worker_connections`: 每个 worker 进程的最大并发连接数
  - 总并发连接数 = `worker_processes` × `worker_connections`
  - 例如：4 个进程 × 1024 连接 = 4096 个并发连接
- `use`: 指定事件模型
  - Linux: `epoll`（推荐）
  - macOS/FreeBSD: `kqueue`
  - 不指定时 Nginx 会自动选择
- `multi_accept`: 是否允许一个 worker 进程同时接受多个连接

#### http 块

http 块配置 HTTP 服务器相关的所有设置：

```nginx
http {
    # MIME 类型配置
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式定义
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 访问日志
    access_log /var/log/nginx/access.log main;
    
    # 基本性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # 包含其他配置文件
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

**关键配置说明：**

- `include`: 引入其他配置文件，实现模块化配置
- `log_format`: 定义日志格式（后面详细说明）
- `sendfile`: 启用高效文件传输
- `tcp_nopush`: 与 `sendfile` 配合使用，优化网络包传输
- `tcp_nodelay`: 禁用 Nagle 算法，减少延迟
- `keepalive_timeout`: Keep-Alive 连接超时时间

#### server 块

server 块定义虚拟主机，可以配置多个 server 块：

```nginx
server {
    # 监听端口和地址
    listen 80;
    listen [::]:80;  # IPv6
    
    # 服务器名称（域名）
    server_name localhost example.com www.example.com;
    
    # 网站根目录
    root /var/www/html;
    
    # 默认文件
    index index.html index.htm index.nginx-debian.html;
    
    # 字符编码
    charset utf-8;
    
    # 访问日志
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    
    # Location 块
    location / {
        # 配置内容
    }
}
```

**关键配置说明：**

- `listen`: 监听端口和地址
  - `listen 80;`: 监听所有接口的 80 端口
  - `listen 127.0.0.1:8080;`: 只监听本地回环的 8080 端口
- `server_name`: 服务器名称，用于匹配请求的 Host 头
  - 支持通配符：`*.example.com`
  - 支持正则表达式：`~^www\.example\.com$`
  - `_`: 匹配所有未匹配的 server_name

#### location 块

location 块用于匹配 URI，并配置对应的处理方式：

```nginx
# 精确匹配（优先级最高）
location = / {
    # 只匹配 http://example.com/
}

# 前缀匹配（优先级次之）
location / {
    # 匹配所有以 / 开头的 URI
}

# 正则匹配（大小写敏感）
location ~ /images/ {
    # 匹配包含 /images/ 的 URI
}

# 正则匹配（大小写不敏感）
location ~* \.(jpg|jpeg|png|gif)$ {
    # 匹配图片文件
}

# 最长前缀匹配（优先级最低）
location ^~ /static/ {
    # 匹配以 /static/ 开头的 URI，优先级高于正则匹配
}
```

**匹配优先级规则：**

1. `=` 精确匹配（最高优先级）
2. `^~` 前缀匹配（如果匹配，不再检查正则）
3. `~` 或 `~*` 正则匹配（按顺序检查）
4. 普通前缀匹配（最长匹配）

**常用 location 配置：**

```nginx
location / {
    # 尝试文件，不存在则返回 404
    try_files $uri $uri/ =404;
}

location /static/ {
    # 静态文件服务
    alias /var/www/static/;
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    # 静态资源缓存
    expires 1y;
    add_header Cache-Control "public, immutable";
    access_log off;
}
```

### 4. 静态文件服务配置

#### 基础静态文件服务

最简单的静态文件服务配置：

```nginx
server {
    listen 80;
    server_name localhost;
    
    # 网站根目录
    root /var/www/html;
    
    # 默认文件
    index index.html index.htm;
    
    # 基础 location
    location / {
        try_files $uri $uri/ =404;
    }
}
```

#### 优化静态文件服务

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /var/www/html;
    index index.html;
    
    # 启用 sendfile，高效文件传输
    sendfile on;
    tcp_nopush on;
    
    # 字符编码
    charset utf-8;
    
    # 所有请求
    location / {
        try_files $uri $uri/ =404;
    }
    
    # 静态资源缓存（JS、CSS、图片等）
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;  # 不记录静态资源访问日志，减少 I/O
    }
    
    # HTML 文件不缓存或短期缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }
    
    # 禁止访问隐藏文件（以 . 开头的文件）
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 禁止访问特定文件
    location ~* \.(sql|bak|conf|sh)$ {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # 404 错误页面
    error_page 404 /404.html;
    location = /404.html {
        internal;
        root /var/www/html;
    }
}
```

#### 静态文件服务最佳实践

1. **启用 sendfile**: 减少内核态和用户态之间的数据拷贝
2. **设置合理的缓存策略**: 静态资源长期缓存，HTML 不缓存
3. **使用 expires 和 Cache-Control**: 双重缓存控制
4. **关闭静态资源访问日志**: 减少磁盘 I/O（`access_log off`）
5. **禁止访问敏感文件**: 隐藏文件、配置文件等
6. **自定义错误页面**: 提供友好的错误提示

### 5. 日志配置和查看

#### 日志类型

Nginx 有两种主要日志：

- **访问日志（access.log）**: 记录所有客户端请求
- **错误日志（error.log）**: 记录错误和警告信息

#### 访问日志配置

**基础配置：**

```nginx
http {
    # 定义日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 设置访问日志
    access_log /var/log/nginx/access.log main;
    
    # 在 server 块中可以覆盖
    server {
        access_log /var/log/nginx/example.com.access.log main;
    }
    
    # 在 location 块中可以关闭日志
    location /static/ {
        access_log off;
    }
}
```

**常用日志变量：**

| 变量 | 说明 | 示例 |
|------|------|------|
| `$remote_addr` | 客户端 IP 地址 | `192.168.1.100` |
| `$remote_user` | 认证用户名（基本认证） | `admin` |
| `$time_local` | 本地时间 | `25/Dec/2023:10:30:45 +0800` |
| `$request` | 完整请求行 | `GET /index.html HTTP/1.1` |
| `$request_method` | 请求方法 | `GET`、`POST` |
| `$request_uri` | 完整请求 URI | `/index.html?id=123` |
| `$status` | 响应状态码 | `200`、`404`、`500` |
| `$body_bytes_sent` | 响应体字节数 | `1024` |
| `$http_referer` | Referer 头 | `https://example.com/` |
| `$http_user_agent` | User-Agent 头 | `Mozilla/5.0...` |
| `$http_x_forwarded_for` | X-Forwarded-For 头（代理） | `192.168.1.1` |
| `$request_time` | 请求处理时间（秒） | `0.123` |
| `$upstream_response_time` | 上游响应时间 | `0.456` |

**自定义日志格式示例：**

```nginx
# JSON 格式日志（便于解析）
log_format json escape=json
    '{'
    '"time":"$time_iso8601",'
    '"remote_addr":"$remote_addr",'
    '"request":"$request",'
    '"status":$status,'
    '"body_bytes_sent":$body_bytes_sent,'
    '"request_time":$request_time,'
    '"http_referer":"$http_referer",'
    '"http_user_agent":"$http_user_agent"'
    '}';

access_log /var/log/nginx/access.json.log json;

# 详细日志格式（包含更多信息）
log_format detailed '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

access_log /var/log/nginx/access.detailed.log detailed;
```

#### 错误日志配置

```nginx
# 全局错误日志
error_log /var/log/nginx/error.log warn;

# server 块中可以覆盖
server {
    error_log /var/log/nginx/example.com.error.log error;
}

# 日志级别（从低到高）
# debug | info | notice | warn | error | crit | alert | emerg
```

**错误日志级别说明：**

- `debug`: 调试信息（最详细，性能影响大）
- `info`: 一般信息
- `notice`: 通知信息
- `warn`: 警告信息（推荐用于生产环境）
- `error`: 错误信息
- `crit`: 严重错误
- `alert`: 警报
- `emerg`: 紧急错误

#### 日志查看和分析

**实时查看日志：**

```bash
# 查看访问日志（实时）
tail -f /var/log/nginx/access.log

# 查看错误日志（实时）
tail -f /var/log/nginx/error.log

# 查看最近 100 行
tail -n 100 /var/log/nginx/access.log
```

**日志分析命令：**

```bash
# 统计访问次数最多的 IP
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计访问次数最多的页面
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计状态码分布
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 统计特定时间段的请求
grep "25/Dec/2023:10" /var/log/nginx/access.log | wc -l

# 查找错误请求（状态码 >= 400）
awk '$9 >= 400 {print $0}' /var/log/nginx/access.log

# 统计响应时间大于 1 秒的请求（如果日志包含 $request_time）
awk '$NF > 1 {print $0}' /var/log/nginx/access.log
```

**使用工具分析日志：**

```bash
# 使用 goaccess（需要安装）
# macOS: brew install goaccess
# Linux: sudo apt install goaccess

goaccess /var/log/nginx/access.log --log-format=COMBINED

# 生成 HTML 报告
goaccess /var/log/nginx/access.log --log-format=COMBINED -o report.html
```

#### 日志切割

日志文件会不断增长，需要定期切割和归档。

**方法 1: 使用 logrotate（推荐）**

创建 logrotate 配置文件 `/etc/logrotate.d/nginx`：

```bash
/var/log/nginx/*.log {
    daily                    # 每天轮转
    missingok               # 文件不存在也不报错
    rotate 14               # 保留 14 天的日志
    compress                # 压缩旧日志
    delaycompress           # 延迟压缩（下一天压缩）
    notifempty              # 空文件不轮转
    create 0640 www-data adm  # 创建新文件的权限和所有者
    sharedscripts           # 共享脚本
    postrotate               # 轮转后执行的命令
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

测试配置：

```bash
sudo logrotate -d /etc/logrotate.d/nginx  # 测试（dry-run）
sudo logrotate -f /etc/logrotate.d/nginx   # 强制执行
```

**方法 2: 手动切割脚本**

创建脚本 `/usr/local/bin/nginx-logrotate.sh`：

```bash
#!/bin/bash
# Nginx 日志切割脚本

LOG_DIR="/var/log/nginx"
DATE=$(date +%Y%m%d)

# 重命名日志文件
mv ${LOG_DIR}/access.log ${LOG_DIR}/access.log.${DATE}
mv ${LOG_DIR}/error.log ${LOG_DIR}/error.log.${DATE}

# 重新打开日志文件（发送 USR1 信号）
kill -USR1 $(cat /var/run/nginx.pid)

# 压缩旧日志（7 天前的）
find ${LOG_DIR} -name "*.log.*" -mtime +7 -exec gzip {} \;

# 删除 30 天前的日志
find ${LOG_DIR} -name "*.log.*.gz" -mtime +30 -delete
```

添加到 crontab（每天凌晨 1 点执行）：

```bash
# 编辑 crontab
crontab -e

# 添加以下行
0 1 * * * /usr/local/bin/nginx-logrotate.sh
```

### 6. 基础性能优化

#### worker_processes 优化

```nginx
# 自动检测 CPU 核心数（推荐）
worker_processes auto;

# 手动指定（如果不使用 auto）
# worker_processes 4;  # 4 核 CPU

# 绑定 worker 进程到特定 CPU（高级优化）
worker_processes 4;
worker_cpu_affinity 0001 0010 0100 1000;
```

**优化建议：**

- 使用 `auto` 让 Nginx 自动检测
- 通常设置为 CPU 核心数
- 对于 I/O 密集型应用，可以设置为 CPU 核心数的 1.5-2 倍

#### worker_connections 优化

```nginx
events {
    # 每个 worker 的最大连接数
    worker_connections 1024;
    
    # 总并发连接数 = worker_processes × worker_connections
    # 例如：4 进程 × 1024 = 4096 个并发连接
}
```

**优化建议：**

- 根据服务器内存和并发需求调整
- Linux 系统需要调整 `ulimit`：
  ```bash
  # 查看当前限制
  ulimit -n
  
  # 临时设置（需要 root）
  ulimit -n 65535
  
  # 永久设置（编辑 /etc/security/limits.conf）
  * soft nofile 65535
  * hard nofile 65535
  ```

#### Keep-Alive 优化

```nginx
http {
    # Keep-Alive 超时时间（秒）
    keepalive_timeout 65;
    
    # 单个连接的最大请求数
    keepalive_requests 100;
    
    # 禁用 Keep-Alive（不推荐）
    # keepalive_timeout 0;
}
```

**优化建议：**

- `keepalive_timeout`: 设置合理的超时时间（30-120 秒）
- `keepalive_requests`: 单个连接的最大请求数，避免连接时间过长
- 启用 Keep-Alive 可以减少 TCP 连接建立的开销

#### Sendfile 优化

```nginx
http {
    # 启用高效文件传输
    sendfile on;
    
    # 与 sendfile 配合使用，优化网络包传输
    tcp_nopush on;
    
    # 禁用 Nagle 算法，减少延迟
    tcp_nodelay on;
}
```

**优化说明：**

- `sendfile`: 在内核空间直接传输文件，避免用户空间拷贝
- `tcp_nopush`: 与 `sendfile` 配合，等待数据包填满再发送
- `tcp_nodelay`: 禁用 Nagle 算法，立即发送数据（对于实时应用）

#### Gzip 压缩优化

```nginx
http {
    # 启用 Gzip 压缩
    gzip on;
    
    # 压缩级别（1-9，级别越高压缩率越高但 CPU 消耗越大）
    gzip_comp_level 6;
    
    # 最小压缩文件大小（小于此大小的文件不压缩）
    gzip_min_length 1000;
    
    # 压缩的文件类型
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # 对代理请求添加 Vary: Accept-Encoding
    gzip_vary on;
    
    # 禁用 gzip 的 User-Agent（旧浏览器）
    gzip_disable "msie6";
}
```

**优化建议：**

- `gzip_comp_level`: 推荐 6（平衡压缩率和性能）
- `gzip_min_length`: 小文件压缩效果不明显，建议设置最小值
- `gzip_types`: 只压缩文本类资源，不压缩已压缩的资源（图片、视频）

#### 文件描述符限制

```nginx
# 全局块
worker_rlimit_nofile 65535;
```

需要同时调整系统限制（见 worker_connections 部分）。

## 实战任务

### 任务 1: 在本地安装 Nginx

#### macOS 安装步骤

1. **安装 Homebrew（如果未安装）**

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **安装 Nginx**

   ```bash
   brew install nginx
   ```

3. **查看安装信息**

   ```bash
   brew info nginx
   ```

4. **启动 Nginx**

   ```bash
   brew services start nginx
   ```

5. **验证安装**

   ```bash
   # 检查进程
   ps aux | grep nginx
   
   # 检查端口
   lsof -i :8080
   
   # 访问测试
   curl http://localhost:8080
   ```

   访问 `http://localhost:8080` 应该看到 Nginx 欢迎页面。

#### Linux 安装步骤

1. **更新包管理器（Ubuntu/Debian）**

   ```bash
   sudo apt update
   ```

2. **安装 Nginx**

   ```bash
   sudo apt install nginx
   ```

3. **启动 Nginx**

   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx  # 开机自启
   ```

4. **验证安装**

   ```bash
   # 检查状态
   sudo systemctl status nginx
   
   # 访问测试
   curl http://localhost
   ```

### 任务 2: 配置简单的静态文件服务

#### 步骤 1: 准备测试文件

```bash
# 创建网站目录
sudo mkdir -p /var/www/html

# 创建测试文件
sudo tee /var/www/html/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Nginx 测试页面</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
        }
        h1 { color: #333; }
        .info { background: #f0f0f0; padding: 15px; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>欢迎使用 Nginx</h1>
    <div class="info">
        <p>这是一个 Nginx 静态文件服务测试页面。</p>
        <p>如果你看到这个页面，说明 Nginx 配置成功！</p>
    </div>
</body>
</html>
EOF
```

#### 步骤 2: 配置 Nginx

**macOS 配置文件位置**: `/opt/homebrew/etc/nginx/nginx.conf` 或 `/usr/local/etc/nginx/nginx.conf`

**Linux 配置文件位置**: `/etc/nginx/nginx.conf`

编辑配置文件：

```bash
# macOS
sudo vi /opt/homebrew/etc/nginx/nginx.conf

# Linux
sudo vi /etc/nginx/nginx.conf
```

**基础配置示例：**

```nginx
# 全局配置
user nginx;  # Linux，macOS 可能需要改为当前用户
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    access_log /var/log/nginx/access.log main;
    
    # 性能优化
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    
    # Server 块
    server {
        listen 80;
        server_name localhost;
        
        root /var/www/html;
        index index.html;
        
        charset utf-8;
        
        location / {
            try_files $uri $uri/ =404;
        }
        
        # 静态资源缓存
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            access_log off;
        }
        
        # HTML 文件不缓存
        location ~* \.html$ {
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # 错误页面
        error_page 404 /404.html;
    }
}
```

#### 步骤 3: 测试配置文件

```bash
# 测试配置文件语法
sudo nginx -t

# 应该看到类似输出：
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

#### 步骤 4: 重启 Nginx

```bash
# macOS
brew services restart nginx

# Linux
sudo systemctl restart nginx

# 或使用 Nginx 命令
sudo nginx -s reload
```

#### 步骤 5: 验证配置

```bash
# 访问测试
curl http://localhost

# 或使用浏览器访问 http://localhost
```

### 任务 3: 实践日志分析

#### 步骤 1: 配置详细日志格式

编辑 `nginx.conf`，添加详细日志格式：

```nginx
http {
    # 基础日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    
    # 详细日志格式（包含响应时间）
    log_format detailed '$remote_addr - $remote_user [$time_local] "$request" '
                       '$status $body_bytes_sent "$http_referer" '
                       '"$http_user_agent" "$http_x_forwarded_for" '
                       'rt=$request_time uct="$upstream_connect_time" '
                       'uht="$upstream_header_time" urt="$upstream_response_time"';
    
    # JSON 格式日志
    log_format json escape=json
        '{'
        '"time":"$time_iso8601",'
        '"remote_addr":"$remote_addr",'
        '"request":"$request",'
        '"status":$status,'
        '"body_bytes_sent":$body_bytes_sent,'
        '"request_time":$request_time,'
        '"http_referer":"$http_referer",'
        '"http_user_agent":"$http_user_agent"'
        '}';
    
    # 使用详细日志格式
    access_log /var/log/nginx/access.log detailed;
}
```

重新加载配置：

```bash
sudo nginx -s reload
```

#### 步骤 2: 生成一些访问日志

```bash
# 使用 curl 访问几次
for i in {1..10}; do
    curl http://localhost
    sleep 1
done

# 或使用 ab（Apache Bench）进行压力测试
ab -n 100 -c 10 http://localhost/
```

#### 步骤 3: 查看和分析日志

```bash
# 查看最新日志
tail -n 20 /var/log/nginx/access.log

# 实时查看日志
tail -f /var/log/nginx/access.log

# 统计访问次数最多的 IP
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计访问次数最多的页面
awk '{print $7}' /var/log/nginx/access.log | sort | uniq -c | sort -rn | head -10

# 统计状态码分布
awk '{print $9}' /var/log/nginx/access.log | sort | uniq -c | sort -rn

# 查找错误请求（4xx、5xx）
awk '$9 >= 400 {print $0}' /var/log/nginx/access.log

# 统计响应时间（如果使用详细日志格式）
awk -F'rt=' '{print $2}' /var/log/nginx/access.log | awk '{print $1}' | sort -n | tail -10
```

#### 步骤 4: 配置日志切割

创建 logrotate 配置文件：

```bash
# Linux
sudo tee /etc/logrotate.d/nginx <<EOF
/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 \`cat /var/run/nginx.pid\`
        fi
    endscript
}
EOF

# macOS（Homebrew）
sudo tee /opt/homebrew/etc/logrotate.d/nginx <<EOF
/opt/homebrew/var/log/nginx/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 $(whoami) admin
    sharedscripts
    postrotate
        if [ -f /opt/homebrew/var/run/nginx.pid ]; then
            kill -USR1 \`cat /opt/homebrew/var/run/nginx.pid\`
        fi
    endscript
}
EOF
```

测试配置：

```bash
sudo logrotate -d /etc/logrotate.d/nginx
```

### 任务 4: 测试静态文件访问性能

#### 步骤 1: 准备测试文件

```bash
# 创建测试目录
sudo mkdir -p /var/www/html/test

# 创建不同大小的测试文件
sudo dd if=/dev/zero of=/var/www/html/test/small.txt bs=1K count=10
sudo dd if=/dev/zero of=/var/www/html/test/medium.txt bs=1M count=1
sudo dd if=/dev/zero of=/var/www/html/test/large.txt bs=1M count=10

# 创建 HTML 测试页面
sudo tee /var/www/html/test/index.html <<EOF
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>性能测试</title>
</head>
<body>
    <h1>Nginx 性能测试</h1>
    <ul>
        <li><a href="small.txt">小文件 (10KB)</a></li>
        <li><a href="medium.txt">中等文件 (1MB)</a></li>
        <li><a href="large.txt">大文件 (10MB)</a></li>
    </ul>
</body>
</html>
EOF
```

#### 步骤 2: 使用 ab 进行压力测试

```bash
# 安装 Apache Bench（如果未安装）
# macOS: brew install httpd
# Linux: sudo apt install apache2-utils

# 基础测试（100 个请求，10 个并发）
ab -n 100 -c 10 http://localhost/test/small.txt

# 详细测试报告
ab -n 1000 -c 50 -v 2 http://localhost/test/small.txt

# 测试大文件
ab -n 100 -c 10 http://localhost/test/large.txt

# 保存测试结果
ab -n 1000 -c 50 http://localhost/test/small.txt > ab_results.txt
```

**ab 参数说明：**

- `-n`: 总请求数
- `-c`: 并发数
- `-v`: 详细级别（1-4）
- `-k`: 启用 Keep-Alive

#### 步骤 3: 使用 curl 测试响应时间

```bash
# 测试响应时间
curl -w "@-" -o /dev/null -s http://localhost/test/small.txt <<EOF
    time_namelookup:  %{time_namelookup}\n
    time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
    time_pretransfer:  %{time_pretransfer}\n
    time_redirect:  %{time_redirect}\n
    time_starttransfer:  %{time_starttransfer}\n
    time_total:  %{time_total}\n
EOF

# 简单测试（只显示总时间）
curl -w "Time: %{time_total}s\n" -o /dev/null -s http://localhost/test/small.txt
```

#### 步骤 4: 对比优化前后的性能

**优化前测试：**

```bash
# 记录优化前的性能数据
ab -n 1000 -c 50 http://localhost/test/small.txt > before_optimization.txt
```

**应用优化配置：**

在 `nginx.conf` 中确保以下配置已启用：

```nginx
http {
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript;
}
```

**优化后测试：**

```bash
# 重新加载配置
sudo nginx -s reload

# 记录优化后的性能数据
ab -n 1000 -c 50 http://localhost/test/small.txt > after_optimization.txt

# 对比结果
diff before_optimization.txt after_optimization.txt
```

#### 步骤 5: 分析性能指标

关注以下性能指标：

- **Requests per second**: 每秒请求数（越高越好）
- **Time per request**: 每个请求的平均时间（越低越好）
- **Transfer rate**: 传输速率（越高越好）
- **Connection times**: 连接建立时间（越低越好）

## 需要关注的知识点

### 1. Nginx 配置文件语法

- **指令和参数**: 指令名和参数用空格分隔
- **分号结尾**: 每行指令以分号 `;` 结尾
- **块结构**: 使用花括号 `{}` 定义配置块
- **注释**: 使用 `#` 开头
- **变量**: 使用 `$` 开头（如 `$remote_addr`）
- **引号**: 包含空格的字符串需要用引号括起来

### 2. 配置文件测试和调试

**测试配置：**

```bash
# 测试配置文件语法
sudo nginx -t

# 测试并显示配置文件的完整路径
sudo nginx -T

# 测试并显示配置文件的解析结果
sudo nginx -T | grep -A 10 "server {"
```

**常见配置错误：**

1. **缺少分号**: 指令末尾忘记加分号
2. **花括号不匹配**: 块结构的花括号不匹配
3. **路径错误**: 文件路径不存在或权限不足
4. **端口冲突**: 监听端口已被占用

### 3. 日志格式选择

- **标准格式**: 适合大多数场景，兼容性好
- **详细格式**: 包含响应时间等信息，适合性能分析
- **JSON 格式**: 便于日志分析工具解析，适合大规模部署

### 4. 性能优化权衡

- **worker_processes**: 过多会增加上下文切换开销
- **worker_connections**: 受系统文件描述符限制
- **keepalive_timeout**: 过长会占用连接资源
- **gzip_comp_level**: 级别越高 CPU 消耗越大

### 5. 常见问题和解决方案

**问题 1: Nginx 启动失败**

- **症状**: 执行启动命令后没有反应或报错
- **原因**: 
  - 配置文件语法错误
  - 端口被占用
  - 权限不足
- **解决**:
  ```bash
  # 检查配置文件语法
  sudo nginx -t
  
  # 检查端口占用
  sudo lsof -i :80
  
  # 检查错误日志
  sudo tail -f /var/log/nginx/error.log
  ```

**问题 2: 403 Forbidden 错误**

- **症状**: 访问网站返回 403 错误
- **原因**: 
  - 文件权限不足
  - 目录索引被禁用
  - SELinux 限制（Linux）
- **解决**:
  ```bash
  # 检查文件权限
  ls -la /var/www/html
  
  # 修改文件权限
  sudo chmod -R 755 /var/www/html
  sudo chown -R www-data:www-data /var/www/html  # Linux
  sudo chown -R $(whoami):staff /var/www/html    # macOS
  
  # 检查 SELinux（Linux）
  sudo getenforce
  sudo setenforce 0  # 临时禁用（测试用）
  ```

**问题 3: 静态文件返回错误的 MIME 类型**

- **症状**: 浏览器无法正确解析文件（如 JS 文件当作文本显示）
- **原因**: `mime.types` 文件未正确包含或配置错误
- **解决**:
  ```nginx
  # 确保包含 mime.types
  http {
      include /etc/nginx/mime.types;
      default_type application/octet-stream;
  }
  ```

**问题 4: 日志文件过大**

- **症状**: 日志文件占用大量磁盘空间
- **原因**: 未配置日志切割
- **解决**: 配置 logrotate（见任务 3）

**问题 5: 性能不佳**

- **症状**: 响应时间慢，并发处理能力差
- **原因**: 未启用性能优化配置
- **解决**: 
  - 检查 `sendfile`、`tcp_nopush`、`tcp_nodelay` 是否启用
  - 调整 `worker_processes` 和 `worker_connections`
  - 启用 Gzip 压缩
  - 检查系统资源限制（ulimit）

## 学习检查清单

完成以下检查项，确保掌握 Day 3 内容：

- [ ] 能够在 macOS 和 Linux 上安装 Nginx
- [ ] 能够启动、停止、重启 Nginx
- [ ] 理解 Nginx 配置文件的基本结构（http、server、location）
- [ ] 能够配置简单的静态文件服务
- [ ] 理解 location 块的匹配规则和优先级
- [ ] 能够配置访问日志和错误日志
- [ ] 理解常用日志变量的含义
- [ ] 能够使用命令分析日志
- [ ] 能够配置日志切割（logrotate）
- [ ] 理解基础性能优化配置（worker_processes、keepalive、sendfile）
- [ ] 能够进行简单的性能测试（ab、curl）
- [ ] 能够排查常见的配置问题
- [ ] 测试了静态文件服务的配置效果
- [ ] 记录了学习笔记和遇到的问题

## 参考资源

- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Nginx 中文文档](https://nginx.org/en/docs/http/ngx_http_core_module.html)
- [Nginx 配置生成器](https://www.digitalocean.com/community/tools/nginx)
- [MDN - HTTP 缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)
- [Nginx 性能优化指南](https://www.nginx.com/blog/tuning-nginx/)
- [Logrotate 官方文档](https://linux.die.net/man/8/logrotate)
- [Apache Bench (ab) 使用指南](https://httpd.apache.org/docs/2.4/programs/ab.html)

## 学习时间分配建议

- **理论学习**: 1.5 小时
  - Nginx 简介和安装: 30 分钟
  - 配置文件结构: 30 分钟
  - 日志配置和分析: 20 分钟
  - 性能优化: 10 分钟

- **实践操作**: 2.5 小时
  - Nginx 安装和启动: 30 分钟
  - 配置静态文件服务: 40 分钟
  - 日志配置和分析: 40 分钟
  - 性能测试和优化: 40 分钟

- **总结笔记**: 30 分钟
  - 记录关键配置和命令
  - 记录遇到的问题和解决方案
  - 总结最佳实践

## 实战练习建议

1. **完成基础配置**
   - 安装 Nginx
   - 配置简单的静态文件服务
   - 测试访问

2. **日志实践**
   - 配置详细日志格式
   - 生成访问日志
   - 使用命令分析日志
   - 配置日志切割

3. **性能测试**
   - 使用 ab 进行压力测试
   - 对比优化前后的性能
   - 记录性能指标

4. **问题排查**
   - 故意制造一些配置错误
   - 练习排查和解决问题
   - 理解常见错误的原因

5. **总结最佳实践**
   - 整理常用的配置模板
   - 总结性能优化要点
   - 形成自己的 Nginx 配置规范

