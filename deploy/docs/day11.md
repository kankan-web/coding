# Day 11: CI/CD Pipeline 优化和自动化部署 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 掌握 SSH 部署配置和密钥管理，实现安全的自动化部署
- 编写 Shell 和 Node.js 部署脚本，实现灵活的项目部署
- 理解并应用 Pipeline 优化技巧，显著缩短部署时间
- 实现并行任务执行、增量构建和智能缓存策略
- 配置条件跳过和构建产物复用，避免不必要的构建
- 实现部署回滚机制，保证系统稳定性
- 配置部署通知（钉钉、企业微信、邮件、Slack），及时了解部署状态
- 分析和优化部署时间，将 Pipeline 时间缩短至少 30%

## 学习时间分配

- **理论学习**: 2-2.5 小时
- **实践操作**: 4-5 小时
- **Pipeline 优化和测试**: 1-1.5 小时
- **总结和文档**: 30 分钟

## 核心知识点

### 1. SSH 部署配置和密钥管理

#### 1.1 SSH 密钥基础

**SSH 密钥的作用**
- 免密登录服务器，提高安全性
- 避免在代码中存储密码
- 支持自动化部署脚本

**SSH 密钥类型**
- **RSA**: 传统算法，兼容性好
- **Ed25519**: 现代算法，更安全、更快（推荐）
- **ECDSA**: 椭圆曲线算法

**生成 SSH 密钥**

```bash
# 生成 Ed25519 密钥（推荐）
ssh-keygen -t ed25519 -C "your_email@example.com" -f ~/.ssh/deploy_key

# 生成 RSA 密钥（兼容性更好）
ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f ~/.ssh/deploy_key

# 查看公钥内容
cat ~/.ssh/deploy_key.pub
```

**密钥文件说明**
- `deploy_key`: 私钥文件，**绝对不能泄露**
- `deploy_key.pub`: 公钥文件，可以安全地分享

#### 1.2 GitHub Actions Secrets 配置

**为什么使用 Secrets**
- GitHub Actions Secrets 加密存储敏感信息
- 不会在日志中显示（除非显式输出）
- 可以设置权限，控制访问范围

**配置 Secrets 步骤**

1. **在 GitHub 仓库中配置 Secrets**
   - 进入仓库 → Settings → Secrets and variables → Actions
   - 点击 "New repository secret"
   - 添加以下 Secrets：
     - `SSH_PRIVATE_KEY`: 服务器私钥（完整内容，包括 `-----BEGIN XXX KEY-----` 和 `-----END XXX KEY-----`）
     - `SSH_HOST`: 服务器 IP 或域名
     - `SSH_USER`: SSH 用户名（如 `root`、`ubuntu`）
     - `DEPLOY_PATH`: 部署路径（如 `/var/www/html`）

2. **在服务器上配置公钥**

```bash
# 登录服务器
ssh user@your-server.com

# 创建 .ssh 目录（如果不存在）
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 将公钥添加到 authorized_keys
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys

# 验证权限
ls -la ~/.ssh/
```

**SSH 配置文件优化**

在服务器上创建或编辑 `~/.ssh/config`：

```bash
Host deploy-server
    HostName your-server.com
    User ubuntu
    IdentityFile ~/.ssh/deploy_key
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
```

#### 1.3 在 GitHub Actions 中使用 SSH

**基础 SSH 连接步骤**

```yaml
- name: 配置 SSH
  run: |
    mkdir -p ~/.ssh
    echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
    chmod 600 ~/.ssh/deploy_key
    ssh-keyscan -H ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts

- name: 测试 SSH 连接
  run: |
    ssh -i ~/.ssh/deploy_key ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "echo 'SSH 连接成功'"
```

**使用 SSH Action（推荐）**

```yaml
- name: 使用 SSH 连接服务器
  uses: appleboy/ssh-action@v1.0.0
  with:
    host: ${{ secrets.SSH_HOST }}
    username: ${{ secrets.SSH_USER }}
    key: ${{ secrets.SSH_PRIVATE_KEY }}
    script: |
      echo "开始部署"
      cd ${{ secrets.DEPLOY_PATH }}
      git pull
      npm install
      npm run build
```

### 2. 部署脚本编写

#### 2.1 Shell 部署脚本

**基础 Shell 脚本结构**

