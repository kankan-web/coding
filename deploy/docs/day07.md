# Day 7: 项目部署实战和方案对比 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 掌握多种项目上传和部署方式（Git、FTP、SCP、rsync）
- 理解环境变量配置和隔离策略，能够管理多环境配置
- 掌握多环境部署策略（开发、测试、生产）
- 深入理解常见部署方案的优缺点和适用场景
- 具备部署方案对比分析和选型能力
- **核心目标**：能够独立部署个人应用，并具备分析公司部署方案的能力

## 学习时间分配

- **理论学习**: 2-2.5 小时
- **实践操作**: 3-4 小时
- **方案对比分析**: 1-1.5 小时
- **总结和文档**: 30 分钟

## 核心知识点

### 1. 项目上传和部署流程

#### 1.1 Git 部署方式

**Git 部署的优势**
- 版本控制，可以回滚到任意版本
- 自动化部署流程，与 CI/CD 集成
- 代码更新追踪，便于审计
- 支持分支部署，适合多环境

**Git 部署流程**

```bash
# 1. 在服务器上克隆仓库
cd /var/www
git clone https://github.com/username/project.git
cd project

# 2. 切换到生产分支
git checkout production

# 3. 安装依赖
npm install --production

# 4. 构建项目
npm run build

# 5. 部署到 Nginx 目录
cp -r dist/* /usr/share/nginx/html/

# 6. 后续更新（拉取最新代码）
git pull origin production
npm install --production
npm run build
cp -r dist/* /usr/share/nginx/html/
```

**Git 部署脚本示例**

```bash
#!/bin/bash
# deploy.sh - Git 部署脚本

set -e  # 遇到错误立即退出

PROJECT_DIR="/var/www/my-project"
DEPLOY_DIR="/usr/share/nginx/html"
BRANCH="production"

echo "开始部署..."

cd $PROJECT_DIR

# 拉取最新代码
echo "拉取最新代码..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

# 安装依赖
echo "安装依赖..."
npm install --production

# 构建项目
echo "构建项目..."
npm run build

# 备份旧版本
echo "备份旧版本..."
if [ -d "$DEPLOY_DIR" ]; then
    BACKUP_DIR="/var/backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p $BACKUP_DIR
    cp -r $DEPLOY_DIR/* $BACKUP_DIR/
fi

# 部署新版本
echo "部署新版本..."
cp -r dist/* $DEPLOY_DIR/

# 重启服务（如果需要）
# systemctl reload nginx

echo "部署完成！"
```

**使用 Git Hooks 自动部署**

```bash
# 在服务器上创建 Git 仓库（bare repository）
cd /var/repo
git clone --bare https://github.com/username/project.git my-project.git

# 创建部署 Hook
cd my-project.git/hooks
cat > post-receive << 'EOF'
#!/bin/bash
TARGET="/var/www/my-project"
GIT_DIR="/var/repo/my-project.git"
BRANCH="production"

while read oldrev newrev refname
do
    if [[ $refname = "refs/heads/$BRANCH" ]]; then
        echo "部署分支 $BRANCH"
        git --git-dir="$GIT_DIR" --work-tree="$TARGET" checkout -f $BRANCH
        cd $TARGET
        npm install --production
        npm run build
        cp -r dist/* /usr/share/nginx/html/
    fi
done
EOF

chmod +x post-receive
```

#### 1.2 FTP/SFTP 部署方式

**FTP/SFTP 部署场景**
- 简单的静态网站部署
- 无法使用 Git 的场景
- 手动上传文件

**使用 SFTP 上传文件**

```bash
# 使用 sftp 命令
sftp username@server.com
# 连接后执行命令
put -r local_folder /remote/path
```

**使用 FileZilla 等 GUI 工具**
- 图形界面，操作简单
- 支持断点续传
- 适合偶尔手动部署

**使用 lftp 批量上传**

```bash
# 安装 lftp
# macOS: brew install lftp
# Linux: yum install lftp 或 apt install lftp

# 批量上传脚本
lftp -u username,password sftp://server.com << EOF
cd /var/www/html
mirror -R -n local_folder remote_folder
quit
EOF
```

#### 1.3 SCP 部署方式

**SCP（Secure Copy）简介**
- 基于 SSH 的安全文件传输
- 命令行工具，适合脚本自动化
- 简单直接，适合小型项目

**SCP 基本用法**

