# Day 10: CI/CD 基础和实践 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 理解 CI/CD 的基本概念和工作流程
- 掌握 GitHub Actions 工作流语法（workflow、job、step）
- 能够创建完整的 CI 工作流（构建、测试）
- 掌握环境变量和密钥的安全管理
- 理解并实现条件执行和矩阵构建
- 掌握构建缓存策略，优化构建时间
- 实现多环境构建（dev、staging、prod）
- 理解并发构建和依赖管理的最佳实践

## 学习时间分配

- **理论学习**: 2-2.5 小时
- **实践操作**: 3-4 小时
- **问题排查和优化**: 30 分钟
- **总结和文档**: 30 分钟

## 核心知识点

### 1. CI/CD 基础概念

#### 1.1 CI/CD 是什么

**CI (Continuous Integration) - 持续集成**
- 开发者频繁地将代码合并到主分支
- 每次合并后自动触发构建和测试
- 快速发现和修复问题
- 保证代码质量

**CD (Continuous Deployment/Delivery) - 持续部署/交付**
- **持续交付**: 自动构建、测试，准备好部署，但需要手动触发
- **持续部署**: 自动构建、测试后自动部署到生产环境

**CI/CD 的价值**
- 提高开发效率
- 减少人为错误
- 快速反馈问题
- 支持快速迭代

#### 1.2 GitHub Actions 简介

**GitHub Actions 是什么**
- GitHub 提供的 CI/CD 平台
- 基于 YAML 配置文件
- 免费额度：私有仓库每月 2000 分钟，公开仓库无限制
- 支持多种操作系统和编程语言

**GitHub Actions 核心概念**
- **Workflow（工作流）**: 一个 YAML 文件，定义完整的 CI/CD 流程
- **Job（作业）**: 工作流中的一组步骤，在同一个运行器中执行
- **Step（步骤）**: 作业中的单个任务，可以是命令或 action
- **Action（动作）**: 可复用的任务单元，可以来自 GitHub Marketplace
- **Runner（运行器）**: 执行作业的机器，可以是 GitHub 托管或自托管

**工作流文件位置**
- 必须放在 `.github/workflows/` 目录下
- 文件扩展名：`.yml` 或 `.yaml`
- 可以创建多个工作流文件

### 2. GitHub Actions 工作流语法

#### 2.1 基本结构

```yaml
# .github/workflows/ci.yml
name: CI 工作流名称

# 触发条件
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  # 手动触发
  workflow_dispatch:
    inputs:
      environment:
        description: '部署环境'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

# 环境变量（全局）
env:
  NODE_VERSION: '18.x'
  REGISTRY: ghcr.io

# 工作流配置
jobs:
  build:
    name: 构建作业
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 代码
        uses: actions/checkout@v3
      
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ env.NODE_VERSION }}
      
      - name: 安装依赖
        run: npm install
      
      - name: 运行测试
        run: npm test
      
      - name: 构建项目
        run: npm run build
```

#### 2.2 触发条件（on）

**Push 事件**
```yaml
on:
  push:
    branches:
      - main
      - develop
    tags:
      - 'v*'
    paths:
      - 'src/**'
      - 'package.json'
    paths-ignore:
      - 'docs/**'
      - '*.md'
```

**Pull Request 事件**
```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
    branches:
      - main
```

**定时触发（Cron）**
```yaml
on:
  schedule:
    # UTC 时间，每天凌晨 2 点执行
    - cron: '0 2 * * *'
```

**多事件触发**
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:
```

#### 2.3 Jobs（作业）配置

**基本 Job 配置**
```yaml
jobs:
  build:
    name: 构建项目
    runs-on: ubuntu-latest  # 运行器：ubuntu-latest, windows-latest, macos-latest
    
    # Job 级别的环境变量
    env:
      BUILD_ENV: production
    
    # 作业超时时间（分钟）
    timeout-minutes: 30
    
    # 条件执行
    if: github.ref == 'refs/heads/main'
    
    # 步骤
    steps:
      - name: Step 1
        run: echo "Hello"
```

**并行作业**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
  
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
```