```bash
#!/bin/bash
# deploy.sh - 部署脚本

set -e  # 遇到错误立即退出
set -u  # 使用未定义变量时报错

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
DEPLOY_PATH="/var/www/html"
BACKUP_PATH="/var/www/backups"
PROJECT_NAME="my-project"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# 日志函数
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# 错误处理
error_exit() {
    log_error "$1"
    exit 1
}

# 创建备份
create_backup() {
    log_info "创建备份..."
    if [ -d "$DEPLOY_PATH" ]; then
        mkdir -p "$BACKUP_PATH"
        tar -czf "$BACKUP_PATH/${PROJECT_NAME}_${TIMESTAMP}.tar.gz" -C "$DEPLOY_PATH" .
        log_info "备份完成: ${PROJECT_NAME}_${TIMESTAMP}.tar.gz"
    else
        log_warn "部署目录不存在，跳过备份"
    fi
}

# 部署函数
deploy() {
    log_info "开始部署..."
    
    # 检查部署目录
    if [ ! -d "$DEPLOY_PATH" ]; then
        mkdir -p "$DEPLOY_PATH"
        log_info "创建部署目录: $DEPLOY_PATH"
    fi
    
    # 进入部署目录
    cd "$DEPLOY_PATH" || error_exit "无法进入部署目录"
    
    # 拉取最新代码（如果是 Git 仓库）
    if [ -d ".git" ]; then
        log_info "拉取最新代码..."
        git pull origin main || error_exit "Git pull 失败"
    fi
    
    # 安装依赖
    log_info "安装依赖..."
    npm ci --production || error_exit "依赖安装失败"
    
    # 构建项目
    log_info "构建项目..."
    npm run build || error_exit "构建失败"
    
    # 重启服务（如需要）
    if command -v pm2 &> /dev/null; then
        log_info "重启 PM2 服务..."
        pm2 restart "$PROJECT_NAME" || pm2 start ecosystem.config.js
    fi
    
    log_info "部署完成！"
}

# 主函数
main() {
    log_info "========================================="
    log_info "开始部署: $PROJECT_NAME"
    log_info "时间: $(date '+%Y-%m-%d %H:%M:%S')"
    log_info "========================================="
    
    create_backup
    deploy
    
    log_info "========================================="
    log_info "部署成功完成！"
    log_info "========================================="
}

# 执行主函数
main "$@"
```

**高级 Shell 脚本特性**

```bash
#!/bin/bash
# deploy-advanced.sh - 高级部署脚本

# 1. 参数解析
ENVIRONMENT=${1:-production}  # 默认为 production
DRY_RUN=${2:-false}           # 是否干运行

# 2. 配置文件加载
load_config() {
    if [ -f ".env.$ENVIRONMENT" ]; then
        source .env.$ENVIRONMENT
        log_info "加载环境配置: .env.$ENVIRONMENT"
    else
        error_exit "配置文件不存在: .env.$ENVIRONMENT"
    fi
}

# 3. 健康检查
health_check() {
    log_info "执行健康检查..."
    local url="${BASE_URL}/health"
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$response" -eq 200 ]; then
        log_info "健康检查通过"
        return 0
    else
        log_error "健康检查失败: HTTP $response"
        return 1
    fi
}

# 4. 回滚功能
rollback() {
    log_warn "开始回滚..."
    local latest_backup=$(ls -t "$BACKUP_PATH" | head -1)
    
    if [ -z "$latest_backup" ]; then
        error_exit "没有找到备份文件"
    fi
    
    log_info "回滚到: $latest_backup"
    tar -xzf "$BACKUP_PATH/$latest_backup" -C "$DEPLOY_PATH"
    log_info "回滚完成"
}

# 5. 清理旧备份
cleanup_old_backups() {
    log_info "清理旧备份（保留最近 5 个）..."
    ls -t "$BACKUP_PATH" | tail -n +6 | xargs -r rm -f
}

# 在主函数中调用
main() {
    load_config
    
    if [ "$DRY_RUN" = "true" ]; then
        log_warn "干运行模式，不会实际部署"
        return 0
    fi
    
    deploy
    
    if health_check; then
        cleanup_old_backups
    else
        log_error "部署后健康检查失败，执行回滚..."
        rollback
        exit 1
    fi
}
```

#### 2.2 Node.js 部署脚本

**基础 Node.js 部署脚本**

```javascript
// deploy.js - Node.js 部署脚本

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 配置
const config = {
    deployPath: process.env.DEPLOY_PATH || '/var/www/html',
    backupPath: process.env.BACKUP_PATH || '/var/www/backups',
    projectName: process.env.PROJECT_NAME || 'my-project',
    environment: process.env.NODE_ENV || 'production'
};

// 工具函数
const log = {
    info: (msg) => console.log(`[INFO] ${msg}`),
    error: (msg) => console.error(`[ERROR] ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${msg}`)
};

// 执行命令
function exec(command, options = {}) {
    try {
        log.info(`执行: ${command}`);
        const output = execSync(command, {
            encoding: 'utf-8',
            stdio: 'inherit',
            ...options
        });
        return output;
    } catch (error) {
        log.error(`命令执行失败: ${command}`);
        throw error;
    }
}

// 创建备份
function createBackup() {
    log.info('创建备份...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(
        config.backupPath,
        `${config.projectName}_${timestamp}.tar.gz`
    );
    
    // 确保备份目录存在
    if (!fs.existsSync(config.backupPath)) {
        fs.mkdirSync(config.backupPath, { recursive: true });
    }
    
    if (fs.existsSync(config.deployPath)) {
        exec(`tar -czf ${backupFile} -C ${config.deployPath} .`);
        log.info(`备份完成: ${backupFile}`);
        return backupFile;
    } else {
        log.warn('部署目录不存在，跳过备份');
        return null;
    }
}

// 部署函数
async function deploy() {
    log.info('开始部署...');
    
    // 确保部署目录存在
    if (!fs.existsSync(config.deployPath)) {
        fs.mkdirSync(config.deployPath, { recursive: true });
    }
    
    process.chdir(config.deployPath);
    
    // 拉取最新代码
    if (fs.existsSync('.git')) {
        log.info('拉取最新代码...');
        exec('git pull origin main');
    }
    
    // 安装依赖
    log.info('安装依赖...');
    exec('npm ci --production');
    
    // 构建项目
    log.info('构建项目...');
    exec('npm run build');
    
    log.info('部署完成！');
}

// 主函数
async function main() {
    try {
        log.info('=========================================');
        log.info(`开始部署: ${config.projectName}`);
        log.info(`环境: ${config.environment}`);
        log.info(`时间: ${new Date().toLocaleString()}`);
        log.info('=========================================');
        
        const backupFile = createBackup();
        await deploy();
        
        log.info('=========================================');
        log.info('部署成功完成！');
        log.info('=========================================');
    } catch (error) {
        log.error(`部署失败: ${error.message}`);
        process.exit(1);
    }
}

main();
```