```bash
# 上传单个文件
scp local_file.txt username@server.com:/remote/path/

# 上传目录
scp -r local_folder username@server.com:/remote/path/

# 指定端口
scp -P 2222 local_file.txt username@server.com:/remote/path/

# 使用 SSH 密钥
scp -i ~/.ssh/id_rsa local_file.txt username@server.com:/remote/path/
```

**SCP 部署脚本示例**

```bash
#!/bin/bash
# scp-deploy.sh

SERVER="username@server.com"
REMOTE_PATH="/var/www/html"
LOCAL_BUILD="dist"

echo "构建项目..."
npm run build

echo "上传文件到服务器..."
scp -r $LOCAL_BUILD/* $SERVER:$REMOTE_PATH/

echo "部署完成！"
```

#### 1.4 rsync 部署方式

**rsync 的优势**
- **增量同步**：只传输变化的部分，速度快
- **断点续传**：支持中断后继续传输
- **压缩传输**：自动压缩，节省带宽
- **保持权限**：可以保持文件权限和属性

**rsync 基本用法**

```bash
# 基本语法
rsync [选项] 源目录 目标目录

# 常用选项
rsync -avz --delete local_folder/ username@server.com:/remote/path/
# -a: 归档模式（保留权限、时间戳等）
# -v: 显示详细过程
# -z: 压缩传输
# --delete: 删除目标中源不存在的文件
```

**rsync 部署脚本示例**

```bash
#!/bin/bash
# rsync-deploy.sh

SERVER="username@server.com"
REMOTE_PATH="/var/www/html"
LOCAL_BUILD="dist"
EXCLUDE_FILE=".rsyncignore"

# 构建项目
echo "构建项目..."
npm run build

# 同步文件
echo "同步文件到服务器..."
rsync -avz --delete \
  --exclude-from=$EXCLUDE_FILE \
  $LOCAL_BUILD/ \
  $SERVER:$REMOTE_PATH/

echo "部署完成！"
```

**rsync 排除文件配置**

```bash
# .rsyncignore 文件内容
node_modules/
.git/
.env.local
*.log
.DS_Store
```

**rsync 与 SSH 密钥配置**

```bash
# 生成 SSH 密钥对（如果还没有）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 复制公钥到服务器
ssh-copy-id username@server.com

# 配置 SSH config（可选，简化连接）
# ~/.ssh/config
Host myserver
    HostName server.com
    User username
    IdentityFile ~/.ssh/id_rsa
    Port 22

# 使用别名
rsync -avz local_folder/ myserver:/remote/path/
```

**rsync 高级用法**

```bash
# 显示将要同步的文件（不实际同步）
rsync -avz --dry-run local_folder/ server:/remote/path/

# 排除特定文件/目录
rsync -avz --exclude 'node_modules' --exclude '.git' \
  local_folder/ server:/remote/path/

# 只同步特定文件类型
rsync -avz --include '*.js' --include '*.css' --exclude '*' \
  local_folder/ server:/remote/path/

# 限速传输（避免影响其他服务）
rsync -avz --bwlimit=1000 local_folder/ server:/remote/path/
```

### 2. 环境变量配置和隔离

#### 2.1 环境变量的重要性

**为什么需要环境变量？**
- **安全性**：敏感信息（API 密钥、数据库密码）不写入代码
- **灵活性**：不同环境使用不同配置，无需修改代码
- **可维护性**：配置集中管理，便于维护
- **符合最佳实践**：遵循 12-Factor App 原则

#### 2.2 .env 文件管理

**项目结构示例**

```
project/
├── .env.development    # 开发环境配置
├── .env.staging        # 测试环境配置
├── .env.production     # 生产环境配置
├── .env.local          # 本地覆盖配置（不提交到 Git）
├── .gitignore          # 忽略 .env 文件
└── src/
```

**.env 文件示例**

```bash
# .env.development
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=My App (Dev)
VITE_DEBUG=true

# .env.production
NODE_ENV=production
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=My App
VITE_DEBUG=false
```

**.gitignore 配置**

```gitignore
# 环境变量文件
.env
.env.local
.env.*.local

# 但保留模板文件
!.env.example
```

**创建 .env.example 模板**

```bash
# .env.example
NODE_ENV=development
VITE_API_BASE_URL=
VITE_APP_TITLE=
VITE_DEBUG=
```

#### 2.3 Vite 环境变量配置

**Vite 环境变量规则**
- 必须以 `VITE_` 前缀开头才能在客户端访问
- 访问方式：`import.meta.env.VITE_API_BASE_URL`
- 支持 `.env`、`.env.local`、`.env.[mode]`、`.env.[mode].local`