**作业依赖**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
    outputs:
      version: ${{ steps.version.outputs.version }}
  
  deploy:
    needs: build  # 依赖 build 作业
    runs-on: ubuntu-latest
    steps:
      - name: 部署
        run: echo "部署版本: ${{ needs.build.outputs.version }}"
```

#### 2.4 Steps（步骤）配置

**运行命令**
```yaml
steps:
  - name: 安装依赖
    run: |
      npm install
      npm run build
```

**使用 Action**
```yaml
steps:
  - name: Checkout 代码
    uses: actions/checkout@v3
  
  - name: 设置 Node.js
    uses: actions/setup-node@v3
    with:
      node-version: '18'
      cache: 'npm'
  
  - name: 运行测试
    uses: actions/setup-node@v3
    with:
      node-version: '18'
    run: npm test
```

**步骤条件执行**
```yaml
steps:
  - name: 构建
    if: github.ref == 'refs/heads/main'
    run: npm run build
  
  - name: 测试
    if: failure()  # 只有前面的步骤失败时才执行
    run: echo "测试失败"
  
  - name: 部署
    if: success() && github.ref == 'refs/heads/main'
    run: npm run deploy
```

**步骤输出**
```yaml
steps:
  - name: 设置版本
    id: version
    run: |
      echo "version=v1.0.0" >> $GITHUB_OUTPUT
  
  - name: 使用版本
    run: echo "版本: ${{ steps.version.outputs.version }}"
```

### 3. 构建和测试流程

#### 3.1 前端项目构建流程

**完整的构建流程**
```yaml
jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      # 1. 检出代码
      - name: Checkout 代码
        uses: actions/checkout@v3
      
      # 2. 设置 Node.js 环境
      - name: 设置 Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'  # 自动缓存 node_modules
      
      # 3. 安装依赖
      - name: 安装依赖
        run: npm ci  # ci 比 install 更快，适合 CI 环境
      
      # 4. 代码检查
      - name: ESLint 检查
        run: npm run lint
        continue-on-error: true  # 即使失败也继续
      
      # 5. 类型检查（TypeScript）
      - name: TypeScript 类型检查
        run: npm run type-check
        if: ${{ env.NODE_ENV != 'skip' }}
      
      # 6. 运行测试
      - name: 运行单元测试
        run: npm run test:unit
      
      # 7. 运行 E2E 测试（可选）
      - name: 运行 E2E 测试
        run: npm run test:e2e
        if: github.event_name == 'pull_request'
      
      # 8. 构建项目
      - name: 构建项目
        run: npm run build
        env:
          NODE_ENV: production
      
      # 9. 上传构建产物
      - name: 上传构建产物
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
          retention-days: 7
```

#### 3.2 测试流程优化

**并行测试**
```yaml
jobs:
  test:
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

**测试覆盖率**
```yaml
steps:
  - name: 运行测试并生成覆盖率
    run: npm run test:coverage
  
  - name: 上传覆盖率报告
    uses: codecov/codecov-action@v3
    with:
      file: ./coverage/lcov.info
      flags: unittests
      name: codecov-umbrella
```

### 4. 环境变量和密钥管理

#### 4.1 环境变量配置

**工作流级别的环境变量**
```yaml
env:
  NODE_ENV: production
  API_URL: https://api.example.com

jobs:
  build:
    runs-on: ubuntu-latest
    env:
      BUILD_ENV: staging  # Job 级别的环境变量
    steps:
      - name: 使用环境变量
        run: |
          echo "NODE_ENV: ${{ env.NODE_ENV }}"
          echo "API_URL: ${{ env.API_URL }}"
          echo "BUILD_ENV: ${{ env.BUILD_ENV }}"
```

**步骤级别的环境变量**
```yaml
steps:
  - name: 构建
    env:
      VITE_API_URL: ${{ secrets.API_URL }}
      VITE_APP_VERSION: ${{ github.sha }}
    run: npm run build
```

#### 4.2 Secrets（密钥）管理

**Secrets 的作用**
- 存储敏感信息（API 密钥、密码、令牌等）
- 在日志中自动隐藏
- 只有仓库管理员可以管理