**高级 Node.js 脚本（使用现代语法和工具）**

```javascript
// deploy-advanced.mjs - ES Module 版本

import { execSync } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 使用 chalk 库美化输出（需要安装: npm install chalk）
import chalk from 'chalk';

const log = {
    info: (msg) => console.log(chalk.blue(`[INFO]`), msg),
    error: (msg) => console.error(chalk.red(`[ERROR]`), msg),
    warn: (msg) => console.warn(chalk.yellow(`[WARN]`), msg),
    success: (msg) => console.log(chalk.green(`[SUCCESS]`), msg)
};

// 使用 async/await 的文件操作
async function createBackup() {
    // ... 实现
}

// 使用 Promise 的并发执行
async function deployParallel() {
    const tasks = [
        () => exec('npm ci'),
        () => exec('npm run build'),
        () => exec('npm run test')
    ];
    
    await Promise.all(tasks.map(task => task()));
}

// 健康检查（使用 fetch）
async function healthCheck(url) {
    try {
        const response = await fetch(url);
        return response.ok;
    } catch (error) {
        return false;
    }
}
```

### 3. Pipeline 优化技巧

#### 3.1 并行任务执行

**为什么需要并行执行**
- 缩短整体 Pipeline 时间
- 充分利用 CI/CD 资源
- 提高开发效率

**GitHub Actions 并行配置**

```yaml
jobs:
  # 基础串行执行（慢）
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 安装依赖
        run: npm ci
      - name: 代码检查
        run: npm run lint
      - name: 运行测试
        run: npm run test
      - name: 构建项目
        run: npm run build
      # 总时间 = 依赖安装 + 代码检查 + 测试 + 构建

  # 优化后的并行执行（快）
  build-optimized:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      # 并行执行多个任务
      - name: 安装依赖
        run: npm ci
      
      - name: 代码检查和测试（并行）
        run: |
          npm run lint &
          npm run test &
          wait
      
      - name: 构建项目
        run: npm run build

  # 使用 jobs 并行（最佳实践）
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test

  build:
    needs: [lint, test]  # 等待 lint 和 test 完成
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
    # 总时间 ≈ max(lint时间, test时间) + build时间
```

**矩阵构建并行**

```yaml
jobs:
  test-matrix:
    runs-on: ${{ matrix.os }}
    strategy:
      fail-fast: false  # 一个失败不影响其他
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node-version: [16.x, 18.x, 20.x]
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm run test
    # 9 个任务并行执行（3 OS × 3 Node版本）
```

#### 3.2 增量构建和缓存策略

**依赖缓存优化**

```yaml
steps:
  - uses: actions/checkout@v3
  
  # 方案1: 使用官方 cache action（推荐）
  - name: 缓存 Node modules
    uses: actions/cache@v3
    with:
      path: |
        node_modules
        ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
  
  - name: 安装依赖
    run: npm ci
  
  # 方案2: 使用 setup-node 的 cache 参数（更简单）
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
      cache: 'npm'  # 自动缓存 node_modules

  # 方案3: 使用 pnpm/yarn 缓存
  - name: 缓存 pnpm store
    uses: actions/cache@v3
    with:
      path: ~/.pnpm-store
      key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-pnpm-
  
  - name: 安装依赖
    run: pnpm install --frozen-lockfile
```

**构建产物缓存**

```yaml
steps:
  - uses: actions/checkout@v3
  
  # 缓存构建产物
  - name: 缓存构建产物
    uses: actions/cache@v3
    id: cache-build
    with:
      path: |
        dist
        .next
        build
      key: ${{ runner.os }}-build-${{ github.sha }}
      restore-keys: |
        ${{ runner.os }}-build-
  
  # 检查缓存是否命中
  - name: 检查缓存
    if: steps.cache-build.outputs.cache-hit != 'true'
    run: |
      echo "缓存未命中，执行完整构建"
      npm run build
  
  - name: 使用缓存
    if: steps.cache-build.outputs.cache-hit == 'true'
    run: |
      echo "使用缓存构建产物"
```

