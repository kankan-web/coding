# Day 6: 服务器环境搭建和域名配置 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 掌握使用 nvm 安装和管理 Node.js 多版本环境
- 理解 SSL/TLS 证书原理，能够申请和配置 Let's Encrypt 免费证书
- 掌握域名解析和 DNS 配置（A记录、CNAME、泛域名解析）
- 了解域名备案流程（国内服务器场景）
- 熟练使用 dig、nslookup 等工具检查域名解析
- 配置 SSL 证书自动续期，确保服务持续可用
- **核心目标**：完成个人应用部署到域名的完整流程

## 学习时间分配

- **理论学习**: 1.5-2 小时
- **实践操作**: 2.5-3 小时
- **问题排查和总结**: 30 分钟

## 核心知识点

### 1. Node.js 环境安装和管理

#### 1.1 nvm（Node Version Manager）介绍

**什么是 nvm？**
- nvm 是一个 Node.js 版本管理工具
- 允许在同一台机器上安装和使用多个 Node.js 版本
- 可以快速切换不同版本，适合多项目场景

**为什么使用 nvm？**
- 不同项目可能需要不同 Node.js 版本
- 方便测试新版本特性
- 避免全局安装冲突
- 项目隔离，提高稳定性

#### 1.2 nvm 安装（Linux/macOS）

**安装 nvm**

```bash
# 方式一：使用 curl（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 方式二：使用 wget
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 安装后需要重新加载 shell 配置
source ~/.bashrc  # 或 source ~/.zshrc
```

**验证安装**

```bash
nvm --version
# 应该输出版本号，如：0.39.0
```

#### 1.3 nvm 常用命令

**查看可用版本**

```bash
nvm ls-remote          # 查看所有可用版本
nvm ls-remote --lts    # 只查看 LTS（长期支持）版本
nvm ls                 # 查看本地已安装的版本
```

**安装和切换版本**

```bash
# 安装指定版本
nvm install 18.17.0    # 安装 Node.js 18.17.0
nvm install --lts      # 安装最新 LTS 版本
nvm install node       # 安装最新版本

# 切换版本
nvm use 18.17.0        # 切换到指定版本
nvm use --lts          # 切换到 LTS 版本
nvm use default        # 切换到默认版本

# 设置默认版本
nvm alias default 18.17.0
```

**其他常用命令**

```bash
nvm current            # 查看当前使用的版本
nvm uninstall 16.20.0  # 卸载指定版本
nvm which 18.17.0      # 查看指定版本的安装路径
```

#### 1.4 验证 Node.js 和 npm 安装

```bash
# 检查 Node.js 版本
node --version
# 或
node -v

# 检查 npm 版本
npm --version
# 或
npm -v

# 检查安装路径
which node
which npm
```

#### 1.5 配置 npm 镜像源（可选，国内服务器推荐）

```bash
# 查看当前镜像源
npm config get registry

# 设置淘宝镜像源（国内推荐）
npm config set registry https://registry.npmmirror.com

# 设置官方源
npm config set registry https://registry.npmjs.org/

# 使用 cnpm（阿里云镜像客户端）
npm install -g cnpm --registry=https://registry.npmmirror.com
```

### 2. SSL 证书申请和配置

#### 2.1 SSL/TLS 证书基础

**什么是 SSL 证书？**
- SSL（Secure Sockets Layer）证书用于加密客户端和服务器之间的通信
- TLS（Transport Layer Security）是 SSL 的后续版本
- 证书包含域名、公钥、证书颁发机构（CA）等信息
- 浏览器通过证书验证服务器身份，建立安全连接

**证书类型**
- **DV（Domain Validation）**：域名验证证书，申请简单，免费
- **OV（Organization Validation）**：组织验证证书，需要验证组织信息
- **EV（Extended Validation）**：扩展验证证书，最高安全级别

**证书格式**
- **PEM**：文本格式，常用扩展名 .pem, .crt, .key
- **PFX/P12**：二进制格式，包含私钥和证书
- **DER**：二进制格式

#### 2.2 Let's Encrypt 免费证书

**Let's Encrypt 简介**
- 免费、自动化的 SSL 证书颁发机构
- 证书有效期 90 天（需要定期续期）
- 支持通配符证书（*.example.com）
- 使用 ACME 协议自动验证域名所有权

**申请条件**
- 拥有域名控制权
- 服务器可以访问（用于验证）
- 开放 80 或 443 端口（用于验证）

#### 2.3 使用 acme.sh 申请证书

