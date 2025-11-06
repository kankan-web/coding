# Day 12: Docker 基础和实践

## 📚 学习目标

通过今天的学习，你将能够：

1. **理解 Docker 核心概念**：镜像、容器、仓库的关系和区别
2. **掌握 Dockerfile 编写**：能够为前端项目编写规范的 Dockerfile
3. **熟练使用 Docker 命令**：构建、运行、管理容器和镜像
4. **掌握 Docker Compose**：能够编排多容器应用（前端 + Nginx）
5. **实践镜像推送**：能够将镜像推送到 Docker Hub 或私有仓库

## 🎯 核心知识点

### 1. Docker 概念和架构

#### 1.1 Docker 三大核心概念

**镜像（Image）**
- 只读的模板，用于创建容器
- 类似于面向对象中的类
- 可以基于其他镜像创建，形成层叠关系
- 镜像层是只读的，容器层是可写的

**容器（Container）**
- 镜像的运行实例
- 类似于面向对象中的对象实例
- 可以启动、停止、删除、移动
- 容器之间相互隔离，互不影响

**仓库（Repository）**
- 集中存放镜像的地方
- Docker Hub 是官方公共仓库
- 可以搭建私有仓库
- 仓库包含多个镜像标签（Tag）

#### 1.2 Docker 架构

```
Docker Client (CLI)
    ↓
Docker Daemon (守护进程)
    ↓
Docker Images (镜像层)
    ↓
Docker Containers (容器层)
```

**关键组件**：
- **Docker Client**：命令行工具，用于与 Docker 守护进程通信
- **Docker Daemon**：后台服务，负责构建、运行、分发容器
- **Docker Registry**：镜像仓库，存储镜像

#### 1.3 Docker vs 虚拟机

| 特性 | Docker | 虚拟机 |
|------|--------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 轻量级 | 较重 |
| 性能 | 接近原生 | 有损耗 |
| 隔离性 | 进程级隔离 | 系统级隔离 |
| 镜像大小 | MB级 | GB级 |

### 2. Dockerfile 编写最佳实践

#### 2.1 Dockerfile 基础语法

```dockerfile
# 注释
FROM <base_image>        # 指定基础镜像
WORKDIR <path>           # 设置工作目录
COPY <src> <dest>        # 复制文件
ADD <src> <dest>         # 复制文件（支持URL和解压）
RUN <command>            # 执行命令
EXPOSE <port>            # 暴露端口
ENV <key>=<value>        # 设置环境变量
CMD ["executable","param"]  # 容器启动命令
ENTRYPOINT ["executable","param"]  # 入口点
```

#### 2.2 前端项目 Dockerfile 最佳实践

**阶段一：构建阶段**
```dockerfile
# 使用 Node.js 官方镜像作为构建环境
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 pnpm-lock.yaml（利用缓存）
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用 pnpm，更快的安装速度）
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm build
```

**阶段二：生产阶段**
```dockerfile
# 使用 Nginx 作为生产服务器
FROM nginx:alpine

# 从构建阶段复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 2.3 Dockerfile 最佳实践要点

1. **使用多阶段构建**：减少最终镜像大小
2. **合理利用缓存**：先复制依赖文件，再复制源代码
3. **使用 .dockerignore**：排除不需要的文件
4. **使用 Alpine 镜像**：体积更小，安全性更高
5. **合并 RUN 命令**：减少镜像层数
6. **使用特定版本标签**：避免使用 latest
7. **设置非 root 用户**：提高安全性
8. **使用 WORKDIR**：而不是 RUN cd

#### 2.4 .dockerignore 文件

```dockerignore
# 依赖目录
node_modules
npm-debug.log
pnpm-debug.log

# 构建产物
dist
build
.next
out

# 版本控制
.git
.gitignore

# IDE 配置
.vscode
.idea

# 环境变量文件
.env
.env.local
.env.*.local

# 测试覆盖率
coverage
.nyc_output

# 日志文件
*.log
logs
```

### 3. Docker 常用命令

#### 3.1 镜像相关命令

```bash
# 查看本地镜像
docker images
docker image ls

# 搜索镜像
docker search <image_name>

# 拉取镜像
docker pull <image_name>:<tag>

# 构建镜像
docker build -t <image_name>:<tag> .

# 删除镜像
docker rmi <image_id>
docker image rm <image_id>

# 查看镜像详细信息
docker inspect <image_name>

