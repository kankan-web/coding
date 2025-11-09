# Day 13: Docker 优化和部署实践 - 详细学习计划

## 学习目标

- 掌握 Docker 多阶段构建优化，将镜像大小减少至少50%
- 理解镜像分层和缓存机制，优化构建速度
- 掌握 Docker BuildKit 加速构建
- 实践 Docker 网络和卷管理
- 集成 Docker 到 CI/CD 流程
- 了解镜像安全扫描

## 核心知识点

### 1. 多阶段构建优化

**原理**：

- 多阶段构建允许在 Dockerfile 中使用多个 FROM 指令
- 每个阶段可以使用不同的基础镜像
- 只将最终需要的文件复制到最终镜像中

**关键要点**：

- 构建阶段：使用完整的构建工具（node:18、包含构建依赖）
- 运行阶段：使用精简的基础镜像（alpine、distroless）
- 只复制必要的文件到最终镜像

**优化效果**：

- 减少镜像大小（通常可减少 60-80%）
- 提高安全性（减少攻击面）
- 加快镜像拉取速度

### 2. 镜像分层和缓存优化

**Docker 层缓存机制**：

- Docker 会缓存每一层的构建结果
- 如果 Dockerfile 某一行没有变化，会复用缓存
- 缓存失效：指令或依赖文件发生变化

**优化策略**：

**a) 层缓存策略**：

- 将变化频率低的指令放在前面（如安装依赖）
- 将变化频率高的指令放在后面（如复制源代码）
- 合并相关操作到同一层（减少层数）

**b) .dockerignore 文件配置**：

- 排除不需要的文件（node_modules、.git、测试文件）
- 减少构建上下文大小
- 加快构建速度

**c) 构建顺序优化**：

- 先安装系统依赖，再安装应用依赖
- 先复制依赖文件（package.json），再安装依赖
- 最后复制源代码（最常变化的部分）

### 3. 镜像大小优化技巧

**a) 使用 Alpine 基础镜像**：

- Alpine Linux 体积小（~5MB）
- 使用 `node:18-alpine` 替代 `node:18`
- 注意：某些包可能需要额外安装编译工具

**b) 合并 RUN 命令**：

- 减少镜像层数
- 使用 `&&` 连接多个命令
- 清理临时文件在同一层

**c) 清理构建缓存和临时文件**：

- 在安装后立即清理 apt/yum 缓存
- 删除不必要的文件
- 使用 `--no-cache` 标志（如果需要）

### 4. Docker BuildKit 加速构建

**BuildKit 特性**：

- 并行构建阶段
- 更好的缓存管理
- 增量构建支持

**启用方式**：

- 设置环境变量：`DOCKER_BUILDKIT=1`
- 使用 `docker buildx` 命令

### 5. Docker 网络和卷管理

**网络类型**：

- bridge：默认网络（容器间通信）
- host：使用主机网络
- none：无网络
- overlay：跨主机网络（Swarm）

**数据卷**：

- 命名卷（volumes）：Docker 管理的位置
- 绑定挂载（bind mounts）：主机文件系统
- 临时卷（tmpfs）：内存存储

### 6. Docker 与 CI/CD 集成

**GitHub Actions 集成**：

- 构建 Docker 镜像
- 推送到镜像仓库
- 部署到服务器

**优化点**：

- 使用缓存加速构建
- 只构建变更的镜像
- 并行构建多个服务

### 7. 镜像安全扫描

**工具**：

- Docker Scout（官方）
- Trivy
- Snyk

**扫描内容**：

- 已知漏洞
- 依赖包安全
- 配置安全问题

## 实战任务

### 任务 1: 基础 Dockerfile 编写（对比基准）

**目标**：创建一个基础的 Dockerfile，作为优化前的基准

**步骤**：

1. 创建基础 Dockerfile（单阶段构建）：
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

2. 构建镜像并记录大小：
```bash
docker build -t myapp:baseline .
docker images myapp:baseline
```

3. 记录构建时间

### 任务 2: 多阶段构建优化

**目标**：使用多阶段构建，将镜像大小减少至少50%

**步骤**：

1. 创建优化后的 Dockerfile（多阶段构建）：
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# 运行阶段
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