**acme.sh 简介**
- 一个纯 Shell 脚本实现的 ACME 客户端
- 支持多种 DNS API（阿里云、腾讯云、Cloudflare 等）
- 自动续期功能完善
- 配置简单，使用方便

**安装 acme.sh**

```bash
# 方式一：使用 curl（推荐）
curl https://get.acme.sh | sh

# 方式二：使用 wget
wget -O - https://get.acme.sh | sh

# 安装后重新加载 shell
source ~/.bashrc  # 或 source ~/.zshrc

# 查看安装位置
~/.acme.sh/acme.sh --version
```

**申请证书（HTTP 验证方式）**

```bash
# 申请单域名证书
~/.acme.sh/acme.sh --issue -d example.com -d www.example.com --webroot /var/www/html

# 申请通配符证书（需要 DNS API）
~/.acme.sh/acme.sh --issue -d example.com -d "*.example.com" --dns dns_ali

# 安装证书到 Nginx
~/.acme.sh/acme.sh --install-cert \
  -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.crt \
  --reloadcmd "systemctl reload nginx"
```

**配置 DNS API（以阿里云为例）**

```bash
# 设置阿里云 API Key 和 Secret
export Ali_Key="your_access_key"
export Ali_Secret="your_access_secret"

# 申请证书（使用 DNS API 验证）
~/.acme.sh/acme.sh --issue --dns dns_ali -d example.com -d "*.example.com"

# 安装证书
~/.acme.sh/acme.sh --install-cert \
  -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.crt \
  --reloadcmd "systemctl reload nginx"
```

**配置自动续期**

acme.sh 默认会自动续期，证书会保存在 `~/.acme.sh/` 目录下。可以通过以下命令查看续期任务：

```bash
# 查看所有证书
~/.acme.sh/acme.sh --list

# 手动续期
~/.acme.sh/acme.sh --renew -d example.com

# 查看续期日志
cat ~/.acme.sh/acme.sh.log
```

#### 2.4 使用 certbot 申请证书（官方推荐）

**certbot 简介**
- Let's Encrypt 官方推荐的 ACME 客户端
- 功能强大，支持多种 Web 服务器插件
- 自动配置 Nginx/Apache

**安装 certbot**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install epel-release
sudo yum install certbot python3-certbot-nginx
```

**申请证书（自动配置 Nginx）**

```bash
# 自动配置 Nginx（推荐）
sudo certbot --nginx -d example.com -d www.example.com

# 仅获取证书（手动配置）
sudo certbot certonly --nginx -d example.com -d www.example.com

# 使用 standalone 模式（需要停止 Web 服务器）
sudo certbot certonly --standalone -d example.com -d www.example.com

# 使用 webroot 模式（不需要停止服务器）
sudo certbot certonly --webroot -w /var/www/html -d example.com -d www.example.com
```

**证书位置**

certbot 获取的证书通常保存在：
- **证书文件**: `/etc/letsencrypt/live/example.com/fullchain.pem`
- **私钥文件**: `/etc/letsencrypt/live/example.com/privkey.pem`
- **证书链**: `/etc/letsencrypt/live/example.com/chain.pem`

**配置自动续期**

```bash
# 查看续期任务
sudo certbot renew --dry-run

# 手动续期
sudo certbot renew

# 查看续期服务状态
sudo systemctl status certbot.timer

# 启用自动续期服务（默认已启用）
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### 2.5 Nginx SSL 配置

**基本 SSL 配置**

```nginx
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    # SSL 证书配置
    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;

    # SSL 优化配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 其他配置...
    root /var/www/html;
    index index.html;
}
```

**HTTP 重定向到 HTTPS**

```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    
    # 重定向所有 HTTP 请求到 HTTPS
    return 301 https://$server_name$request_uri;
}
```

**SSL 安全配置最佳实践**