**增量构建（只构建变更的模块）**

```yaml
steps:
  - uses: actions/checkout@v3
    with:
      fetch-depth: 0  # 获取完整历史记录
  
  - name: 检测变更文件
    id: changes
    run: |
      # 检测哪些文件发生变化
      git diff --name-only ${{ github.event.before }} ${{ github.sha }} > changes.txt
      echo "变更的文件："
      cat changes.txt
      
      # 设置输出变量
      if grep -q "src/components" changes.txt; then
        echo "components_changed=true" >> $GITHUB_OUTPUT
      fi
      
      if grep -q "src/utils" changes.txt; then
        echo "utils_changed=true" >> $GITHUB_OUTPUT
      fi
  
  - name: 增量构建
    run: |
      # 只构建变更的模块
      if [ "${{ steps.changes.outputs.components_changed }}" == "true" ]; then
        npm run build:components
      fi
      
      if [ "${{ steps.changes.outputs.utils_changed }}" == "true" ]; then
        npm run build:utils
      fi
      
      # 始终构建主应用
      npm run build:app
```

#### 3.3 条件跳过（Skip CI）

**使用 [skip ci] 跳过构建**

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    # 检查提交信息中是否包含 [skip ci]
    if: "!contains(github.event.head_commit.message, '[skip ci]')"
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
```

**路径过滤（只构建变更的文件）**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: 检测文件变更
        uses: dorny/paths-filter@v2
        id: changes
        with:
          filters: |
            frontend:
              - 'frontend/**'
              - 'package.json'
            backend:
              - 'backend/**'
              - 'package.json'
      
      - name: 构建前端
        if: steps.changes.outputs.frontend == 'true'
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: 构建后端
        if: steps.changes.outputs.backend == 'true'
        run: |
          cd backend
          npm ci
          npm run build
```

**基于分支的跳过**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # 只在特定分支构建
    if: |
      github.ref == 'refs/heads/main' ||
      github.ref == 'refs/heads/develop' ||
      startsWith(github.ref, 'refs/heads/feature/')
    steps:
      - uses: actions/checkout@v3
      - run: npm ci
      - run: npm run build
```

#### 3.4 构建产物复用

**上传和下载构建产物**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 构建
        run: |
          npm ci
          npm run build
      
      # 上传构建产物
      - name: 上传构建产物
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: |
            dist
            build
          retention-days: 7  # 保留 7 天

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      # 下载构建产物
      - name: 下载构建产物
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: 部署
        run: |
          # 部署逻辑
          echo "部署构建产物..."
```

**使用 GitHub Release 存储构建产物**

```yaml
jobs:
  build-and-release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: 构建
        run: |
          npm ci
          npm run build
      
      - name: 创建 Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v${{ github.sha }}
          files: |
            dist/**/*
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

#### 3.5 依赖安装优化

**使用 pnpm（更快的包管理器）**

```yaml
steps:
  - uses: actions/checkout@v3
  
  - name: 安装 pnpm
    uses: pnpm/action-setup@v2
    with:
      version: 8
      run_install: false
  
  - uses: actions/setup-node@v3
    with:
      node-version: '18'
      cache: 'pnpm'
  
  - name: 安装依赖
    run: pnpm install --frozen-lockfile
    # pnpm 通常比 npm 快 2-3 倍
```

**使用 npm ci vs npm install**

```yaml
steps:
  # ✅ 推荐：npm ci（更快、更可靠）
  - name: 安装依赖（CI）
    run: npm ci
    # 特点：
    # - 删除 node_modules 后重新安装（干净）
    # - 使用 package-lock.json（版本锁定）
    # - 更快（不需要解析依赖）
    # - 不适合开发环境

  # ❌ 不推荐：npm install（CI 中）
  - name: 安装依赖（不推荐）
    run: npm install
    # 特点：
    # - 可能会更新 package-lock.json
    # - 依赖解析较慢
    # - 适合开发环境
```

**并行安装依赖**

```yaml
steps:
  - name: 安装依赖（并行）
    run: |
      # 使用 npm ci 的 --prefer-offline 选项
      npm ci --prefer-offline --no-audit
      
      # 或者使用 pnpm 的并行安装
      pnpm install --frozen-lockfile --prefer-offline
```

#### 3.6 构建步骤优化

**只构建变更模块**

```yaml
steps:
  - uses: actions/checkout@v3
    with:
      fetch-depth: 0
  
  - name: 检测变更
    id: changes
    run: |
      # 使用 git diff 检测变更
      CHANGED_FILES=$(git diff --name-only ${{ github.event.before }} ${{ github.sha }})
      
      if echo "$CHANGED_FILES" | grep -q "packages/core"; then
        echo "core_changed=true" >> $GITHUB_OUTPUT
      fi
      
      if echo "$CHANGED_FILES" | grep -q "packages/ui"; then
        echo "ui_changed=true" >> $GITHUB_OUTPUT
      fi
  
  - name: 构建核心包
    if: steps.changes.outputs.core_changed == 'true'
    run: |
      cd packages/core
      npm run build
  
  - name: 构建 UI 包
    if: steps.changes.outputs.ui_changed == 'true'
    run: |
      cd packages/ui
      npm run build