**Vite 配置示例**

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [vue()],
    // 使用环境变量
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    server: {
      port: parseInt(env.VITE_PORT || '3000'),
    },
  }
})
```

**在代码中使用环境变量**

```typescript
// src/config/env.ts
interface EnvConfig {
  apiBaseUrl: string
  appTitle: string
  debug: boolean
}

export const env: EnvConfig = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  appTitle: import.meta.env.VITE_APP_TITLE || 'My App',
  debug: import.meta.env.VITE_DEBUG === 'true',
}

// 类型提示
declare module 'vite/client' {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string
    readonly VITE_APP_TITLE: string
    readonly VITE_DEBUG: string
  }
}
```

#### 2.4 环境隔离策略

**构建时注入环境变量**

```bash
# package.json
{
  "scripts": {
    "build:dev": "vite build --mode development",
    "build:staging": "vite build --mode staging",
    "build:prod": "vite build --mode production"
  }
}
```

**运行时环境变量（Nginx 配置）**

```nginx
# 通过 Nginx 配置传递环境变量
server {
    listen 80;
    server_name example.com;
    
    location / {
        root /var/www/html;
        index index.html;
        
        # 设置环境变量（通过响应头）
        add_header X-Environment $env;
        
        # 或者在 HTML 中注入
        sub_filter '{{API_BASE_URL}}' 'https://api.example.com';
        sub_filter_once on;
    }
}
```

**服务器环境变量管理**

```bash
# 在服务器上创建环境变量文件
# /etc/environment（系统级）
# 或 ~/.bashrc（用户级）

# 示例：~/.bashrc
export NODE_ENV=production
export API_BASE_URL=https://api.example.com

# 重新加载
source ~/.bashrc
```

**使用 PM2 管理环境变量**

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'my-app',
    script: './server.js',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80
    }
  }]
}
```

```bash
# 启动时指定环境
pm2 start ecosystem.config.js --env production
```

### 3. 多环境部署策略

#### 3.1 环境分类

**开发环境（Development）**
- 本地开发环境
- 使用开发服务器（Vite Dev Server）
- 启用调试工具和热更新
- 使用 Mock 数据或开发 API

**测试环境（Staging/Testing）**
- 预发布环境，模拟生产环境
- 使用生产构建配置
- 测试新功能和修复
- 使用测试数据库和 API

**生产环境（Production）**
- 正式对外服务环境
- 使用生产构建配置
- 启用所有优化（压缩、缓存等）
- 使用生产数据库和 API

#### 3.2 多环境配置管理

**目录结构**

```
project/
├── config/
│   ├── development.js
│   ├── staging.js
│   └── production.js
├── .env.development
├── .env.staging
└── .env.production
```

**配置文件示例**

```javascript
// config/development.js
export default {
  apiBaseUrl: 'http://localhost:3000/api',
  enableDebug: true,
  logLevel: 'debug',
  features: {
    analytics: false,
    errorTracking: false,
  }
}

// config/production.js
export default {
  apiBaseUrl: 'https://api.example.com',
  enableDebug: false,
  logLevel: 'error',
  features: {
    analytics: true,
    errorTracking: true,
  }
}
```

**配置文件加载**

```javascript
// src/config/index.js
const env = import.meta.env.MODE || 'development'

const configs = {
  development: () => import('./config/development.js'),
  staging: () => import('./config/staging.js'),
  production: () => import('./config/production.js'),
}

export const config = configs[env]?.() || configs.development()
```

#### 3.3 多环境部署流程

**Git 分支策略**

```
main/master          # 生产环境分支
├── staging          # 测试环境分支
└── develop          # 开发环境分支
```

**部署脚本示例**

```bash
#!/bin/bash
# deploy.sh - 多环境部署脚本

ENV=$1  # 环境参数：dev, staging, prod

if [ -z "$ENV" ]; then
    echo "用法: ./deploy.sh [dev|staging|prod]"
    exit 1
fi

case $ENV in
    dev)
        BRANCH="develop"
        REMOTE_PATH="/var/www/dev"
        BUILD_MODE="development"
        ;;
    staging)
        BRANCH="staging"
        REMOTE_PATH="/var/www/staging"
        BUILD_MODE="staging"
        ;;
    prod)
        BRANCH="main"
        REMOTE_PATH="/var/www/production"
        BUILD_MODE="production"
        ;;
    *)
        echo "未知环境: $ENV"
        exit 1
        ;;
esac

echo "部署到 $ENV 环境..."

# 切换到对应分支
git checkout $BRANCH
git pull origin $BRANCH

# 安装依赖
npm install

# 构建（使用对应环境配置）
npm run build -- --mode $BUILD_MODE

# 部署
rsync -avz --delete dist/ server:$REMOTE_PATH/

echo "部署完成！"
```