```nginx
server {
    listen 443 ssl http2;
    server_name example.com;

    ssl_certificate /etc/nginx/ssl/example.com.crt;
    ssl_certificate_key /etc/nginx/ssl/example.com.key;

    # 只支持 TLS 1.2 和 1.3
    ssl_protocols TLSv1.2 TLSv1.3;
    
    # 使用安全的加密套件
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers on;
    
    # SSL 会话缓存
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS（HTTP Strict Transport Security）
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # 其他安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 3. 域名解析和 DNS 配置

#### 3.1 DNS 基础概念

**什么是 DNS？**
- DNS（Domain Name System）是域名系统
- 将域名转换为 IP 地址的服务
- 使用分层树状结构

**DNS 解析过程**
1. 浏览器查询本地 DNS 缓存
2. 查询本地 hosts 文件
3. 查询本地 DNS 服务器（ISP 提供）
4. 递归查询根 DNS 服务器
5. 查询顶级域名服务器（.com）
6. 查询权威域名服务器
7. 返回 IP 地址

#### 3.2 DNS 记录类型

**A 记录（Address Record）**
- 将域名指向 IPv4 地址
- 格式：`example.com A 192.168.1.1`
- 用途：最常用的记录类型，用于网站访问

**AAAA 记录（IPv6 Address Record）**
- 将域名指向 IPv6 地址
- 格式：`example.com AAAA 2001:db8::1`
- 用途：支持 IPv6 访问

**CNAME 记录（Canonical Name）**
- 将域名指向另一个域名
- 格式：`www.example.com CNAME example.com`
- 用途：域名别名，常用于 CDN 配置

**MX 记录（Mail Exchange）**
- 指定邮件服务器
- 格式：`example.com MX 10 mail.example.com`
- 用途：邮件服务配置

**TXT 记录（Text Record）**
- 文本记录，用于验证、SPF 等
- 格式：`example.com TXT "v=spf1 include:_spf.google.com ~all"`
- 用途：域名验证、SPF 邮件验证

**NS 记录（Name Server）**
- 指定域名服务器
- 格式：`example.com NS ns1.example.com`
- 用途：指定域名的 DNS 服务器

#### 3.3 域名解析配置

**A 记录配置示例**

```
类型    主机记录    记录值           TTL
A       @          192.168.1.100   600
A       www        192.168.1.100   600
A       api        192.168.1.101   600
```

**CNAME 记录配置示例**

```
类型    主机记录    记录值              TTL
CNAME   www        example.com        600
CNAME   cdn        cdn.example.com    600
```

**泛域名解析（通配符）**

```
类型    主机记录    记录值           TTL
A       *          192.168.1.100   600
```

**多级子域名配置**

```
类型    主机记录    记录值           TTL
A       blog       192.168.1.102   600
A       shop       192.168.1.103   600
A       api        192.168.1.104   600
```

#### 3.4 常见 DNS 服务商配置

**阿里云 DNS 配置**
1. 登录阿里云控制台
2. 进入「域名」→「解析」
3. 添加记录：
   - 记录类型：A/CNAME
   - 主机记录：@（代表根域名）或 www
   - 记录值：服务器 IP 或域名
   - TTL：600（10分钟）

**腾讯云 DNS 配置**
1. 登录腾讯云控制台
2. 进入「域名解析」→「我的域名」
3. 点击「添加记录」
4. 填写记录信息

**Cloudflare DNS 配置**
1. 登录 Cloudflare 控制台
2. 选择域名
3. 进入「DNS」设置
4. 添加记录

### 4. 域名备案流程（国内服务器）

#### 4.1 备案前提条件

**必须条件**
- 使用国内服务器（大陆）
- 拥有域名
- 域名实名认证已完成
- 提供个人身份证或企业营业执照

**备案类型**
- **个人备案**：个人网站
- **企业备案**：企业网站
- **经营性备案**：经营性网站（需要 ICP 许可证）

#### 4.2 备案流程

**步骤 1：准备材料**
- 个人备案：身份证正反面
- 企业备案：营业执照、法人身份证
- 备案主体信息表
- 网站备案信息表

**步骤 2：选择服务商**
- 阿里云、腾讯云、华为云等
- 在服务商处提交备案申请

**步骤 3：提交备案信息**
- 填写主体信息（姓名、身份证号等）
- 填写网站信息（网站名称、网站内容等）
- 上传证件照片

**步骤 4：服务商审核**
- 初审：1-2 个工作日
- 审核通过后，提交管局审核

**步骤 5：管局审核**
- 时间：7-20 个工作日
- 可能需要电话核验

**步骤 6：备案完成**
- 获得备案号
- 在网站底部放置备案号
- 格式：`京ICP备12345678号`

#### 4.3 备案注意事项

- 备案期间网站不能访问（需要关闭）
- 备案信息必须真实有效
- 网站内容必须合法合规
- 备案号需要放置在网站底部
- 备案信息变更需要重新备案

### 5. 域名解析检查工具

#### 5.1 dig 命令

**dig 简介**
- DNS 查询工具，功能强大
- 显示详细的 DNS 查询过程
- Linux/macOS 自带

**基本用法**

```bash
# 查询 A 记录
dig example.com

# 查询指定记录类型
dig example.com A
dig example.com AAAA
dig example.com CNAME
dig example.com MX
dig example.com TXT