2. 进一步优化（使用 nginx 服务静态文件）：
```dockerfile
# 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

3. 构建并对比：
```bash
docker build -t myapp:optimized .
docker images myapp:baseline myapp:optimized
```

4. 计算优化比例

### 任务 3: .dockerignore 文件配置

**目标**：创建 .dockerignore 文件，优化构建上下文

**步骤**：

1. 创建 .dockerignore 文件：
```
node_modules
npm-debug.log
.git
.gitignore
.env
.env.local
.env.*.local
dist
build
coverage
.vscode
.idea
*.md
.DS_Store
```

2. 对比构建上下文大小：
```bash
# 查看构建上下文大小
docker build --progress=plain -t myapp:with-dockerignore .
```

### 任务 4: 构建顺序优化

**目标**：优化 Dockerfile 指令顺序，充分利用缓存

**优化前的 Dockerfile**：

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
```

**优化后的 Dockerfile**：

```dockerfile
FROM node:18-alpine
WORKDIR /app
# 先复制依赖文件（变化频率低）
COPY package*.json ./
# 安装依赖（会被缓存）
RUN npm ci --only=production
# 最后复制源代码（变化频率高）
COPY . .
RUN npm run build
```

**验证缓存效果**：

```bash
# 第一次构建（完整构建）
docker build -t myapp:cached .

# 修改源代码（不修改 package.json）
# 再次构建（应该使用缓存）
docker build -t myapp:cached .
```

### 任务 5: 使用 Alpine 基础镜像

**目标**：使用 Alpine 镜像进一步减小体积

**对比**：

```bash
# 标准镜像
FROM node:18
# 大小约：~900MB

# Alpine 镜像
FROM node:18-alpine
# 大小约：~180MB
```

### 任务 6: Docker BuildKit 加速构建

**目标**：启用 BuildKit，加速构建过程

**步骤**：

1. 启用 BuildKit：
```bash
export DOCKER_BUILDKIT=1
# 或
DOCKER_BUILDKIT=1 docker build .
```

2. 使用 buildx：
```bash
docker buildx build --platform linux/amd64,linux/arm64 -t myapp:multi .
```

3. 对比构建时间：
```bash
# 不使用 BuildKit
time docker build -t myapp:normal .

# 使用 BuildKit
time DOCKER_BUILDKIT=1 docker build -t myapp:buildkit .
```

### 任务 7: Docker 网络配置

**目标**：实践 Docker 网络配置

**步骤**：

1. 创建自定义网络：
```bash
docker network create mynetwork
```

2. 运行容器并连接到网络：
```bash
docker run -d --name app1 --network mynetwork myapp:optimized
docker run -d --name app2 --network mynetwork myapp:optimized
```

3. 容器间通信测试：
```bash
docker exec app1 ping app2
```

### 任务 8: Docker 数据卷管理

**目标**：配置 Docker 数据卷

**步骤**：

1. 创建命名卷：
```bash
docker volume create mydata
```

2. 使用卷运行容器：
```bash
docker run -d -v mydata:/app/data myapp:optimized
```

3. 使用绑定挂载：
```bash
docker run -d -v $(pwd)/data:/app/data myapp:optimized
```

### 任务 9: Docker Compose 多服务编排

**目标**：使用 Docker Compose 编排多个服务

**步骤**：

1. 创建 docker-compose.yml：
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:80"
    networks:
      - app-network
    volumes:
      - ./dist:/usr/share/nginx/html

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - app-network
    depends_on:
      - frontend

networks:
  app-network:
    driver: bridge

volumes:
  app-data:
```

2. 启动服务：
```bash
docker-compose up -d
```

3. 查看服务状态：
```bash
docker-compose ps
docker-compose logs
```

### 任务 10: CI/CD 集成 Docker 部署

**目标**：在 GitHub Actions 中集成 Docker 构建和部署

**步骤**：

1. 创建 .github/workflows/docker-deploy.yml：
```yaml
name: Docker Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2
      
      - name: Login to Docker Hub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}
      
      - name: Build and push
        uses: docker/build-push-action@v4
        with:
          context: .
          push: true
          tags: user/myapp:latest
          cache-from: type=registry,ref=user/myapp:latest
          cache-to: type=inline
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            docker pull user/myapp:latest
            docker stop myapp || true
            docker rm myapp || true
            docker run -d --name myapp -p 3000:80 user/myapp:latest