#### 3.4 域名和路径配置

**多环境域名配置**

```
开发环境: dev.example.com
测试环境: staging.example.com
生产环境: www.example.com
```

**Nginx 多站点配置**

```nginx
# 开发环境
server {
    listen 80;
    server_name dev.example.com;
    root /var/www/dev;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 测试环境
server {
    listen 80;
    server_name staging.example.com;
    root /var/www/staging;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}

# 生产环境
server {
    listen 80;
    server_name www.example.com;
    root /var/www/production;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 4. 常见部署方案对比分析

#### 4.1 传统服务器部署（Nginx + 静态文件）

**架构图**
```
用户请求 → Nginx → 静态文件服务器 → 返回 HTML/CSS/JS
```

**部署流程**
1. 在服务器上安装 Nginx
2. 构建前端项目（npm run build）
3. 将构建产物上传到服务器
4. 配置 Nginx 指向静态文件目录
5. 配置域名和 SSL 证书

**优点**
- ✅ **完全控制**：对服务器和配置有完全控制权
- ✅ **成本可控**：一次购买，长期使用
- ✅ **学习价值高**：深入理解服务器和网络原理
- ✅ **灵活性强**：可以自定义任何配置
- ✅ **数据安全**：数据完全掌握在自己手中

**缺点**
- ❌ **运维成本高**：需要自己维护服务器、安全更新
- ❌ **扩展性差**：流量突增需要手动扩容
- ❌ **单点故障**：服务器故障影响服务可用性
- ❌ **技术门槛**：需要掌握 Linux、Nginx 等技能
- ❌ **部署流程长**：需要手动构建、上传、配置

**适用场景**
- 个人项目或小型项目
- 需要完全控制权的场景
- 学习和技术研究
- 预算有限的项目

**成本分析**
- 服务器成本：$5-50/月（根据配置）
- 域名成本：$10-20/年
- SSL 证书：免费（Let's Encrypt）
- **总计**：约 $70-620/年

#### 4.2 Serverless 部署（Vercel、Netlify）

**架构图**
```
用户请求 → CDN边缘节点 → Serverless函数（如需要） → 返回响应
```

**部署流程**
1. 将代码推送到 Git 仓库（GitHub、GitLab）
2. 在 Vercel/Netlify 连接仓库
3. 自动构建和部署
4. 自动配置 CDN 和 SSL

**Vercel 部署示例**

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

**Netlify 部署示例**

```bash
# 安装 Netlify CLI
npm i -g netlify-cli

# 登录
netlify login

# 初始化
netlify init

# 部署
netlify deploy --prod
```

**优点**
- ✅ **零配置部署**：自动配置 CDN、SSL、域名
- ✅ **全球 CDN**：自动分发到全球边缘节点
- ✅ **自动 HTTPS**：免费 SSL 证书自动配置
- ✅ **Git 集成**：推送代码自动部署
- ✅ **预览部署**：每个 PR 自动生成预览链接
- ✅ **无限扩展**：自动处理流量波动
- ✅ **开发体验好**：本地开发和生产环境一致

**缺点**
- ❌ **供应商锁定**：依赖平台，迁移成本高
- ❌ **功能限制**：某些高级功能可能受限
- ❌ **成本不可控**：流量大时成本可能较高
- ❌ **定制性差**：无法完全自定义服务器配置
- ❌ **国内访问慢**：CDN 节点主要在海外

**适用场景**
- 静态网站和 JAMstack 应用
- 个人博客和作品集
- 快速原型和 MVP
- 不需要复杂服务器配置的项目

**成本分析**
- 免费计划：适合个人项目
- 专业计划：$20/月起（团队协作）
- 企业计划：按需定价
- **总计**：$0-240+/年

#### 4.3 容器化部署（Docker）

**架构图**
```
用户请求 → Nginx（反向代理） → Docker容器 → 应用服务
```

**部署流程**
1. 编写 Dockerfile
2. 构建 Docker 镜像
3. 推送镜像到仓库（Docker Hub、私有仓库）
4. 在服务器上拉取镜像
5. 运行容器

**Dockerfile 示例**

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose 示例**

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    restart: unless-stopped
```