# 指定 DNS 服务器查询
dig @8.8.8.8 example.com
dig @223.5.5.5 example.com  # 阿里云 DNS

# 只显示结果（简洁输出）
dig +short example.com

# 反向 DNS 查询
dig -x 192.168.1.1

# 查询 DNS 解析路径
dig +trace example.com
```

**输出解析**

```bash
# 典型输出示例
; <<>> DiG 9.10.6 <<>> example.com
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; QUESTION SECTION:
;example.com.                  IN      A

;; ANSWER SECTION:
example.com.           600     IN      A       192.168.1.100

;; Query time: 45 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Mon Jan 01 12:00:00 CST 2024
;; MSG SIZE  rcvd: 56
```

#### 5.2 nslookup 命令

**nslookup 简介**
- 交互式 DNS 查询工具
- Windows/Linux/macOS 都支持
- 使用简单，适合快速查询

**基本用法**

```bash
# 查询 A 记录
nslookup example.com

# 查询指定记录类型
nslookup -type=A example.com
nslookup -type=CNAME www.example.com
nslookup -type=MX example.com
nslookup -type=TXT example.com

# 指定 DNS 服务器
nslookup example.com 8.8.8.8

# 交互模式
nslookup
> example.com
> set type=A
> example.com
> exit
```

**输出示例**

```
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	example.com
Address: 192.168.1.100
```

#### 5.3 host 命令

**host 命令简介**
- 简单的 DNS 查询工具
- 输出简洁

**基本用法**

```bash
# 查询域名
host example.com

# 查询指定记录类型
host -t A example.com
host -t CNAME www.example.com
host -t MX example.com

# 反向 DNS 查询
host 192.168.1.1

# 指定 DNS 服务器
host example.com 8.8.8.8
```

#### 5.4 在线 DNS 查询工具

**推荐工具**
- **https://dnschecker.org/**：全球 DNS 检查
- **https://www.whatsmydns.net/**：DNS 传播检查
- **https://tool.chinaz.com/dns/**：站长工具 DNS 查询
- **https://www.dnspod.cn/**：DNSPod DNS 查询

### 6. SSL 证书自动续期配置

#### 6.1 acme.sh 自动续期

**acme.sh 默认配置**
- 安装后自动创建 cron 任务
- 默认每天检查证书有效期
- 证书到期前 30 天自动续期

**查看 cron 任务**

```bash
crontab -l | grep acme.sh

# 典型输出
0 0 * * * "/root/.acme.sh"/acme.sh --cron --home "/root/.acme.sh" > /dev/null
```

**手动续期**

```bash
# 续期所有证书
~/.acme.sh/acme.sh --renew-all

# 续期指定证书
~/.acme.sh/acme.sh --renew -d example.com

# 强制续期（即使未到期）
~/.acme.sh/acme.sh --renew -d example.com --force
```

**配置续期后自动重启服务**

```bash
# 安装证书时指定 reloadcmd
~/.acme.sh/acme.sh --install-cert \
  -d example.com \
  --key-file /etc/nginx/ssl/example.com.key \
  --fullchain-file /etc/nginx/ssl/example.com.crt \
  --reloadcmd "systemctl reload nginx"

# 修改已有证书的 reloadcmd
~/.acme.sh/acme.sh --install-cert \
  -d example.com \
  --reloadcmd "systemctl reload nginx"
```

#### 6.2 certbot 自动续期

**certbot 续期机制**
- 使用 systemd timer 定时任务
- 默认每天检查两次
- 证书到期前 30 天自动续期

**查看续期任务**

```bash
# 查看 timer 状态
sudo systemctl status certbot.timer

# 查看下次执行时间
sudo systemctl list-timers certbot.timer

# 手动测试续期
sudo certbot renew --dry-run