**设置 Secrets**
1. 进入仓库 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 输入名称和值
4. 保存

**使用 Secrets**
```yaml
steps:
  - name: 部署到服务器
    env:
      DEPLOY_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
      SERVER_HOST: ${{ secrets.SERVER_HOST }}
      SERVER_USER: ${{ secrets.SERVER_USER }}
    run: |
      echo "$DEPLOY_KEY" > deploy_key
      chmod 600 deploy_key
      ssh -i deploy_key $SERVER_USER@$SERVER_HOST "deploy.sh"
```

**环境级别的 Secrets**
```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production  # 使用环境级别的 secrets
    steps:
      - name: 部署
        run: echo "使用 production 环境的 secrets"
```

**常见 Secrets 示例**
- `NPM_TOKEN`: NPM 发布令牌
- `DOCKER_USERNAME`: Docker Hub 用户名
- `DOCKER_PASSWORD`: Docker Hub 密码
- `SSH_PRIVATE_KEY`: SSH 私钥
- `API_KEY`: API 密钥
- `DATABASE_URL`: 数据库连接字符串

#### 4.3 环境变量安全最佳实践

**安全原则**
- ✅ 敏感信息必须使用 Secrets
- ✅ 不要在代码中硬编码密钥
- ✅ 定期轮换密钥
- ✅ 最小权限原则
- ❌ 不要在日志中输出敏感信息
- ❌ 不要将 Secrets 提交到代码仓库

**检查 Secrets 是否泄露**
```yaml
steps:
  - name: 检查 Secrets 泄露
    run: |
      if grep -r "${{ secrets.API_KEY }}" .; then
        echo "错误：Secrets 泄露到代码中"
        exit 1
      fi
```

### 5. 条件执行和矩阵构建

#### 5.1 条件执行

**条件表达式语法**
```yaml
if: <expression>
```

**常用条件**
```yaml
steps:
  - name: 主分支构建
    if: github.ref == 'refs/heads/main'
    run: npm run build
  
  - name: 标签构建
    if: startsWith(github.ref, 'refs/tags/')
    run: npm run build:release
  
  - name: PR 构建
    if: github.event_name == 'pull_request'
    run: npm run build:pr
  
  - name: 文件变更检查
    if: contains(github.event.head_commit.modified, 'package.json')
    run: npm install
  
  - name: 失败后执行
    if: failure()
    run: echo "构建失败"
  
  - name: 成功后执行
    if: success()
    run: echo "构建成功"
  
  - name: 总是执行
    if: always()
    run: echo "清理工作"
```

**条件函数**
- `success()`: 前面的步骤都成功
- `failure()`: 前面的步骤失败
- `cancelled()`: 工作流被取消
- `always()`: 总是执行

#### 5.2 矩阵构建（Matrix Strategy）

**矩阵构建的作用**
- 在多个配置下并行运行作业
- 减少重复配置
- 提高测试覆盖率

**基本矩阵构建**
```yaml
jobs:
  build:
    strategy:
      matrix:
        node-version: [16, 18, 20]
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - run: npm ci
      - run: npm test
```

**排除特定组合**
```yaml
strategy:
  matrix:
    node-version: [16, 18, 20]
    os: [ubuntu-latest, windows-latest]
    exclude:
      - node-version: 16
        os: windows-latest
```

**包含特定组合**
```yaml
strategy:
  matrix:
    node-version: [18, 20]
    os: [ubuntu-latest]
    include:
      - node-version: 16
        os: ubuntu-latest
        experimental: true
```

**动态矩阵**
```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set-matrix.outputs.matrix }}
    steps:
      - id: set-matrix
        run: |
          echo 'matrix=[{"node":"18"},{"node":"20"}]' >> $GITHUB_OUTPUT
  
  build:
    needs: setup
    strategy:
      matrix: ${{ fromJSON(needs.setup.outputs.matrix) }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node }}
```

**矩阵构建最佳实践**
- 避免创建过多的矩阵组合（会消耗大量运行时间）
- 使用 `fail-fast: false` 让所有组合都执行完成
- 合理使用 exclude 和 include

### 6. 缓存策略（actions/cache）