# 查看镜像构建历史
docker history <image_name>
```

#### 3.2 容器相关命令

```bash
# 运行容器
docker run [OPTIONS] <image_name>
# 常用选项：
# -d: 后台运行
# -p: 端口映射
# -v: 数据卷挂载
# -e: 环境变量
# --name: 容器名称
# -it: 交互式终端

# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop <container_id>

# 启动容器
docker start <container_id>

# 重启容器
docker restart <container_id>

# 删除容器
docker rm <container_id>

# 查看容器日志
docker logs <container_id>

# 进入运行中的容器
docker exec -it <container_id> /bin/sh

# 查看容器详细信息
docker inspect <container_id>

# 查看容器资源使用情况
docker stats <container_id>
```

#### 3.3 实战示例

```bash
# 构建镜像
docker build -t my-frontend:v1.0 .

# 运行容器（后台运行，端口映射）
docker run -d -p 8080:80 --name my-frontend my-frontend:v1.0

# 查看日志
docker logs -f my-frontend

# 停止容器
docker stop my-frontend

# 删除容器
docker rm my-frontend

# 删除镜像
docker rmi my-frontend:v1.0
```

### 4. Docker Compose 多容器编排

#### 4.1 Docker Compose 概念

Docker Compose 是一个用于定义和运行多容器 Docker 应用的工具。通过一个 YAML 文件配置应用服务，然后使用一个命令即可创建和启动所有服务。

#### 4.2 docker-compose.yml 文件结构

```yaml
version: '3.8'

services:
  # 前端服务
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - nginx
    restart: unless-stopped

  # Nginx 服务
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
      - ./dist:/usr/share/nginx/html
    restart: unless-stopped

networks:
  default:
    name: frontend-network
```

#### 4.3 Docker Compose 常用命令

```bash
# 启动所有服务
docker-compose up

# 后台启动
docker-compose up -d

# 构建镜像并启动
docker-compose up --build

# 停止所有服务
docker-compose down

# 停止并删除容器、网络
docker-compose down -v

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs
docker-compose logs -f <service_name>

# 重启服务
docker-compose restart <service_name>

# 进入容器
docker-compose exec <service_name> /bin/sh

# 查看配置文件
docker-compose config
```

### 5. 镜像构建和推送

#### 5.1 构建镜像

```bash
# 基本构建
docker build -t my-frontend:v1.0 .

# 指定 Dockerfile
docker build -f Dockerfile.prod -t my-frontend:v1.0 .

# 构建参数
docker build --build-arg NODE_ENV=production -t my-frontend:v1.0 .

# 不使用缓存构建
docker build --no-cache -t my-frontend:v1.0 .
```

#### 5.2 推送镜像到 Docker Hub

**步骤一：登录 Docker Hub**
```bash
docker login
# 输入用户名和密码
```

**步骤二：标记镜像**
```bash
# 格式：docker tag <本地镜像> <Docker Hub用户名>/<镜像名>:<标签>
docker tag my-frontend:v1.0 username/my-frontend:v1.0
```

**步骤三：推送镜像**
```bash
docker push username/my-frontend:v1.0
```

**步骤四：验证**
访问 https://hub.docker.com/ 查看推送的镜像

#### 5.3 私有仓库配置

**使用阿里云容器镜像服务**：
```bash
# 登录阿里云镜像仓库
docker login --username=<阿里云用户名> registry.cn-hangzhou.aliyuncs.com

# 标记镜像
docker tag my-frontend:v1.0 registry.cn-hangzhou.aliyuncs.com/namespace/my-frontend:v1.0

# 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/namespace/my-frontend:v1.0
```

## 🛠️ 实战内容

### 实战一：为 Vue 3 项目编写 Dockerfile

#### 前置准备

1. **创建测试项目**（如果还没有）
```bash
# 使用 Vite 创建 Vue 3 项目
npm create vite@latest my-vue-app -- --template vue
cd my-vue-app
npm install
```

2. **创建 .dockerignore 文件**
```dockerignore
node_modules
dist
.git
.gitignore
.env.local
.env.*.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
.DS_Store
*.local
```

#### 步骤一：编写基础 Dockerfile

在项目根目录创建 `Dockerfile`：

```dockerfile
# 阶段一：构建阶段
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json（如果存在）
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production=false

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 阶段二：生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置文件（可选）
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 步骤二：构建镜像

```bash
# 构建镜像
docker build -t my-vue-app:v1.0 .

# 查看构建过程
# 观察每一层的构建时间
```

#### 步骤三：运行容器