# 手动续期
sudo certbot renew
```

**配置续期后自动重启服务**

编辑 `/etc/letsencrypt/renewal/example.com.conf`：

```ini
[renewalparams]
reload_cmd = systemctl reload nginx
```

或在 Nginx 配置中使用 certbot 插件自动配置。

## 实战任务

### 任务 1: 在服务器上搭建 Node.js 环境

**任务目标**
- 使用 nvm 安装 Node.js LTS 版本
- 配置 npm 镜像源（如需要）
- 验证安装成功

**操作步骤**

1. **SSH 连接到服务器**
   ```bash
   ssh username@your-server-ip
   ```

2. **安装 nvm**
   ```bash
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   source ~/.bashrc
   ```

3. **安装 Node.js LTS 版本**
   ```bash
   nvm install --lts
   nvm use --lts
   nvm alias default node
   ```

4. **验证安装**
   ```bash
   node --version
   npm --version
   ```

5. **（可选）配置 npm 镜像源**
   ```bash
   npm config set registry https://registry.npmmirror.com
   npm config get registry
   ```

**验收标准**
- [ ] nvm 安装成功，可以查看版本
- [ ] Node.js LTS 版本安装成功
- [ ] npm 可以正常使用
- [ ] 可以安装 npm 包（测试：`npm install -g pm2`）

### 任务 2: 申请并配置 SSL 证书

**任务目标**
- 使用 acme.sh 或 certbot 申请 Let's Encrypt 证书
- 配置 Nginx 使用 SSL 证书
- 配置 HTTP 到 HTTPS 重定向

**操作步骤**

**方案 A：使用 acme.sh**

1. **安装 acme.sh**
   ```bash
   curl https://get.acme.sh | sh
   source ~/.bashrc
   ```

2. **申请证书（HTTP 验证）**
   ```bash
   # 确保 Nginx 已配置并运行，网站可通过 HTTP 访问
   ~/.acme.sh/acme.sh --issue -d example.com -d www.example.com --webroot /var/www/html
   ```

3. **安装证书到 Nginx**
   ```bash
   # 创建 SSL 目录
   sudo mkdir -p /etc/nginx/ssl
   
   # 安装证书
   ~/.acme.sh/acme.sh --install-cert \
     -d example.com \
     --key-file /etc/nginx/ssl/example.com.key \
     --fullchain-file /etc/nginx/ssl/example.com.crt \
     --reloadcmd "sudo systemctl reload nginx"
   ```

**方案 B：使用 certbot**

1. **安装 certbot**
   ```bash
   sudo apt update
   sudo apt install certbot python3-certbot-nginx
   ```

2. **申请证书并自动配置 Nginx**
   ```bash
   sudo certbot --nginx -d example.com -d www.example.com
   ```

3. **验证证书**
   ```bash
   sudo certbot certificates
   ```

4. **配置 Nginx SSL（如果 certbot 未自动配置）**

编辑 `/etc/nginx/sites-available/example.com`：

```nginx
server {
    listen 443 ssl http2;
    server_name example.com www.example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$server_name$request_uri;
}
```

5. **测试并重载 Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

**验收标准**
- [ ] SSL 证书申请成功
- [ ] 证书文件存在于指定位置
- [ ] Nginx 配置正确，可以通过 HTTPS 访问
- [ ] HTTP 自动重定向到 HTTPS
- [ ] 浏览器显示绿色锁图标（证书有效）
- [ ] SSL Labs 测试评分 A 或 A+（可选）

### 任务 3: 配置域名解析

**任务目标**
- 配置域名 A 记录指向服务器 IP
- 配置 www 子域名（A 记录或 CNAME）
- 验证域名解析生效

**操作步骤**

1. **获取服务器公网 IP**
   ```bash
   # 方法一：使用 curl
   curl ifconfig.me
   
   # 方法二：使用 wget
   wget -qO- ifconfig.me
   
   # 方法三：查看服务器网络配置
   ip addr show
   ```

2. **在域名服务商配置 DNS 记录**

   **阿里云 DNS 配置示例**：
   - 登录阿里云控制台
   - 进入「域名」→「解析」
   - 添加记录：
     - 记录类型：A
     - 主机记录：@（代表根域名）
     - 记录值：服务器 IP（如：192.168.1.100）
     - TTL：600
   - 添加记录：
     - 记录类型：A（或 CNAME）
     - 主机记录：www
     - 记录值：服务器 IP（或 example.com）
     - TTL：600

3. **等待 DNS  propagation（DNS 传播）**
   - DNS 记录生效通常需要 5 分钟到 48 小时
   - 通常 10-30 分钟内生效

4. **验证域名解析**

   **使用 dig 命令**：
   ```bash
   dig example.com
   dig www.example.com
   ```

   **使用 nslookup**：
   ```bash
   nslookup example.com
   nslookup www.example.com
   ```

   **使用 host 命令**：
   ```bash
   host example.com
   host www.example.com
   ```

5. **检查全球 DNS 解析（可选）**
   - 访问 https://dnschecker.org/
   - 输入域名，查看全球 DNS 解析情况

**验收标准**
- [ ] DNS 记录配置正确
- [ ] 使用 dig/nslookup 可以解析到正确的 IP
- [ ] 域名可以正常访问（HTTP）
- [ ] www 子域名可以正常访问
- [ ] DNS 传播检查显示全球解析正确

### 任务 4: 验证 HTTPS 配置和证书有效性

**任务目标**
- 验证 HTTPS 访问正常
- 检查证书信息
- 测试证书自动续期

**操作步骤**

1. **浏览器测试**
   - 访问 `https://example.com`
   - 检查浏览器地址栏是否显示绿色锁图标
   - 点击锁图标，查看证书详情
   - 验证证书有效期、颁发机构等信息