```

**使用构建缓存**

```yaml
steps:
  - uses: actions/checkout@v3
  
  - name: 缓存构建目录
    uses: actions/cache@v3
    with:
      path: |
        .next/cache
        node_modules/.cache
      key: ${{ runner.os }}-build-cache-${{ github.sha }}
      restore-keys: |
        ${{ runner.os }}-build-cache-
  
  - name: 构建
    run: npm run build
    env:
      # 启用构建缓存
      NEXT_TELEMETRY_DISABLED: 1
      NODE_ENV: production
```

### 4. 回滚机制

#### 4.1 版本回退

**Git 版本回退**

```bash
#!/bin/bash
# rollback.sh - Git 版本回退脚本

set -e

DEPLOY_PATH="/var/www/html"
GIT_REPO="https://github.com/user/repo.git"
TARGET_VERSION=$1  # 传入要回退的版本号或 commit hash

if [ -z "$TARGET_VERSION" ]; then
    echo "用法: ./rollback.sh <version|commit-hash>"
    exit 1
fi

cd "$DEPLOY_PATH" || exit 1

# 创建回退前的备份
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
git tag "rollback-before-$TIMESTAMP"

# 回退到指定版本
git checkout "$TARGET_VERSION"

# 重新构建和部署
npm ci --production
npm run build

# 重启服务
pm2 restart my-app || echo "PM2 未运行，跳过重启"

echo "回退完成: $TARGET_VERSION"
```

**GitHub Actions 回滚工作流**

```yaml
name: Rollback

on:
  workflow_dispatch:
    inputs:
      target_version:
        description: '回退目标版本（tag 或 commit hash）'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.inputs.target_version }}
      
      - name: 部署到服务器
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd ${{ secrets.DEPLOY_PATH }}
            git fetch origin
            git checkout ${{ github.event.inputs.target_version }}
            npm ci --production
            npm run build
            pm2 restart my-app
```

#### 4.2 数据库回滚

**数据库迁移回滚**

```javascript
// rollback-db.js - 数据库回滚脚本

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function rollbackDatabase(targetVersion) {
    console.log(`回滚数据库到版本: ${targetVersion}`);
    
    // 使用数据库迁移工具回滚
    // 例如：使用 Sequelize、Knex.js、TypeORM 等
    
    try {
        // 示例：使用 Knex.js
        execSync(`npx knex migrate:rollback --to ${targetVersion}`, {
            stdio: 'inherit'
        });
        
        console.log('数据库回滚成功');
    } catch (error) {
        console.error('数据库回滚失败:', error);
        throw error;
    }
}

// 主函数
async function main() {
    const targetVersion = process.argv[2];
    
    if (!targetVersion) {
        console.error('请指定回滚版本');
        process.exit(1);
    }
    
    await rollbackDatabase(targetVersion);
}

main();
```

### 5. 部署通知

#### 5.1 钉钉通知

```yaml
- name: 发送钉钉通知
  if: always()  # 无论成功失败都发送
  run: |
    STATUS="${{ job.status }}"
    if [ "$STATUS" == "success" ]; then
      STATUS_TEXT="✅ 部署成功"
      COLOR="#00FF00"
    else
      STATUS_TEXT="❌ 部署失败"
      COLOR="#FF0000"
    fi
    
    curl -X POST "${{ secrets.DINGTALK_WEBHOOK }}" \
      -H 'Content-Type: application/json' \
      -d "{
        \"msgtype\": \"markdown\",
        \"markdown\": {
          \"title\": \"部署通知\",
          \"text\": \"## 部署通知\n\n**项目**: ${{ github.repository }}\n\n**分支**: ${{ github.ref }}\n\n**状态**: $STATUS_TEXT\n\n**提交**: ${{ github.event.head_commit.message }}\n\n**时间**: $(date '+%Y-%m-%d %H:%M:%S')\n\n[查看详情](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})\"
        }
      }"
```

**使用钉钉 Action**

```yaml
- name: 发送钉钉通知
  uses: zcong1993/actions-ding@v1
  if: always()
  with:
    dingToken: ${{ secrets.DINGTALK_WEBHOOK }}
    type: markdown
    body: |
      ## 部署通知
      
      **项目**: ${{ github.repository }}
      **分支**: ${{ github.ref }}
      **状态**: ${{ job.status }}
      **提交**: ${{ github.event.head_commit.message }}
```

#### 5.2 企业微信通知

```yaml
- name: 发送企业微信通知
  if: always()
  run: |
    curl -X POST "${{ secrets.WECHAT_WEBHOOK }}" \
      -H 'Content-Type: application/json' \
      -d '{
        "msgtype": "markdown",
        "markdown": {
          "content": "## 部署通知\n\n**项目**: '${{ github.repository }}'\n\n**状态**: '${{ job.status }}'\n\n**时间**: '$(date '+%Y-%m-%d %H:%M:%S')'"
        }
      }'