**优点**
- ✅ **环境一致性**：开发、测试、生产环境完全一致
- ✅ **易于扩展**：可以快速启动多个容器
- ✅ **隔离性好**：容器之间相互隔离
- ✅ **版本管理**：镜像版本化管理，易于回滚
- ✅ **CI/CD 集成**：与 CI/CD 流程无缝集成
- ✅ **跨平台**：在任何支持 Docker 的平台运行

**缺点**
- ❌ **学习曲线**：需要学习 Docker 概念和命令
- ❌ **资源开销**：容器本身有一定资源消耗
- ❌ **镜像大小**：镜像可能较大（需要优化）
- ❌ **网络配置**：容器网络配置可能复杂
- ❌ **数据持久化**：需要配置数据卷

**适用场景**
- 微服务架构
- 需要环境一致性的项目
- CI/CD 自动化部署
- 多云部署场景

**成本分析**
- 服务器成本：$5-50/月
- Docker Hub：免费（公开镜像），私有镜像 $5/月起
- **总计**：约 $60-620/年

#### 4.4 对象存储 + CDN 部署

**架构图**
```
用户请求 → CDN边缘节点 → 对象存储（OSS/COS/S3） → 返回静态资源
```

**部署流程**
1. 在云服务商创建存储桶（Bucket）
2. 配置存储桶权限和 CORS
3. 构建前端项目
4. 上传构建产物到存储桶
5. 配置 CDN 加速
6. 绑定自定义域名

**阿里云 OSS 部署示例**

```bash
# 安装 OSS 命令行工具
npm install -g ossutil

# 配置访问密钥
ossutil config

# 上传文件
ossutil cp -r dist/ oss://my-bucket/ --update

# 设置静态网站托管
ossutil website --method put oss://my-bucket --index-document index.html
```

**优点**
- ✅ **高可用性**：99.9%+ 可用性保证
- ✅ **全球 CDN**：自动分发到全球节点
- ✅ **成本低**：按需付费，存储成本低
- ✅ **无限扩展**：自动处理高并发
- ✅ **备份简单**：版本控制和生命周期管理
- ✅ **访问速度快**：CDN 加速，访问速度快

**缺点**
- ❌ **供应商锁定**：依赖云服务商
- ❌ **配置复杂**：需要配置存储桶、CDN、域名等
- ❌ **成本不可控**：流量大时费用可能较高
- ❌ **功能限制**：某些高级功能可能受限
- ❌ **国内访问差异**：不同服务商在国内访问速度不同

**适用场景**
- 静态网站和单页应用
- 大量静态资源（图片、视频）
- 需要全球加速的应用
- 高并发场景

**成本分析**
- 存储费用：$0.023/GB/月（阿里云 OSS）
- 流量费用：$0.12-0.50/GB（根据地域）
- CDN 费用：$0.024-0.18/GB（根据地域）
- **总计**：根据流量，$10-500+/年

### 5. 部署方案优缺点分析框架

#### 5.1 分析维度

**技术维度**
- 部署复杂度
- 维护成本
- 扩展性
- 性能表现
- 可用性

**成本维度**
- 初始成本
- 运营成本
- 扩展成本
- 隐性成本（时间、人力）

**功能维度**
- 功能完整性
- 定制能力
- 集成能力
- 兼容性

**运维维度**
- 监控能力
- 日志管理
- 故障排查
- 备份恢复

#### 5.2 对比表格模板

| 维度 | 传统服务器 | Serverless | Docker | 对象存储+CDN |
|------|-----------|------------|--------|--------------|
| **部署复杂度** | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| **维护成本** | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| **扩展性** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **性能** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **成本（小流量）** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **成本（大流量）** | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **定制能力** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **学习曲线** | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ | ⭐⭐ |

#### 5.3 评分方法

**评分标准**
- ⭐⭐⭐⭐⭐：优秀（5分）
- ⭐⭐⭐⭐：良好（4分）
- ⭐⭐⭐：一般（3分）
- ⭐⭐：较差（2分）
- ⭐：很差（1分）

**加权评分示例**

```javascript
// 根据项目需求设置权重
const weights = {
  部署复杂度: 0.15,
  维护成本: 0.15,
  扩展性: 0.20,
  性能: 0.20,
  成本: 0.20,
  定制能力: 0.10
}

// 计算总分
const scores = {
  传统服务器: 3.6,
  Serverless: 4.2,
  Docker: 3.8,
  对象存储: 4.0
}
```

### 6. 部署方案选型指南

#### 6.1 选型决策树