```

2. 配置 GitHub Secrets：

      - DOCKER_USERNAME
      - DOCKER_PASSWORD
      - HOST
      - USERNAME
      - SSH_KEY

3. 测试 CI/CD 流程

### 任务 11: 镜像安全扫描

**目标**：使用工具扫描镜像安全漏洞

**步骤**：

1. 使用 Docker Scout（Docker Desktop 内置）：
```bash
docker scout quickview myapp:optimized
docker scout cves myapp:optimized
```

2. 使用 Trivy：
```bash
# 安装 Trivy
brew install trivy  # macOS
# 或
docker run aquasec/trivy image myapp:optimized

# 扫描镜像
trivy image myapp:optimized
```

3. 修复发现的漏洞：

      - 更新基础镜像
      - 更新依赖包

### 任务 12: 编写 Docker 优化实践文档

**目标**：总结优化经验和最佳实践

**文档内容应包括**：

1. 优化前后对比数据（镜像大小、构建时间）
2. 优化策略总结
3. 遇到的问题和解决方案
4. 最佳实践清单
5. 后续优化建议

## 知识点总结

### Dockerfile 最佳实践清单

- [ ] 使用多阶段构建
- [ ] 使用 .dockerignore 文件
- [ ] 优化指令顺序（利用缓存）
- [ ] 使用 Alpine 基础镜像
- [ ] 合并 RUN 命令（减少层数）
- [ ] 清理构建缓存和临时文件
- [ ] 使用特定版本标签（避免 latest）
- [ ] 最小化镜像层数
- [ ] 使用非 root 用户运行
- [ ] 健康检查配置

### 性能优化检查清单

- [ ] 镜像大小减少 ≥50%
- [ ] 构建时间减少 ≥30%
- [ ] 启用 BuildKit 加速
- [ ] 配置构建缓存
- [ ] 优化构建上下文大小

### 安全优化检查清单

- [ ] 使用最小化基础镜像
- [ ] 定期更新基础镜像
- [ ] 扫描镜像漏洞
- [ ] 使用非 root 用户
- [ ] 最小化安装的软件包

## 常见问题排查

### 问题 1: 构建缓存失效

**原因**：指令顺序不当或依赖文件变化

**解决**：

- 检查 Dockerfile 指令顺序
- 确认 package.json 等依赖文件是否变化
- 使用 `--no-cache` 强制重新构建

### 问题 2: 镜像体积仍然很大

**原因**：包含了不必要的文件或使用了完整的基础镜像

**解决**：

- 检查 .dockerignore 文件
- 使用多阶段构建
- 使用 Alpine 基础镜像
- 清理构建缓存

### 问题 3: 构建速度慢

**原因**：没有充分利用缓存或构建上下文过大

**解决**：

- 优化 Dockerfile 指令顺序
- 配置 .dockerignore
- 启用 BuildKit
- 使用构建缓存

### 问题 4: 容器无法启动

**原因**：CMD 指令错误或端口配置问题

**解决**：

- 检查 CMD 指令是否正确
- 确认端口映射配置
- 查看容器日志：`docker logs <container-id>`

## 学习资源

- Docker 官方文档：https://docs.docker.com/
- Dockerfile 最佳实践：https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- BuildKit 文档：https://docs.docker.com/build/buildkit/
- Docker Compose 文档：https://docs.docker.com/compose/
- Trivy 文档：https://aquasecurity.github.io/trivy/

## 学习时间安排

- **理论学习**：1-2 小时
    - Docker 多阶段构建原理
    - 镜像分层和缓存机制
    - BuildKit 特性
- **实践操作**：3-4 小时
    - Dockerfile 优化实践
    - 构建和部署测试
    - CI/CD 集成
- **总结文档**：30 分钟
    - 优化对比数据
    - 最佳实践总结

## 验收标准

完成 Day 13 学习后，应达成以下目标：

1. ✅ 使用多阶段构建，镜像大小减少至少50%
2. ✅ 配置 .dockerignore，优化构建上下文
3. ✅ 优化 Dockerfile 指令顺序，充分利用缓存
4. ✅ 启用 BuildKit，构建时间明显减少
5. ✅ 能够使用 Docker Compose 编排多服务
6. ✅ 集成 Docker 到 CI/CD 流程
7. ✅ 完成镜像安全扫描
8. ✅ 编写完整的优化实践文档