```

#### 5.3 邮件通知

```yaml
- name: 发送邮件通知
  if: always()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: "部署通知: ${{ github.repository }} - ${{ job.status }}"
    body: |
      项目: ${{ github.repository }}
      分支: ${{ github.ref }}
      状态: ${{ job.status }}
      提交: ${{ github.event.head_commit.message }}
      时间: $(date '+%Y-%m-%d %H:%M:%S')
    to: deploy-team@example.com
    from: CI/CD Bot
```

#### 5.4 Slack 通知

```yaml
- name: 发送 Slack 通知
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "部署通知",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*项目*: ${{ github.repository }}\n*状态*: ${{ job.status }}\n*分支*: ${{ github.ref }}"
            }
          }
        ]
      }
```

### 6. 部署时间分析和优化

#### 6.1 时间测量

**在 GitHub Actions 中测量时间**

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: 开始计时
        run: echo "START_TIME=$(date +%s)" >> $GITHUB_ENV
      
      - name: 安装依赖
        run: npm ci
      
      - name: 构建
        run: npm run build
      
      - name: 结束计时并计算耗时
        run: |
          END_TIME=$(date +%s)
          DURATION=$((END_TIME - START_TIME))
          echo "构建耗时: ${DURATION}秒"
          echo "DURATION=${DURATION}" >> $GITHUB_ENV
      
      - name: 记录构建时间
        run: |
          echo "## 构建时间报告" >> $GITHUB_STEP_SUMMARY
          echo "- 总耗时: ${DURATION}秒" >> $GITHUB_STEP_SUMMARY
          echo "- 依赖安装: XXX秒" >> $GITHUB_STEP_SUMMARY
          echo "- 构建: XXX秒" >> $GITHUB_STEP_SUMMARY
```

**使用 Action 测量时间**

```yaml
- name: 构建（计时）
  uses: nick-invision/retry@v2
  with:
    timeout_minutes: 10
    command: npm run build

- name: 记录时间
  uses: k1LoW/doctoc@v1.4.0
  with:
    token: ${{ secrets.GITHUB_TOKEN }}
    path: BUILD_TIME.md
    message: "更新构建时间: $(date)"
```

#### 6.2 优化对比

**优化前后对比示例**

```yaml
# 优化前的工作流（慢）
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install  # ❌ 慢
      - run: npm run lint  # ❌ 串行
      - run: npm run test  # ❌ 串行
      - run: npm run build  # ❌ 串行
      # 总时间 ≈ 5-10 分钟

# 优化后的工作流（快）
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'  # ✅ 缓存
      - run: npm ci  # ✅ 更快
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run test

  build:
    needs: [lint, test]  # ✅ 并行执行
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      # 总时间 ≈ 2-4 分钟（减少 50-60%）
```

## 实战任务

### 任务1: 配置 SSH 密钥和 GitHub Actions Secrets

**目标**: 配置 SSH 密钥，实现安全的服务器连接

**步骤**:

1. **生成 SSH 密钥对**
   ```bash
   ssh-keygen -t ed25519 -C "deploy@github-actions" -f ~/.ssh/github_actions_deploy
   ```