```
项目类型？
├── 静态网站
│   ├── 个人项目？
│   │   ├── 是 → Serverless（Vercel/Netlify）
│   │   └── 否 → 对象存储 + CDN
│   └── 需要学习？
│       └── 是 → 传统服务器
│
├── 动态应用
│   ├── 需要服务器端渲染？
│   │   ├── 是 → Docker 或 传统服务器
│   │   └── 否 → Serverless（Next.js/Vercel）
│   └── 微服务架构？
│       └── 是 → Docker
│
└── 混合架构
    └── 前端 + 后端 API？
        ├── 前端 → 对象存储 + CDN
        └── 后端 → Docker 或 Serverless
```

#### 6.2 选型检查清单

**项目规模**
- [ ] 个人项目还是团队项目？
- [ ] 预期用户量是多少？
- [ ] 是否有预算限制？

**技术需求**
- [ ] 需要服务器端渲染吗？
- [ ] 需要 WebSocket 等实时功能吗？
- [ ] 需要文件上传等复杂功能吗？

**运维能力**
- [ ] 团队是否有运维经验？
- [ ] 能否接受供应商锁定？
- [ ] 是否需要完全控制权？

**成本考虑**
- [ ] 初期预算是多少？
- [ ] 预期流量是多少？
- [ ] 是否需要考虑长期成本？

#### 6.3 组合方案

**方案一：开发用 Serverless，生产用对象存储**
- 开发环境：Vercel（快速迭代）
- 生产环境：对象存储 + CDN（成本优化）

**方案二：静态资源用对象存储，动态内容用 Docker**
- 静态资源：OSS/COS/S3 + CDN
- API 服务：Docker 容器

**方案三：多环境混合部署**
- 开发环境：本地开发服务器
- 测试环境：Docker 容器
- 生产环境：对象存储 + CDN

## 实战内容

### 实战任务 1：完整项目部署流程

**任务目标**
将一个完整的 Vue/React 项目部署到个人域名，掌握完整的部署流程。

**任务步骤**

1. **准备项目**
   ```bash
   # 选择一个项目或创建新项目
   npm create vite@latest my-project -- --template vue
   cd my-project
   npm install
   ```

2. **配置环境变量**
   ```bash
   # 创建 .env.production
   echo "VITE_API_BASE_URL=https://api.example.com" > .env.production
   echo "VITE_APP_TITLE=My Production App" >> .env.production
   ```

3. **构建项目**
   ```bash
   npm run build
   # 检查 dist 目录
   ls -la dist/
   ```

4. **上传到服务器**
   ```bash
   # 使用 rsync 上传
   rsync -avz --delete dist/ username@server.com:/var/www/html/
   ```

5. **配置 Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/html;
       index index.html;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
       
       # 静态资源缓存
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

6. **验证部署**
   - 访问域名检查网站是否正常
   - 检查浏览器控制台是否有错误
   - 验证 API 请求是否正常

**预期结果**
- 项目可以通过域名正常访问
- 所有资源加载正常
- 环境变量正确生效

### 实战任务 2：多环境配置实践

**任务目标**
配置开发、测试、生产三个环境的部署配置。

**任务步骤**

1. **创建环境配置文件**
   ```bash
   # 创建三个环境的 .env 文件
   touch .env.development .env.staging .env.production
   ```

2. **配置各环境变量**
   ```bash
   # .env.development
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_APP_TITLE=My App (Dev)
   
   # .env.staging
   VITE_API_BASE_URL=https://staging-api.example.com
   VITE_APP_TITLE=My App (Staging)
   
   # .env.production
   VITE_API_BASE_URL=https://api.example.com
   VITE_APP_TITLE=My App
   ```

3. **创建部署脚本**
   ```bash
   # deploy.sh
   # 参考前面的多环境部署脚本
   ```

4. **测试各环境部署**
   ```bash
   # 部署到开发环境
   ./deploy.sh dev
   
   # 部署到测试环境
   ./deploy.sh staging
   
   # 部署到生产环境
   ./deploy.sh prod
   ```

**预期结果**
- 三个环境可以独立部署
- 各环境使用对应的配置
- 可以快速切换和回滚

### 实战任务 3：部署方案对比分析

**任务目标**
对比至少两种不同的部署方案，分析优缺点。

**任务步骤**

1. **选择对比方案**
   - 方案 A：传统服务器部署（Nginx + 静态文件）
   - 方案 B：Serverless 部署（Vercel）

2. **部署到两种方案**
   ```bash
   # 方案 A：传统服务器
   rsync -avz dist/ server:/var/www/html/
   
   # 方案 B：Vercel
   vercel --prod
   ```