#### 6.1 缓存的作用

**为什么需要缓存**
- 依赖安装耗时（npm install、pip install 等）
- 构建产物可以复用
- 减少 CI/CD 运行时间
- 节省计算资源

**GitHub Actions Cache 特点**
- 每个缓存条目最大 10GB
- 7 天内未使用自动删除
- 支持分支级别的缓存
- 支持全局缓存

#### 6.2 基本缓存配置

**Node.js 项目缓存**
```yaml
steps:
  - name: Checkout 代码
    uses: actions/checkout@v3
  
  - name: 缓存 Node 模块
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
```

**缓存参数说明**
- `path`: 要缓存的路径（可以是多个）
- `key`: 缓存的唯一标识符
- `restore-keys`: 备用缓存键（用于部分匹配）

#### 6.3 不同类型项目的缓存

**npm/yarn/pnpm 缓存**
```yaml
# npm
- uses: actions/cache@v3
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-

# yarn
- uses: actions/cache@v3
  with:
    path: |
      ~/.yarn/cache
      ~/.yarn/berry/cache
    key: ${{ runner.os }}-yarn-${{ hashFiles('**/yarn.lock') }}
    restore-keys: |
      ${{ runner.os }}-yarn-

# pnpm
- uses: actions/cache@v3
  with:
    path: ~/.pnpm-store
    key: ${{ runner.os }}-pnpm-${{ hashFiles('**/pnpm-lock.yaml') }}
    restore-keys: |
      ${{ runner.os }}-pnpm-
```

**Python 项目缓存**
```yaml
- uses: actions/cache@v3
  with:
    path: ~/.cache/pip
    key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
    restore-keys: |
      ${{ runner.os }}-pip-
```

**Docker 镜像缓存**
```yaml
- name: 设置 Docker Buildx
  uses: docker/setup-buildx-action@v2
  
- name: 构建 Docker 镜像（使用缓存）
  uses: docker/build-push-action@v4
  with:
    context: .
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

#### 6.4 缓存策略优化

**精准缓存键**
```yaml
# 基于文件哈希的缓存键
key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}

# 基于环境变量的缓存键
key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}-${{ env.NODE_ENV }}

# 多层缓存键
restore-keys: |
  ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
  ${{ runner.os }}-node-
  ${{ runner.os }}-
```

**缓存失效策略**
```yaml
# 当 package.json 变化时，缓存失效
key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json', '**/package.json') }}
```

**缓存大小限制**
- 单个缓存条目最大 10GB
- 整个仓库所有缓存总和没有明确限制
- 建议定期清理不需要的缓存

### 7. 并发构建和依赖管理

#### 7.1 并发控制

**并发作业限制**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    concurrency:
      group: build-${{ github.ref }}
      cancel-in-progress: true  # 取消之前正在运行的作业
    steps:
      - run: npm run build
```

**并发组的作用**
- `group`: 并发组的名称
- `cancel-in-progress`: 新的作业开始时，取消同组的旧作业
- 适用于 PR 场景：新提交时取消旧构建

#### 7.2 作业依赖管理

**顺序执行**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
  
  test:
    needs: lint  # 等待 lint 完成
    runs-on: ubuntu-latest
    steps:
      - run: npm test
  
  build:
    needs: [lint, test]  # 等待 lint 和 test 都完成
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

**并行执行**
```yaml
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - run: npm run lint
  
  test:
    runs-on: ubuntu-latest  # 不需要 needs，会并行执行
    steps:
      - run: npm test
  
  build:
    needs: [lint, test]  # 等待两个都完成
    runs-on: ubuntu-latest
    steps:
      - run: npm run build
```

**条件依赖**
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    outputs:
      should-deploy: ${{ steps.check.outputs.deploy }}
    steps:
      - id: check
        run: echo "deploy=true" >> $GITHUB_OUTPUT
  
  deploy:
    needs: build
    if: needs.build.outputs.should-deploy == 'true'
    runs-on: ubuntu-latest
    steps:
      - run: echo "部署"