2. **将公钥添加到服务器**
   ```bash
   # 复制公钥内容
   cat ~/.ssh/github_actions_deploy.pub
   
   # 登录服务器，添加到 authorized_keys
   ssh user@your-server.com
   echo "公钥内容" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **配置 GitHub Secrets**
   - 进入仓库 Settings → Secrets and variables → Actions
   - 添加以下 Secrets:
     - `SSH_PRIVATE_KEY`: 私钥完整内容（包括 BEGIN/END 行）
     - `SSH_HOST`: 服务器地址
     - `SSH_USER`: SSH 用户名
     - `DEPLOY_PATH`: 部署路径

4. **测试 SSH 连接**
   ```bash
   ssh -i ~/.ssh/github_actions_deploy user@your-server.com "echo '连接成功'"
   ```

**检查点**:
- [ ] SSH 密钥生成成功
- [ ] 公钥已添加到服务器
- [ ] GitHub Secrets 配置完成
- [ ] SSH 连接测试成功

### 任务2: 编写基础部署脚本（Shell）

**目标**: 编写一个完整的 Shell 部署脚本

**步骤**:

1. **创建部署脚本**
   ```bash
   touch deploy.sh
   chmod +x deploy.sh
   ```

2. **实现基础功能**
   - 备份当前版本
   - 拉取最新代码
   - 安装依赖
   - 构建项目
   - 重启服务

3. **添加错误处理**
   - 使用 `set -e` 遇到错误立即退出
   - 添加日志函数
   - 实现回滚功能

4. **测试脚本**
   ```bash
   ./deploy.sh
   ```

**检查点**:
- [ ] 脚本可以正常执行
- [ ] 备份功能正常
- [ ] 部署功能正常
- [ ] 错误处理正常

### 任务3: 编写 Node.js 部署脚本

**目标**: 使用 Node.js 编写更灵活的部署脚本

**步骤**:

1. **创建 Node.js 脚本**
   ```bash
   touch deploy.js
   ```

2. **实现功能**
   - 使用 `child_process.execSync` 执行命令
   - 实现备份和部署逻辑
   - 添加颜色输出（使用 chalk）

3. **安装依赖**
   ```bash
   npm install chalk
   ```

4. **测试脚本**
   ```bash
   node deploy.js
   ```

**检查点**:
- [ ] Node.js 脚本可以正常执行
- [ ] 功能与 Shell 脚本一致
- [ ] 输出更美观

### 任务4: 配置基础 GitHub Actions 工作流

**目标**: 创建基础的 CI/CD 工作流

**步骤**:

1. **创建工作流文件**
   ```bash
   mkdir -p .github/workflows
   touch .github/workflows/deploy.yml
   ```

2. **配置基础工作流**
   - 设置触发条件
   - 配置构建步骤
   - 配置部署步骤

3. **测试工作流**
   - 提交代码触发工作流
   - 检查工作流执行结果

**检查点**:
- [ ] 工作流文件创建成功
- [ ] 可以正常触发
- [ ] 构建步骤执行成功
- [ ] 部署步骤执行成功

### 任务5: 实现 Pipeline 优化

**目标**: 优化 Pipeline，将部署时间缩短至少 30%

**步骤**:

1. **记录优化前的构建时间**
   - 执行一次完整构建
   - 记录各步骤耗时

2. **实施优化措施**
   - **并行执行**: 将 lint、test、build 改为并行
   - **缓存优化**: 配置依赖缓存和构建缓存
   - **条件跳过**: 配置路径过滤，只构建变更的文件
   - **依赖优化**: 使用 pnpm 或 npm ci
   - **增量构建**: 只构建变更的模块

3. **记录优化后的构建时间**
   - 执行优化后的构建
   - 对比优化前后的时间

4. **计算优化效果**
   ```bash
   优化前时间: 600秒
   优化后时间: 400秒
   优化比例: (600 - 400) / 600 = 33.3%
   ```

**检查点**:
- [ ] 优化前时间已记录
- [ ] 所有优化措施已实施
- [ ] 优化后时间已记录
- [ ] 优化比例达到 30% 以上

### 任务6: 实现部署通知

**目标**: 配置部署通知，及时了解部署状态

**步骤**:

1. **选择通知方式**
   - 钉钉、企业微信、邮件、Slack 中选择一种

2. **获取 Webhook URL**
   - 配置相应的 Webhook

3. **在工作流中添加通知步骤**
   - 部署成功通知
   - 部署失败通知

4. **测试通知**
   - 触发一次部署
   - 检查是否收到通知

**检查点**:
- [ ] Webhook 配置完成
- [ ] 通知步骤已添加
- [ ] 成功通知正常
- [ ] 失败通知正常

### 任务7: 性能对比和优化总结

**目标**: 总结优化成果，编写优化文档

**步骤**:

1. **收集数据**
   - 优化前后的构建时间
   - 各步骤的耗时对比
   - 优化措施清单

2. **编写优化总结文档**
   - 优化前的问题
   - 实施的优化措施
   - 优化效果和数据
   - 最佳实践总结

3. **创建优化报告**
   ```markdown
   # Pipeline 优化报告
   
   ## 优化前
   - 总耗时: 600秒
   - 依赖安装: 180秒
   - 构建: 420秒
   
   ## 优化措施
   1. 并行执行 lint、test、build
   2. 配置依赖缓存
   3. 使用 npm ci 替代 npm install
   4. 增量构建
   
   ## 优化后
   - 总耗时: 400秒（减少 33.3%）
   - 依赖安装: 60秒（缓存命中）
   - 构建: 340秒
   ```

**检查点**:
- [ ] 数据收集完整
- [ ] 优化文档已编写
- [ ] 包含前后对比数据
- [ ] 包含最佳实践总结

## 完整示例：优化后的 GitHub Actions 工作流

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

env:
  NODE_VERSION: '18.x'
  PNPM_VERSION: '8'

jobs:
  # 代码检查（并行）
  lint:
    name: 代码检查
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: 安装 pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      
      - name: 安装依赖
        run: pnpm install --frozen-lockfile
      
      - name: 代码检查
        run: pnpm run lint

  # 测试（并行）
  test:
    name: 运行测试
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: 安装 pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      
      - name: 安装依赖
        run: pnpm install --frozen-lockfile
      
      - name: 运行测试
        run: pnpm run test

  # 构建（等待 lint 和 test 完成）
  build:
    name: 构建项目
    needs: [lint, test]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: 安装 pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}
      
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'
      
      - name: 安装依赖
        run: pnpm install --frozen-lockfile
      
      - name: 构建项目
        run: pnpm run build
      
      - name: 上传构建产物
        uses: actions/upload-artifact@v3
        with:
          name: build-artifacts
          path: dist
          retention-days: 7

  # 部署（只在 main 分支）
  deploy:
    name: 部署到服务器
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - uses: actions/checkout@v3
      
      - name: 下载构建产物
        uses: actions/download-artifact@v3
        with:
          name: build-artifacts
      
      - name: 配置 SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/deploy_key
          chmod 600 ~/.ssh/deploy_key
          ssh-keyscan -H ${{ secrets.SSH_HOST }} >> ~/.ssh/known_hosts
      
      - name: 部署到服务器
        run: |
          scp -i ~/.ssh/deploy_key -r dist/* ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:${{ secrets.DEPLOY_PATH }}
          ssh -i ~/.ssh/deploy_key ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} "cd ${{ secrets.DEPLOY_PATH }} && pm2 restart my-app || echo 'PM2 未运行'"
      
      - name: 发送部署通知
        if: always()
        run: |
          STATUS="${{ job.status }}"
          if [ "$STATUS" == "success" ]; then
            STATUS_TEXT="✅ 部署成功"
          else
            STATUS_TEXT="❌ 部署失败"
          fi
          
          curl -X POST "${{ secrets.DINGTALK_WEBHOOK }}" \
            -H 'Content-Type: application/json' \
            -d "{
              \"msgtype\": \"markdown\",
              \"markdown\": {
                \"title\": \"部署通知\",
                \"text\": \"## 部署通知\n\n**项目**: ${{ github.repository }}\n\n**状态**: $STATUS_TEXT\n\n**分支**: ${{ github.ref }}\n\n**提交**: ${{ github.event.head_commit.message }}\n\n**时间**: $(date '+%Y-%m-%d %H:%M:%S')\n\n[查看详情](${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }})\"
              }
            }"
```