3. **性能测试**
   - 使用 Lighthouse 测试性能
   - 测试不同地区的访问速度
   - 对比首次加载时间

4. **成本分析**
   - 计算服务器成本
   - 计算 Vercel 成本（如果超出免费额度）
   - 对比总成本

5. **编写对比文档**
   ```markdown
   # 部署方案对比分析
   
   ## 方案对比
   
   ### 方案 A：传统服务器
   - 优点：...
   - 缺点：...
   - 成本：...
   
   ### 方案 B：Serverless
   - 优点：...
   - 缺点：...
   - 成本：...
   
   ## 结论
   ...
   ```

**预期结果**
- 完成两种方案的部署
- 生成详细的对比分析文档
- 明确各方案的适用场景

### 实战任务 4：部署脚本优化

**任务目标**
编写一个完善的部署脚本，包含错误处理、日志记录、回滚功能。

**任务步骤**

1. **创建部署脚本**
   ```bash
   # deploy-advanced.sh
   # 包含以下功能：
   # - 错误处理
   # - 日志记录
   # - 备份和回滚
   # - 健康检查
   ```

2. **实现错误处理**
   ```bash
   set -e  # 遇到错误立即退出
   set -u  # 使用未定义变量时报错
   
   # 错误处理函数
   error_exit() {
       echo "错误: $1" >&2
       exit 1
   }
   ```

3. **实现日志记录**
   ```bash
   LOG_FILE="/var/log/deploy.log"
   
   log() {
       echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
   }
   ```

4. **实现备份和回滚**
   ```bash
   # 备份函数
   backup() {
       BACKUP_DIR="/var/backups/$(date +%Y%m%d_%H%M%S)"
       mkdir -p $BACKUP_DIR
       cp -r $DEPLOY_DIR/* $BACKUP_DIR/
       echo $BACKUP_DIR > /tmp/last_backup
   }
   
   # 回滚函数
   rollback() {
       if [ -f /tmp/last_backup ]; then
           BACKUP_DIR=$(cat /tmp/last_backup)
           cp -r $BACKUP_DIR/* $DEPLOY_DIR/
           log "已回滚到备份: $BACKUP_DIR"
       fi
   }
   ```

5. **实现健康检查**
   ```bash
   health_check() {
       URL="https://your-domain.com"
       STATUS=$(curl -o /dev/null -s -w "%{http_code}" $URL)
       
       if [ $STATUS -eq 200 ]; then
           log "健康检查通过"
           return 0
       else
           log "健康检查失败: HTTP $STATUS"
           return 1
       fi
   }
   ```

**预期结果**
- 部署脚本功能完善
- 包含错误处理和回滚机制
- 有详细的日志记录

## 需要关注的知识点

### 1. 部署安全性

**敏感信息保护**
- ✅ 不要在代码中硬编码密钥和密码
- ✅ 使用环境变量管理敏感信息
- ✅ 不要在 Git 仓库中提交 `.env` 文件
- ✅ 使用 `.gitignore` 排除敏感文件

**文件权限**
```bash
# 设置正确的文件权限
chmod 755 /var/www/html
chmod 644 /var/www/html/*
chown -R www-data:www-data /var/www/html
```

**HTTPS 配置**
- ✅ 强制使用 HTTPS
- ✅ 配置 HSTS 头
- ✅ 使用安全的 SSL/TLS 配置

### 2. 性能优化

**资源压缩**
```nginx
# Gzip 压缩
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

**缓存策略**
```nginx
# 静态资源长期缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

**CDN 配置**
- 配置合适的缓存策略
- 启用 Brotli 压缩
- 配置预热和刷新

### 3. 监控和日志

**访问日志**
```nginx
# Nginx 访问日志
access_log /var/log/nginx/access.log;
error_log /var/log/nginx/error.log;
```

**监控指标**
- 服务器 CPU、内存使用率
- 网站响应时间
- 错误率
- 流量统计

**告警配置**
- 设置关键指标告警阈值
- 配置告警通知（邮件、短信、钉钉等）

### 4. 故障排查

**常见问题**
- 404 错误：检查文件路径和 Nginx 配置
- 502 错误：检查后端服务是否运行
- 503 错误：检查服务器资源是否充足
- CORS 错误：检查 CORS 配置

**排查工具**
```bash
# 查看 Nginx 错误日志
tail -f /var/log/nginx/error.log

# 检查 Nginx 配置
nginx -t

# 查看服务器资源
top
df -h
free -m

# 测试网站响应
curl -I https://your-domain.com
```