```bash
# 运行容器
docker run -d -p 8080:80 --name my-vue-app my-vue-app:v1.0

# 访问应用
# 浏览器打开 http://localhost:8080
```

#### 步骤四：验证和调试

```bash
# 查看容器日志
docker logs my-vue-app

# 进入容器查看文件
docker exec -it my-vue-app /bin/sh
# 在容器内执行：ls -la /usr/share/nginx/html

# 查看容器资源使用
docker stats my-vue-app
```

### 实战二：优化 Dockerfile（使用 pnpm）

#### 优化后的 Dockerfile

```dockerfile
# 阶段一：构建阶段
FROM node:18-alpine AS builder

# 安装 pnpm
RUN npm install -g pnpm

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖（使用 pnpm，更快）
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建项目
RUN pnpm build

# 阶段二：生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### 对比构建时间

```bash
# 使用 npm 构建
time docker build -t my-vue-app:npm -f Dockerfile.npm .

# 使用 pnpm 构建
time docker build -t my-vue-app:pnpm -f Dockerfile.pnpm .

# 对比镜像大小
docker images | grep my-vue-app
```

### 实战三：使用 Docker Compose 编排前端 + Nginx

#### 步骤一：创建 Nginx 配置文件

创建 `nginx.conf`：

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

#### 步骤二：创建 docker-compose.yml

```yaml
version: '3.8'

services:
  # 前端应用
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: my-vue-app-frontend
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
    networks:
      - frontend-network

  # Nginx 反向代理（可选，如果需要额外的 Nginx 配置）
  nginx:
    image: nginx:alpine
    container_name: my-vue-app-nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - frontend
    restart: unless-stopped
    networks:
      - frontend-network

networks:
  frontend-network:
    driver: bridge
```

#### 步骤三：启动服务

```bash
# 构建并启动所有服务
docker-compose up --build -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 访问应用
# 浏览器打开 http://localhost:8080
```

#### 步骤四：管理服务

```bash
# 重启服务
docker-compose restart

# 停止服务
docker-compose stop

# 停止并删除容器、网络
docker-compose down

# 停止并删除容器、网络、卷
docker-compose down -v
```

### 实战四：推送镜像到 Docker Hub

#### 步骤一：准备 Docker Hub 账号

1. 访问 https://hub.docker.com/
2. 注册账号（如果没有）
3. 创建一个仓库（例如：`my-vue-app`）

#### 步骤二：登录和推送

```bash
# 登录 Docker Hub
docker login
# 输入用户名和密码

# 标记镜像（格式：用户名/仓库名:标签）
docker tag my-vue-app:v1.0 <your-username>/my-vue-app:v1.0

# 推送镜像
docker push <your-username>/my-vue-app:v1.0

# 推送 latest 标签
docker tag my-vue-app:v1.0 <your-username>/my-vue-app:latest
docker push <your-username>/my-vue-app:latest
```

#### 步骤三：验证和使用

```bash
# 删除本地镜像
docker rmi <your-username>/my-vue-app:v1.0

# 从 Docker Hub 拉取镜像
docker pull <your-username>/my-vue-app:v1.0

# 运行从 Hub 拉取的镜像
docker run -d -p 8080:80 <your-username>/my-vue-app:v1.0
```

### 实战五：React + Vite 项目 Docker 化

#### 步骤一：创建 Dockerfile

```dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package.json package-lock.json ./

# 安装依赖
RUN npm ci

# 复制源代码
COPY . .

# 构建项目
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 步骤二：创建 Nginx 配置（支持 React Router）

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    # React Router 支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /static {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 📝 需要关注的知识点

### 1. 镜像层和缓存机制

**理解镜像层**：
- 每个 Dockerfile 指令创建一个新层
- 层是只读的，容器层是可写的
- 层可以被缓存和复用

**缓存优化**：
```dockerfile
# ❌ 不好的做法：先复制源代码
COPY . .
RUN npm install

# ✅ 好的做法：先复制依赖文件，利用缓存
COPY package.json ./
RUN npm install
COPY . .
```

### 2. 多阶段构建的优势

**为什么使用多阶段构建**：
- 减少最终镜像大小
- 只包含运行时需要的文件
- 构建工具不会出现在最终镜像中

**对比示例**：
```dockerfile
# 单阶段构建（最终镜像包含 Node.js，体积大）
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install && npm run build
CMD ["npm", "start"]

# 多阶段构建（最终镜像只包含 Nginx，体积小）
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### 3. 端口映射和数据卷

**端口映射**：
```bash
# 格式：-p <宿主机端口>:<容器端口>
docker run -p 8080:80 my-app
# 宿主机 8080 端口映射到容器 80 端口
```

**数据卷挂载**：
```bash
# 挂载目录
docker run -v /host/path:/container/path my-app