## 实践检查清单

完成所有任务后，检查以下内容：

- [ ] SSH 密钥配置完成，可以安全连接服务器
- [ ] Shell 部署脚本编写完成，功能正常
- [ ] Node.js 部署脚本编写完成，功能正常
- [ ] GitHub Actions 工作流配置完成，可以正常触发
- [ ] Pipeline 优化措施已实施（并行、缓存、条件跳过等）
- [ ] 部署时间缩短至少 30%
- [ ] 部署通知配置完成，可以正常接收通知
- [ ] 优化总结文档已编写，包含前后对比数据

## 常见问题排查

### 问题1: SSH 连接失败

**症状**: GitHub Actions 中 SSH 连接失败

**排查步骤**:
1. 检查 SSH_PRIVATE_KEY 是否正确配置（包括 BEGIN/END 行）
2. 检查服务器公钥是否正确添加
3. 检查 SSH_HOST 和 SSH_USER 是否正确
4. 检查服务器防火墙是否开放 SSH 端口

**解决方案**:
```bash
# 在本地测试 SSH 连接
ssh -i ~/.ssh/deploy_key user@your-server.com

# 检查服务器 SSH 日志
tail -f /var/log/auth.log
```

### 问题2: 构建时间没有减少

**症状**: 实施优化措施后，构建时间没有明显减少

**排查步骤**:
1. 检查缓存是否生效（查看 GitHub Actions 日志中的 "Cache hit"）
2. 检查并行任务是否真正并行执行
3. 检查是否有其他瓶颈（如网络速度）

**解决方案**:
```yaml
# 确保缓存 key 正确
- uses: actions/cache@v3
  with:
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    # 确保 hashFiles 匹配实际文件
```

### 问题3: 部署脚本执行失败

**症状**: 部署脚本在服务器上执行失败

**排查步骤**:
1. 检查脚本权限（`chmod +x deploy.sh`）
2. 检查脚本中的路径是否正确
3. 检查服务器环境（Node.js 版本、npm 版本等）

**解决方案**:
```bash
# 添加调试输出
set -x  # 显示执行的命令

# 检查环境
node --version
npm --version
```

## 扩展学习

### 推荐资源

1. **GitHub Actions 官方文档**
   - https://docs.github.com/en/actions

2. **SSH 最佳实践**
   - https://www.ssh.com/academy/ssh/key

3. **CI/CD 优化技巧**
   - https://github.com/features/actions

4. **Shell 脚本教程**
   - https://www.shellscript.sh/

5. **Node.js 部署最佳实践**
   - https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

### 进阶主题

1. **多环境部署**
   - 开发、测试、生产环境的自动化部署
   - 环境隔离和配置管理

2. **容器化部署**
   - Docker 镜像构建和推送
   - Kubernetes 部署

3. **蓝绿部署和滚动更新**
   - 零停机部署策略
   - 流量切换和回滚

4. **监控和告警**
   - 部署状态监控
   - 性能指标监控
   - 自动告警机制

## 总结

通过本日学习，你应该掌握：

1. **SSH 部署配置**: 安全地配置 SSH 密钥，实现自动化部署
2. **部署脚本编写**: 使用 Shell 和 Node.js 编写灵活的部署脚本
3. **Pipeline 优化**: 通过并行、缓存、条件跳过等技巧显著缩短部署时间
4. **部署通知**: 配置多种通知方式，及时了解部署状态
5. **性能优化**: 分析和优化 Pipeline，实现快速迭代部署

**核心目标达成**: 将 Pipeline 部署时间缩短至少 30%，实现快速迭代部署能力。

下一步建议：继续学习 Docker 容器化部署（Day 12-13），进一步提升部署效率和可移植性。