### 5. 版本管理和回滚

**版本标签**
```bash
# 创建版本标签
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

**回滚策略**
- 保留多个版本的构建产物
- 快速回滚到上一个版本
- 数据库变更的回滚方案

## 实践检查清单

完成本日学习后，检查以下内容：

- [ ] **项目上传部署**
  - [ ] 掌握 Git 部署方式
  - [ ] 掌握 rsync 部署方式
  - [ ] 能够编写部署脚本

- [ ] **环境变量配置**
  - [ ] 理解环境变量的重要性
  - [ ] 能够配置多环境变量
  - [ ] 掌握环境隔离策略

- [ ] **多环境部署**
  - [ ] 配置开发、测试、生产环境
  - [ ] 能够独立部署到各环境
  - [ ] 掌握环境切换方法

- [ ] **部署方案对比**
  - [ ] 理解传统服务器部署方案
  - [ ] 理解 Serverless 部署方案
  - [ ] 理解 Docker 部署方案
  - [ ] 理解对象存储部署方案
  - [ ] 能够分析各方案优缺点

- [ ] **实战项目**
  - [ ] 完成项目部署到个人域名
  - [ ] 配置多环境部署
  - [ ] 完成至少两种方案对比分析
  - [ ] 编写部署方案对比文档

- [ ] **核心目标达成**
  - [ ] 能够独立部署个人应用
  - [ ] 具备分析公司部署方案的能力

## 常见问题 FAQ

### Q1: 如何选择部署方案？

**A:** 根据项目规模、技术需求、运维能力和成本预算来选择：
- 个人项目/快速原型 → Serverless（Vercel/Netlify）
- 需要完全控制 → 传统服务器
- 需要环境一致性 → Docker
- 大量静态资源 → 对象存储 + CDN

### Q2: 环境变量在生产环境如何管理？

**A:** 
- 使用 `.env` 文件（但不要提交到 Git）
- 在服务器上直接设置环境变量
- 使用配置管理工具（如 Ansible、Chef）
- 使用云服务商的密钥管理服务（如 AWS Secrets Manager）

### Q3: 如何实现零停机部署？

**A:**
- 使用蓝绿部署（准备两套环境，切换）
- 使用滚动更新（逐步替换）
- 使用负载均衡（先部署新版本，再逐步切换流量）

### Q4: 部署失败如何快速回滚？

**A:**
- 部署前备份当前版本
- 使用版本标签管理代码版本
- 保留多个版本的构建产物
- 编写自动回滚脚本

### Q5: 如何优化部署时间？

**A:**
- 使用构建缓存（node_modules、构建产物）
- 并行执行任务
- 增量构建（只构建变更部分）
- 使用 CI/CD 缓存机制

## 学习资源

### 官方文档
- [Vite 环境变量](https://cn.vitejs.dev/guide/env-and-mode.html)
- [Nginx 官方文档](https://nginx.org/en/docs/)
- [Docker 官方文档](https://docs.docker.com/)
- [Vercel 部署文档](https://vercel.com/docs)
- [Netlify 部署文档](https://docs.netlify.com/)

### 工具推荐
- **rsync**: 文件同步工具
- **PM2**: Node.js 进程管理器
- **acme.sh**: SSL 证书自动申请和续期
- **Lighthouse**: 性能测试工具

### 参考文章
- [12-Factor App](https://12factor.net/)
- [前端部署最佳实践](https://juejin.cn/post/6844903870212276237)
- [Docker 多阶段构建优化](https://docs.docker.com/develop/develop-images/multistage-build/)

## 总结

Day 7 的核心内容是**项目部署实战和方案对比**。通过今天的学习，你应该：

1. **掌握多种部署方式**：Git、rsync、SCP 等，能够根据场景选择合适的方式
2. **理解环境管理**：能够配置和管理多环境，确保环境隔离
3. **具备方案分析能力**：能够对比不同部署方案，分析优缺点，做出合理选型
4. **完成实战部署**：能够独立完成项目从开发到生产的完整部署流程

**下一步学习建议**：
- 如果对 Nginx 配置还不熟悉，可以继续深入学习 Day 8 的 Nginx 高级配置
- 如果想要自动化部署，可以学习 Day 9-11 的 CI/CD 内容
- 如果想要容器化部署，可以学习 Day 12-13 的 Docker 内容

记住：**部署不是一次性的工作，而是一个持续优化的过程**。在实际工作中，要根据项目发展不断调整和优化部署方案。