```

#### 7.3 依赖安装优化

**使用 npm ci 而非 npm install**
```yaml
steps:
  - name: 安装依赖
    run: npm ci  # 更快、更可靠，适合 CI 环境
```

**npm ci 的优势**
- 基于 package-lock.json 精确安装
- 删除 node_modules 后重新安装（确保一致性）
- 更快（跳过依赖解析）
- 禁止修改 package.json

**pnpm 缓存优化**
```yaml
steps:
  - name: 安装 pnpm
    uses: pnpm/action-setup@v2
    with:
      version: 8
      run_install: false
  
  - name: 获取 pnpm 存储目录
    shell: bash
    run: |
      echo "STORE_PATH=$(pnpm store path --silent)" >> $GITHUB_ENV
  
  - name: 设置 pnpm 缓存
    uses: actions/cache@v3
    with:
      path: ${{ env.STORE_PATH }}
      key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
      restore-keys: |
        ${{ runner.os }}-pnpm-store-
  
  - name: 安装依赖
    run: pnpm install --frozen-lockfile
```

## 实践任务

### 任务 1: 创建基础 CI 工作流

**目标**: 创建一个完整的 CI 工作流，包含代码检查、测试和构建

**步骤**:

1. **创建工作流文件**
   ```bash
   mkdir -p .github/workflows
   touch .github/workflows/ci.yml
   ```

2. **编写基础 CI 配置**
   ```yaml
   name: CI
   
   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]
   
   jobs:
     ci:
       runs-on: ubuntu-latest
       
       steps:
         - name: Checkout 代码
           uses: actions/checkout@v3
         
         - name: 设置 Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: 安装依赖
           run: npm ci
         
         - name: ESLint 检查
           run: npm run lint
         
         - name: 运行测试
           run: npm test
         
         - name: 构建项目
           run: npm run build
           env:
             NODE_ENV: production
   ```

3. **提交并推送**
   ```bash
   git add .github/workflows/ci.yml
   git commit -m "feat: 添加 CI 工作流"
   git push
   ```

4. **验证工作流**
   - 访问 GitHub 仓库的 Actions 标签页
   - 查看工作流是否成功运行
   - 检查各个步骤的执行情况

**预期结果**:
- 工作流成功运行
- 代码检查、测试、构建都通过
- 能够看到详细的执行日志

### 任务 2: 配置环境变量和密钥

**目标**: 学习如何安全地管理环境变量和密钥

**步骤**:

1. **设置 Secrets**
   - 进入仓库 Settings → Secrets and variables → Actions
   - 添加以下 Secrets（示例值）:
     - `NPM_TOKEN`: npm 发布令牌
     - `API_KEY`: API 密钥
     - `DEPLOY_SSH_KEY`: SSH 私钥

2. **在工作流中使用 Secrets**
   ```yaml
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: 使用 Secrets
           env:
             NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
             API_KEY: ${{ secrets.API_KEY }}
           run: |
             echo "NPM_TOKEN 已设置（但不会显示在日志中）"
             npm config set //registry.npmjs.org/:_authToken $NPM_TOKEN
   ```

3. **测试 Secrets 的安全性**
   - 运行工作流
   - 检查日志，确认 Secrets 值没有显示出来
   - 尝试在日志中输出 Secrets（应该被隐藏）

**预期结果**:
- Secrets 正确设置并在工作流中使用
- Secrets 值不会在日志中显示
- 理解 Secrets 的安全机制

### 任务 3: 实现多环境构建

**目标**: 实现 dev、staging、prod 三个环境的构建配置

**步骤**:

1. **创建多环境构建工作流**
   ```yaml
   name: 多环境构建
   
   on:
     workflow_dispatch:
       inputs:
         environment:
           description: '构建环境'
           required: true
           type: choice
           options:
             - dev
             - staging
             - production
   
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: 设置 Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
         
         - name: 安装依赖
           run: npm ci
         
         - name: 构建项目
           env:
             NODE_ENV: ${{ inputs.environment }}
             VITE_API_URL: ${{ secrets[format('API_URL_{0}', inputs.environment)] }}
           run: |
             echo "构建环境: ${{ inputs.environment }}"
             npm run build
         
         - name: 上传构建产物
           uses: actions/upload-artifact@v3
           with:
             name: dist-${{ inputs.environment }}
             path: dist/
   ```

2. **配置不同环境的 Secrets**
   - `API_URL_DEV`: 开发环境 API 地址
   - `API_URL_STAGING`: 预发布环境 API 地址
   - `API_URL_PRODUCTION`: 生产环境 API 地址

3. **测试多环境构建**
   - 手动触发工作流
   - 选择不同的环境
   - 验证构建产物是否正确

**预期结果**:
- 能够手动选择环境进行构建
- 不同环境使用不同的配置
- 构建产物正确生成

### 任务 4: 配置构建缓存

**目标**: 配置缓存策略，优化构建时间

**步骤**:

1. **配置依赖缓存**
   ```yaml
   steps:
     - uses: actions/checkout@v3
     
     - name: 设置 Node.js
       uses: actions/setup-node@v3
       with:
         node-version: '18'
         cache: 'npm'  # 自动缓存 node_modules
     
     - name: 安装依赖
       run: npm ci
   ```

2. **配置构建产物缓存**
   ```yaml
   steps:
     - name: 缓存构建产物
       uses: actions/cache@v3
       with:
         path: |
           dist
           .next
           node_modules/.cache
         key: ${{ runner.os }}-build-${{ github.sha }}
         restore-keys: |
           ${{ runner.os }}-build-
     
     - name: 构建项目
       run: npm run build
   ```

3. **对比缓存效果**
   - 第一次运行：记录构建时间（无缓存）
   - 第二次运行：记录构建时间（有缓存）
   - 计算时间节省百分比

4. **优化缓存策略**
   ```yaml
   - name: 缓存依赖
     uses: actions/cache@v3
     with:
       path: |
         node_modules
         ~/.npm
       key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
       restore-keys: |
         ${{ runner.os }}-node-
   
   - name: 缓存构建工具
     uses: actions/cache@v3
     with:
       path: |
         .cache
         .turbo
       key: ${{ runner.os }}-cache-${{ github.sha }}
       restore-keys: |
         ${{ runner.os }}-cache-
   ```

**预期结果**:
- 依赖安装时间显著减少（缓存命中时）
- 构建时间有所优化
- 理解缓存的工作原理和最佳实践

### 任务 5: 完整 CI 工作流实践

**目标**: 创建一个完整的、生产级别的 CI 工作流

**步骤**:

1. **创建完整的 CI 工作流**
   ```yaml
   name: 完整 CI 工作流
   
   on:
     push:
       branches: [ main, develop ]
     pull_request:
       branches: [ main ]
   
   env:
     NODE_VERSION: '18'
   
   jobs:
     lint:
       name: 代码检查
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: ${{ env.NODE_VERSION }}
             cache: 'npm'
         - run: npm ci
         - run: npm run lint
     
     test:
       name: 运行测试
       runs-on: ubuntu-latest
       strategy:
         matrix:
           node-version: [16, 18, 20]
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: ${{ matrix.node-version }}
             cache: 'npm'
         - run: npm ci
         - run: npm test
         - name: 上传测试覆盖率
           uses: codecov/codecov-action@v3
           if: matrix.node-version == '18'
           with:
             file: ./coverage/lcov.info
     
     build:
       name: 构建项目
       runs-on: ubuntu-latest
       needs: [lint, test]
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: ${{ env.NODE_VERSION }}
             cache: 'npm'
         - run: npm ci
         - name: 构建项目
           run: npm run build
           env:
             NODE_ENV: production
         - name: 上传构建产物
           uses: actions/upload-artifact@v3
           with:
             name: dist
             path: dist/
             retention-days: 7
   ```

2. **添加条件执行**
   - 只有主分支才构建生产版本
   - PR 时只运行测试，不构建
   - 文件变更时跳过不必要的步骤

3. **优化并发执行**
   - lint 和 test 并行执行
   - build 等待 lint 和 test 完成

**预期结果**:
- 工作流结构清晰，逻辑合理
- 充分利用并行执行
- 构建时间得到优化

## 常见问题排查

### 问题 1: 工作流不触发

**可能原因**:
- 文件路径不正确（必须在 `.github/workflows/` 目录）
- YAML 语法错误
- 触发条件配置错误

**排查步骤**:
1. 检查文件路径和名称
2. 使用 YAML 验证工具检查语法
3. 查看 GitHub Actions 的触发日志

### 问题 2: Secrets 未生效

**可能原因**:
- Secrets 名称拼写错误
- 环境变量作用域错误
- Secrets 未正确设置

**排查步骤**:
1. 检查 Secrets 名称是否完全匹配
2. 确认 Secrets 已在仓库中设置
3. 检查环境变量作用域（工作流/作业/步骤）

### 问题 3: 缓存未生效

**可能原因**:
- 缓存键配置错误
- 缓存路径不正确
- 缓存已过期

**排查步骤**:
1. 检查缓存键的生成逻辑
2. 确认缓存路径存在
3. 查看 Actions 日志中的缓存信息

### 问题 4: 构建时间过长

**优化建议**:
- 使用缓存减少依赖安装时间
- 并行执行独立的任务
- 使用更快的运行器（如自托管运行器）
- 优化构建脚本，减少不必要的步骤

### 问题 5: 矩阵构建失败

**可能原因**:
- 某些组合不兼容
- 资源不足
- 超时

**解决方案**:
- 使用 `exclude` 排除不兼容的组合
- 增加超时时间
- 使用 `fail-fast: false` 让所有组合都执行

## 学习检查清单

完成本日学习后，检查以下内容：

- [ ] 理解 CI/CD 的基本概念和工作流程
- [ ] 能够创建基本的 GitHub Actions 工作流
- [ ] 掌握工作流语法（workflow、job、step）
- [ ] 能够配置环境变量和 Secrets
- [ ] 理解条件执行和矩阵构建
- [ ] 能够配置和使用缓存
- [ ] 实现了多环境构建
- [ ] 理解作业依赖和并发控制
- [ ] 完成了所有实践任务
- [ ] 记录了学习笔记和遇到的问题
- [ ] 对比了缓存前后的构建时间

## 延伸学习

### 推荐的 Actions

**常用 Actions**
- `actions/checkout@v3`: 检出代码
- `actions/setup-node@v3`: 设置 Node.js 环境
- `actions/cache@v3`: 缓存管理
- `actions/upload-artifact@v3`: 上传构建产物
- `actions/download-artifact@v3`: 下载构建产物
- `docker/setup-buildx-action@v2`: Docker 构建
- `docker/build-push-action@v4`: Docker 构建和推送

**探索 GitHub Marketplace**
- 访问 https://github.com/marketplace
- 搜索需要的功能
- 查看使用文档和示例

### 下一步学习

Day 11 将学习：
- SSH 部署配置
- 自动化部署脚本
- Pipeline 优化技巧
- 部署通知和监控

建议提前准备：
- 准备一台测试服务器（或使用云服务器）
- 配置 SSH 密钥
- 了解基本的 Shell 脚本

## 参考资源

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [GitHub Actions 工作流语法](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [GitHub Actions 示例](https://github.com/actions/starter-workflows)
- [GitHub Marketplace](https://github.com/marketplace)
- [CI/CD 最佳实践](https://docs.github.com/en/actions/guides/about-continuous-integration)

## 总结

Day 10 重点学习了 CI/CD 的基础知识和实践，包括：

1. **GitHub Actions 工作流语法**: 掌握了 workflow、job、step 的配置方法
2. **构建和测试流程**: 学会了创建完整的 CI 工作流
3. **环境变量和密钥管理**: 理解了安全地管理敏感信息的方法
4. **条件执行和矩阵构建**: 实现了灵活的构建策略
5. **缓存策略**: 优化了构建时间，提升了 CI/CD 效率
6. **并发构建和依赖管理**: 优化了作业执行顺序和依赖安装

通过实践任务，你应该已经：
- 创建了完整的 CI 工作流
- 配置了环境变量和 Secrets
- 实现了多环境构建
- 优化了构建缓存

这些知识为 Day 11 的 Pipeline 优化和自动化部署打下了坚实基础。