2. **命令行测试**

   **使用 curl**：
   ```bash
   # 测试 HTTPS 连接
   curl -I https://example.com
   
   # 查看证书信息
   curl -v https://example.com 2>&1 | grep -A 5 "SSL certificate"
   
   # 检查证书有效期
   echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
   ```

   **使用 openssl**：
   ```bash
   # 查看证书详细信息
   openssl s_client -connect example.com:443 -servername example.com < /dev/null
   
   # 查看证书有效期
   echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
   
   # 查看证书颁发者
   echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -issuer
   ```

3. **在线工具测试**
   - **SSL Labs**: https://www.ssllabs.com/ssltest/
     - 输入域名，查看 SSL 测试报告
     - 检查评分（A 或 A+ 为优秀）
   - **Why No Padlock**: https://www.whynopadlock.com/
     - 检查 HTTPS 配置问题

4. **测试自动续期**

   **acme.sh**：
   ```bash
   # 查看证书列表
   ~/.acme.sh/acme.sh --list
   
   # 手动测试续期（dry-run）
   ~/.acme.sh/acme.sh --renew -d example.com --force
   
   # 检查 cron 任务
   crontab -l | grep acme.sh
   ```

   **certbot**：
   ```bash
   # 测试续期（dry-run）
   sudo certbot renew --dry-run
   
   # 查看续期任务状态
   sudo systemctl status certbot.timer
   ```

**验收标准**
- [ ] 浏览器可以正常访问 HTTPS
- [ ] 证书显示有效（绿色锁图标）
- [ ] 证书有效期正常（未过期）
- [ ] SSL Labs 测试评分 A 或 A+
- [ ] 自动续期配置正确（cron/timer 任务存在）
- [ ] 续期测试通过（dry-run 成功）

### 任务 5: 完整流程实践 - 部署个人项目到域名

**任务目标**
- 整合所有步骤，完成从域名解析到 HTTPS 配置的完整流程
- 实现个人项目通过域名 HTTPS 访问

**操作步骤**

1. **准备工作**
   - [ ] 拥有域名（已实名认证）
   - [ ] 拥有服务器（已安装 Linux）
   - [ ] 服务器已安装 Nginx
   - [ ] 准备好前端项目构建产物

2. **步骤 1：配置域名解析**
   ```bash
   # 获取服务器 IP
   curl ifconfig.me
   
   # 在域名服务商配置 A 记录
   # @ -> 服务器 IP
   # www -> 服务器 IP（或 CNAME 到根域名）
   ```

3. **步骤 2：等待 DNS 生效**
   ```bash
   # 检查 DNS 解析
   dig example.com
   nslookup example.com
   
   # 确认解析到正确的 IP
   ```

4. **步骤 3：部署项目文件**
   ```bash
   # 创建网站目录
   sudo mkdir -p /var/www/example.com
   
   # 上传项目文件（使用 scp、rsync 或 git）
   # 示例：scp -r dist/* user@server:/var/www/example.com/
   
   # 设置权限
   sudo chown -R www-data:www-data /var/www/example.com
   sudo chmod -R 755 /var/www/example.com
   ```