# 挂载文件
docker run -v /host/file:/container/file:ro my-app
# ro 表示只读
```

### 4. 环境变量管理

**在 Dockerfile 中设置**：
```dockerfile
ENV NODE_ENV=production
ENV API_URL=https://api.example.com
```

**在运行时传递**：
```bash
docker run -e NODE_ENV=production -e API_URL=https://api.example.com my-app
```

**使用 .env 文件**：
```bash
# 创建 .env 文件
echo "NODE_ENV=production" > .env
echo "API_URL=https://api.example.com" >> .env

# 使用 --env-file
docker run --env-file .env my-app
```

### 5. 容器网络

**默认网络**：
- `bridge`：默认网络，容器间可以通过容器名通信
- `host`：使用宿主机网络
- `none`：无网络

**自定义网络**：
```bash
# 创建网络
docker network create my-network

# 使用网络
docker run --network my-network my-app
```

### 6. 容器健康检查

**在 Dockerfile 中定义**：
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1
```

**在 docker-compose.yml 中定义**：
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## ⚠️ 常见问题和解决方案

### 问题一：构建镜像时 npm install 很慢

**解决方案**：
1. 使用国内镜像源
```dockerfile
RUN npm config set registry https://registry.npmmirror.com && \
    npm install
```

2. 使用 pnpm 或 yarn
```dockerfile
RUN npm install -g pnpm && \
    pnpm install --frozen-lockfile
```

### 问题二：构建时权限问题

**解决方案**：
```dockerfile
# 使用非 root 用户
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001
USER nextjs
```

### 问题三：容器启动后立即退出

**原因**：CMD 命令执行完毕，容器退出

**解决方案**：
```dockerfile
# 使用前台进程
CMD ["nginx", "-g", "daemon off;"]
# 而不是
CMD ["nginx"]  # 这会以后台进程运行，容器会退出
```

### 问题四：文件权限问题

**解决方案**：
```dockerfile
# 设置正确的文件权限
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html
```

### 问题五：镜像体积过大

**解决方案**：
1. 使用多阶段构建
2. 使用 Alpine 基础镜像
3. 合并 RUN 命令
4. 清理缓存和临时文件
```dockerfile
RUN npm install && \
    npm run build && \
    rm -rf node_modules && \
    npm cache clean --force
```

## 📊 学习检查清单

完成以下任务来验证学习成果：

- [ ] 理解 Docker 三大核心概念（镜像、容器、仓库）
- [ ] 能够编写符合最佳实践的 Dockerfile
- [ ] 成功构建并运行一个前端项目的 Docker 容器
- [ ] 掌握 Docker 常用命令（构建、运行、管理）
- [ ] 能够使用 Docker Compose 编排多容器应用
- [ ] 成功将镜像推送到 Docker Hub
- [ ] 理解多阶段构建的优势和使用场景
- [ ] 能够解决常见的 Docker 问题（权限、网络、端口等）

## 🎓 扩展学习

### 1. Docker 最佳实践深入

- Dockerfile 编写最佳实践官方文档
- 镜像安全扫描工具（Trivy、Snyk）
- 镜像优化工具（dive）

### 2. 进阶主题

- Docker 网络模式详解
- Docker 数据卷管理
- Docker 安全配置
- Docker 性能调优

### 3. 相关工具

- **Docker Desktop**：图形化管理工具
- **Portainer**：Web 界面管理 Docker
- **Watchtower**：自动更新容器

## 📚 参考资源

- Docker 官方文档：https://docs.docker.com/
- Docker Hub：https://hub.docker.com/
- Dockerfile 最佳实践：https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
- Docker Compose 文档：https://docs.docker.com/compose/
- Nginx Docker 官方镜像：https://hub.docker.com/_/nginx

## 📝 今日总结

完成今天的学习后，请记录：

1. **学习收获**：今天学到了什么？
2. **遇到的问题**：遇到了哪些问题？如何解决的？
3. **实践成果**：完成了哪些实践任务？
4. **下一步计划**：准备如何优化 Dockerfile 和部署流程？

---

**提示**：明天（Day 13）我们将深入学习 Docker 优化技巧，包括多阶段构建优化、镜像大小优化、构建速度优化等。今天的基础打好了，明天的优化会更得心应手！