5. **步骤 4：配置 Nginx（HTTP）**
   ```bash
   # 创建 Nginx 配置文件
   sudo nano /etc/nginx/sites-available/example.com
   ```

   配置内容：
   ```nginx
   server {
       listen 80;
       server_name example.com www.example.com;
       
       root /var/www/example.com;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

   ```bash
   # 创建软链接
   sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
   
   # 测试配置
   sudo nginx -t
   
   # 重载 Nginx
   sudo systemctl reload nginx
   ```

6. **步骤 5：验证 HTTP 访问**
   ```bash
   # 浏览器访问 http://example.com
   # 确认网站可以正常访问
   ```

7. **步骤 6：申请 SSL 证书**
   ```bash
   # 使用 acme.sh
   ~/.acme.sh/acme.sh --issue -d example.com -d www.example.com --webroot /var/www/example.com
   
   # 或使用 certbot
   sudo certbot --nginx -d example.com -d www.example.com
   ```

8. **步骤 7：配置 HTTPS**
   ```bash
   # 如果使用 acme.sh，需要手动配置 Nginx
   # 如果使用 certbot，可能已自动配置
   
   # 检查 Nginx 配置
   sudo nginx -t
   
   # 重载 Nginx
   sudo systemctl reload nginx
   ```

9. **步骤 8：验证 HTTPS**
   ```bash
   # 浏览器访问 https://example.com
   # 检查证书有效性
   # SSL Labs 测试
   ```

10. **步骤 9：验证自动续期**
    ```bash
    # acme.sh
    crontab -l | grep acme.sh
    
    # certbot
    sudo systemctl status certbot.timer
    ```

**验收标准**
- [ ] 域名解析正确，可以 ping 通
- [ ] HTTP 访问正常
- [ ] HTTPS 访问正常，证书有效
- [ ] HTTP 自动重定向到 HTTPS
- [ ] 网站功能正常
- [ ] SSL 证书自动续期配置正确
- [ ] SSL Labs 测试评分 A 或 A+

## 常见问题排查

### 问题 1: nvm 安装后命令找不到

**症状**：安装 nvm 后，执行 `nvm` 命令提示 `command not found`

**解决方案**：
```bash
# 1. 检查安装脚本是否执行了环境变量配置
cat ~/.bashrc | grep nvm
cat ~/.zshrc | grep nvm

# 2. 手动添加环境变量（如果缺失）
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.bashrc
echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"' >> ~/.bashrc

# 3. 重新加载配置
source ~/.bashrc
# 或
source ~/.zshrc
```

### 问题 2: SSL 证书申请失败

**症状**：acme.sh 或 certbot 申请证书时失败

**可能原因和解决方案**：

1. **域名解析未生效**
   ```bash
   # 检查域名解析
   dig example.com
   # 确认解析到正确的 IP
   ```

2. **80 端口被占用或未开放**
   ```bash
   # 检查端口占用
   sudo netstat -tlnp | grep :80
   # 或
   sudo lsof -i :80
   
   # 检查防火墙
   sudo ufw status
   sudo ufw allow 80/tcp
   ```

3. **Nginx 未正确配置**
   ```bash
   # 确保 Nginx 配置了正确的 server_name
   # 确保网站可以通过 HTTP 访问
   ```

4. **Let's Encrypt 请求频率限制**
   - Let's Encrypt 对每个域名每周有申请次数限制
   - 等待一段时间后重试

### 问题 3: DNS 解析不生效

**症状**：配置 DNS 记录后，域名无法解析或解析到错误的 IP

**解决方案**：

1. **检查 DNS 记录配置**
   - 确认记录类型正确（A/CNAME）
   - 确认记录值正确（IP 地址或域名）
   - 确认主机记录正确（@ 代表根域名）

2. **清除本地 DNS 缓存**
   ```bash
   # Linux
   sudo systemd-resolve --flush-caches
   # 或
   sudo service systemd-resolved restart
   
   # macOS
   sudo dscacheutil -flushcache
   sudo killall -HUP mDNSResponder
   ```

3. **使用不同 DNS 服务器查询**
   ```bash
   # 使用 Google DNS
   dig @8.8.8.8 example.com
   
   # 使用 Cloudflare DNS
   dig @1.1.1.1 example.com
   
   # 使用阿里云 DNS
   dig @223.5.5.5 example.com
   ```

4. **检查 DNS 传播**
   - 使用 https://dnschecker.org/ 检查全球 DNS 解析情况
   - DNS 传播可能需要时间（通常 10-30 分钟）

### 问题 4: HTTPS 访问显示不安全

**症状**：配置 HTTPS 后，浏览器显示"不安全"或证书错误

**可能原因和解决方案**：

1. **证书配置错误**
   ```bash
   # 检查证书文件路径
   sudo ls -la /etc/nginx/ssl/
   # 或
   sudo ls -la /etc/letsencrypt/live/example.com/
   
   # 检查 Nginx 配置中的证书路径
   sudo nginx -t
   ```

2. **证书链不完整**
   ```bash
   # 使用 fullchain.pem（包含证书链）
   # 而不是 cert.pem（只有证书）
   ```

3. **域名不匹配**
   - 证书申请的域名必须与访问的域名完全一致
   - 检查证书包含的域名：`openssl x509 -in cert.crt -text -noout | grep DNS`

4. **证书过期**
   ```bash
   # 检查证书有效期
   echo | openssl s_client -servername example.com -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
   ```

### 问题 5: 自动续期不工作

**症状**：证书到期前未自动续期

**解决方案**：

1. **检查 acme.sh cron 任务**
   ```bash
   crontab -l | grep acme.sh
   # 如果没有，手动添加
   ```

2. **检查 certbot timer**
   ```bash
   sudo systemctl status certbot.timer
   sudo systemctl enable certbot.timer
   sudo systemctl start certbot.timer
   ```

3. **手动测试续期**
   ```bash
   # acme.sh
   ~/.acme.sh/acme.sh --renew -d example.com --force
   
   # certbot
   sudo certbot renew --dry-run
   ```

4. **检查日志**
   ```bash
   # acme.sh 日志
   tail -f ~/.acme.sh/acme.sh.log
   
   # certbot 日志
   sudo journalctl -u certbot.timer
   ```

## 学习检查清单

完成本日学习后，请检查以下内容：

- [ ] 理解 nvm 的作用和常用命令
- [ ] 成功安装 Node.js LTS 版本
- [ ] 理解 SSL/TLS 证书的基本原理
- [ ] 掌握使用 acme.sh 或 certbot 申请证书
- [ ] 理解 DNS 记录类型（A、CNAME、MX 等）
- [ ] 成功配置域名解析
- [ ] 掌握使用 dig、nslookup 检查 DNS 解析
- [ ] 理解域名备案流程（国内服务器）
- [ ] 成功配置 Nginx SSL
- [ ] 配置证书自动续期
- [ ] 完成个人项目部署到域名的完整流程
- [ ] 解决至少 2 个实际问题
- [ ] 记录学习笔记和遇到的问题

## 扩展学习（可选）

### 1. 使用 DNS API 申请通配符证书

**适用场景**：需要支持多个子域名（*.example.com）

**操作步骤**（以阿里云 DNS API 为例）：

1. **获取阿里云 AccessKey**
   - 登录阿里云控制台
   - 创建 AccessKey（注意保密）

2. **设置环境变量**
   ```bash
   export Ali_Key="your_access_key"
   export Ali_Secret="your_access_secret"
   ```

3. **申请通配符证书**
   ```bash
   ~/.acme.sh/acme.sh --issue --dns dns_ali -d example.com -d "*.example.com"
   ```

4. **安装证书**
   ```bash
   ~/.acme.sh/acme.sh --install-cert \
     -d example.com \
     --key-file /etc/nginx/ssl/example.com.key \
     --fullchain-file /etc/nginx/ssl/example.com.crt \
     --reloadcmd "sudo systemctl reload nginx"
   ```

### 2. 配置多域名 SSL 证书

**适用场景**：一个证书包含多个域名

```bash
# acme.sh
~/.acme.sh/acme.sh --issue -d example.com -d www.example.com -d api.example.com --webroot /var/www/html

# certbot
sudo certbot --nginx -d example.com -d www.example.com -d api.example.com
```

### 3. 使用 Cloudflare SSL

**适用场景**：使用 Cloudflare CDN

- Cloudflare 提供免费 SSL 证书
- 配置简单，自动续期
- 支持通配符证书（付费版）

## 学习资源

### 官方文档

- **nvm**: https://github.com/nvm-sh/nvm
- **Node.js**: https://nodejs.org/
- **Let's Encrypt**: https://letsencrypt.org/
- **acme.sh**: https://github.com/acmesh-official/acme.sh
- **certbot**: https://certbot.eff.org/
- **Nginx SSL**: https://nginx.org/en/docs/http/configuring_https_servers.html

### 参考文章

- SSL/TLS 工作原理：https://www.cloudflare.com/learning/ssl/what-is-ssl/
- DNS 工作原理：https://www.cloudflare.com/learning/dns/what-is-dns/
- SSL Labs 测试工具：https://www.ssllabs.com/ssltest/

### 工具推荐

- **SSL Labs**: https://www.ssllabs.com/ssltest/ - SSL 配置测试
- **DNS Checker**: https://dnschecker.org/ - DNS 传播检查
- **What's My DNS**: https://www.whatsmydns.net/ - DNS 查询工具

## 总结

Day 6 的学习重点是完成个人应用部署到域名的完整流程，包括：

1. **Node.js 环境搭建**：使用 nvm 管理多版本
2. **SSL 证书配置**：申请和配置 Let's Encrypt 免费证书
3. **域名解析**：配置 DNS 记录，实现域名访问
4. **HTTPS 配置**：配置 Nginx SSL，实现安全访问
5. **自动续期**：配置证书自动续期，确保服务持续可用

完成本日学习后，你应该能够独立完成从域名购买到 HTTPS 配置的完整流程，实现个人项目通过自定义域名安全访问。
