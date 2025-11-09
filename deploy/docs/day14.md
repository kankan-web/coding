# Day 14: 对象存储和云服务优化 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 理解对象存储服务的核心概念和优势
- 对比主流对象存储服务（阿里云 OSS、腾讯云 COS、AWS S3），选择合适的服务商
- 掌握对象存储基础配置（Bucket、权限、CORS、域名）
- 实现对象存储的**时间优化**（CDN 加速、压缩、HTTP/2、多地域）
- 实现对象存储的**空间优化**（存储类型、生命周期、图片优化、资源去重）
- 掌握成本优化策略，降低存储和流量费用
- 配置静态网站托管，实现完整的对象存储部署方案
- 将前端项目部署到对象存储，并优化访问性能和存储成本

## 核心目标

**掌握对象存储的时空优化，实现低成本高性能部署**

## 学习时间分配

- **理论学习**: 2-2.5 小时
  - 对象存储概念和对比
  - 时空优化原理
  - 成本优化策略
- **实践操作**: 4-5 小时
  - 云服务商选择和配置
  - 项目部署和优化
  - CDN 配置和测试
- **优化对比**: 1-1.5 小时
  - 性能对比测试
  - 成本计算对比
- **总结文档**: 30 分钟

## 核心知识点

### 1. 对象存储服务概述

#### 1.1 什么是对象存储

**对象存储（Object Storage）**是一种存储架构，将数据作为对象进行管理，而不是传统的文件系统层次结构。

**核心特点**：
- **扁平化结构**：没有目录层级，通过唯一标识符（Key）访问
- **无限扩展**：理论上可以存储无限量的数据
- **高可用性**：数据自动多副本存储，保证可靠性
- **RESTful API**：通过 HTTP/HTTPS 协议访问
- **按需付费**：按存储容量、流量、请求次数计费

**适用场景**：
- 静态网站托管
- 图片、视频等媒体文件存储
- 前端资源文件（JS、CSS、字体等）
- 备份和归档
- 大数据存储

#### 1.2 对象存储 vs 传统存储

| 特性 | 对象存储 | 传统文件存储 |
|------|---------|-------------|
| 访问方式 | RESTful API | 文件系统 |
| 扩展性 | 无限扩展 | 受限于服务器容量 |
| 成本 | 按需付费，成本低 | 需要购买服务器 |
| 可用性 | 99.9%+ SLA | 取决于服务器 |
| 管理 | 自动化管理 | 需要手动维护 |

### 2. 主流对象存储服务对比

#### 2.1 阿里云 OSS（Object Storage Service）

**优势**：
- 国内访问速度快
- 与阿里云其他服务集成好
- 文档完善，中文支持好
- 价格相对较低

**定价**（参考，以官网为准）：
- 标准存储：约 0.12 元/GB/月
- 流量费用：约 0.5 元/GB
- 请求费用：PUT 0.01 元/万次，GET 0.01 元/万次

**适用场景**：
- 国内项目
- 需要与阿里云其他服务集成
- 中文文档需求

#### 2.2 腾讯云 COS（Cloud Object Storage）

**优势**：
- 与微信生态集成好
- 国内访问速度快
- 提供丰富的 SDK
- 价格竞争力强

**定价**（参考，以官网为准）：
- 标准存储：约 0.118 元/GB/月
- 流量费用：约 0.5 元/GB
- 请求费用：PUT 0.01 元/万次，GET 0.01 元/万次

**适用场景**：
- 微信小程序项目
- 腾讯云生态项目
- 国内项目

#### 2.3 AWS S3（Simple Storage Service）

**优势**：
- 全球最大的云服务商
- 功能最完善
- 全球多地域支持
- 与 AWS 服务集成好

**定价**（参考，以官网为准）：
- 标准存储：约 $0.023/GB/月
- 流量费用：约 $0.09/GB（前 10TB）
- 请求费用：PUT $0.005/万次，GET $0.0004/万次

**适用场景**：
- 国际化项目
- 需要全球多地域部署
- 与 AWS 服务集成

#### 2.4 服务选型建议

**选择标准**：
1. **地域**：国内项目优先选择 OSS/COS，国际项目选择 S3
2. **成本**：对比存储、流量、请求费用
3. **功能**：CDN、生命周期管理、版本控制等
4. **集成**：与现有云服务生态的集成度
5. **文档**：文档质量和中文支持

### 3. 对象存储基础配置

#### 3.1 Bucket 创建和配置

**Bucket 概念**：
- Bucket 是对象存储的容器，类似于文件夹
- 每个 Bucket 有唯一的名称（全局唯一）
- Bucket 名称通常需要符合 DNS 命名规范

**创建 Bucket 步骤**（以阿里云 OSS 为例）：

1. **登录控制台** → 对象存储 OSS
2. **创建 Bucket**：
   - Bucket 名称：`my-app-static`（全局唯一）
   - 地域：选择离用户最近的地域
   - 存储类型：标准存储（默认）
   - 读写权限：
     - **私有**：需要签名访问（推荐）
     - **公共读**：允许匿名读取（静态网站）
     - **公共读写**：不安全，不推荐
   - 版本控制：开启（可选，用于回滚）

**最佳实践**：
- Bucket 名称使用小写字母、数字、连字符
- 不同环境使用不同的 Bucket（dev、staging、prod）
- 生产环境使用私有权限，通过 CDN 访问

#### 3.2 权限配置

**访问控制策略**：

**a) Bucket 级别权限**：
- 私有：所有文件都需要签名访问
- 公共读：文件可以匿名访问
- 公共读写：不推荐

**b) 文件级别权限**：
- 继承 Bucket 权限
- 单独设置文件权限（ACL）

**c) 跨域资源共享（CORS）配置**：

```json
{
  "AllowedOrigins": ["https://yourdomain.com", "https://www.yourdomain.com"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag", "x-oss-request-id"],
  "MaxAgeSeconds": 3600
}
```

**配置 CORS 的原因**：
- 浏览器同源策略限制
- 前端通过 JavaScript 访问对象存储需要 CORS
- 配置允许的源，防止跨域攻击

#### 3.3 访问域名配置

**访问域名类型**：

1. **OSS 默认域名**：
   - 格式：`bucket-name.oss-region.aliyuncs.com`
   - 示例：`my-app-static.oss-cn-hangzhou.aliyuncs.com`
   - 特点：免费，但不够友好

2. **自定义域名（CDN 加速）**：
   - 格式：`static.yourdomain.com`
   - 需要配置 CNAME 解析
   - 可以绑定 SSL 证书
   - 推荐使用 CDN 加速域名

**配置自定义域名步骤**：

1. 在 OSS 控制台 → Bucket → 传输管理 → 域名管理
2. 添加自定义域名：`static.yourdomain.com`
3. 在域名 DNS 解析中添加 CNAME 记录：
   - 记录类型：CNAME
   - 主机记录：static
   - 记录值：`my-app-static.oss-cn-hangzhou.aliyuncs.com`
4. 等待 DNS 解析生效（通常几分钟到几小时）

### 4. 对象存储时间优化

#### 4.1 CDN 加速配置

**CDN（Content Delivery Network）原理**：
- 将内容缓存到全球边缘节点
- 用户从最近的节点获取内容
- 减少回源请求，提高访问速度

**CDN 配置步骤**（以阿里云 CDN 为例）：

1. **创建 CDN 加速域名**：
   - 加速域名：`static.yourdomain.com`
   - 源站类型：OSS 域名
   - 源站地址：`my-app-static.oss-cn-hangzhou.aliyuncs.com`

2. **配置缓存策略**：
   - **静态资源**（JS、CSS、图片）：
     - 缓存时间：30 天
     - 缓存规则：按文件扩展名
   - **HTML 文件**：
     - 缓存时间：0（不缓存）或短时间（1 小时）
     - 原因：HTML 内容经常更新

3. **配置 HTTPS**：
   - 上传 SSL 证书或使用免费证书
   - 强制 HTTPS 跳转

4. **配置缓存预热**：
   - 上传文件后自动预热到 CDN 节点
   - 提高首次访问速度

**CDN 优化效果**：
- 访问速度提升 50-80%
- 减少源站压力
- 降低流量费用（CDN 流量通常更便宜）

#### 4.2 智能压缩配置

**压缩类型**：

**a) Gzip 压缩**：
- 压缩比：60-80%
- 浏览器支持：所有现代浏览器
- 适用文件：文本文件（HTML、CSS、JS、JSON）

**b) Brotli 压缩**：
- 压缩比：比 Gzip 高 15-20%
- 浏览器支持：Chrome、Firefox、Edge
- 适用文件：文本文件

**配置压缩**（阿里云 CDN）：

1. CDN 控制台 → 域名管理 → 性能优化
2. 开启智能压缩：
   - 压缩类型：Gzip、Brotli
   - 压缩文件类型：`.js`、`.css`、`.html`、`.json`、`.svg`
   - 压缩阈值：1KB（小于 1KB 不压缩）

**压缩效果**：
- JS/CSS 文件大小减少 60-80%
- 传输时间减少 60-80%
- 流量费用降低 60-80%

#### 4.3 HTTP/2 和 HTTP/3 支持

**HTTP/2 优势**：
- 多路复用：一个连接传输多个请求
- 头部压缩：减少头部大小
- 服务器推送：主动推送资源

**HTTP/3 优势**：
- 基于 UDP（QUIC 协议）
- 更快的连接建立
- 更好的移动网络支持

**配置 HTTP/2**：
- 大多数 CDN 默认支持 HTTP/2
- 需要 HTTPS（HTTP/2 要求加密）
- 无需额外配置

**配置 HTTP/3**：
- 需要 CDN 支持（阿里云、腾讯云已支持）
- 在 CDN 控制台开启 HTTP/3

#### 4.4 多地域部署和就近访问

**多地域部署策略**：

1. **主地域**：选择用户最多的地域
2. **备份地域**：选择次要用户地域
3. **跨地域复制**：自动同步文件到多个地域

**配置跨地域复制**（阿里云 OSS）：

1. Bucket → 数据管理 → 跨区域复制
2. 创建复制规则：
   - 源 Bucket：`my-app-static-cn-hangzhou`
   - 目标 Bucket：`my-app-static-cn-beijing`
   - 复制内容：全部对象
   - 同步方式：异步

**就近访问优化**：
- CDN 自动选择最近的节点
- 多地域部署保证高可用性
- 降低访问延迟

### 5. 对象存储空间优化

#### 5.1 存储类型选择

**存储类型对比**：

| 存储类型 | 访问频率 | 价格 | 适用场景 |
|---------|---------|------|---------|
| **标准存储** | 频繁访问 | 高 | 网站静态资源、图片 |
| **低频访问存储** | 偶尔访问 | 中 | 备份文件、日志 |
| **归档存储** | 很少访问 | 低 | 历史数据、归档文件 |
| **冷归档存储** | 极少访问 | 最低 | 合规数据、长期归档 |

**选择建议**：
- **前端资源**：标准存储（访问频繁）
- **历史版本**：低频访问存储（偶尔访问）
- **备份文件**：归档存储（很少访问）

**转换存储类型**：
- 手动转换：在控制台修改文件存储类型
- 自动转换：通过生命周期规则自动转换

#### 5.2 生命周期管理

**生命周期规则**：

**a) 自动删除旧版本**：

```json
{
  "规则名称": "删除30天前的旧版本",
  "适用对象": "所有对象",
  "操作": "删除",
  "条件": "对象创建时间 > 30天 且 非当前版本"
}
```

**b) 自动转换存储类型**：

```json
{
  "规则名称": "90天后转为低频存储",
  "适用对象": "所有对象",
  "操作": "转换存储类型",
  "条件": "对象创建时间 > 90天",
  "目标存储类型": "低频访问存储"
}
```

**c) 自动删除过期文件**：

```json
{
  "规则名称": "删除1年以上的日志文件",
  "适用对象": "logs/*",
  "操作": "删除",
  "条件": "对象创建时间 > 365天"
}
```

**配置生命周期规则**（阿里云 OSS）：

1. Bucket → 数据管理 → 生命周期
2. 创建规则：
   - 规则名称：`auto-delete-old-versions`
   - 前缀：空（所有对象）或 `dist/`（特定目录）
   - 操作：删除历史版本
   - 条件：保留最新版本，删除 30 天前的版本

**生命周期优化效果**：
- 自动清理不需要的文件
- 降低存储成本 30-50%
- 减少手动管理成本

#### 5.3 图片压缩和格式优化

**图片优化策略**：

**a) 格式选择**：

| 格式 | 特点 | 适用场景 |
|------|------|---------|
| **JPEG** | 有损压缩，文件小 | 照片、复杂图片 |
| **PNG** | 无损压缩，支持透明 | 图标、简单图片 |
| **WebP** | 现代格式，压缩比高 | 所有场景（推荐） |
| **AVIF** | 最新格式，压缩比最高 | 现代浏览器 |

**b) 图片压缩工具**：

- **在线工具**：TinyPNG、Squoosh
- **命令行工具**：imagemin、sharp
- **构建工具插件**：vite-plugin-imagemin、webpack-image-minimizer

**c) 自动压缩配置**（Vite 项目）：

```javascript
// vite.config.js
import viteImagemin from 'vite-plugin-imagemin'

export default {
  plugins: [
    viteImagemin({
      gifsicle: { optimizationLevel: 7 },
      optipng: { optimizationLevel: 7 },
      svgo: {
        plugins: [
          { removeViewBox: false },
          { removeEmptyAttrs: false }
        ]
      },
      webp: { quality: 75 }
    })
  ]
}
```

**d) 格式转换策略**：

1. **构建时转换**：将 PNG/JPEG 转换为 WebP
2. **CDN 自动转换**：使用 CDN 的图片处理功能
3. **响应式图片**：根据设备提供不同尺寸

**图片优化效果**：
- 文件大小减少 50-70%
- 加载时间减少 50-70%
- 流量费用降低 50-70%

#### 5.4 资源去重和版本管理

**资源去重策略**：

**a) 内容哈希命名**：
- 文件名包含内容哈希：`app.[hash].js`
- 相同内容生成相同文件名
- 利用浏览器缓存

**b) 版本控制**：
- 开启 Bucket 版本控制
- 保留历史版本用于回滚
- 定期清理旧版本（生命周期规则）

**c) 资源合并**：
- 合并多个小文件
- 减少 HTTP 请求数
- 提高加载速度

**版本管理最佳实践**：

1. **构建产物命名**：
   ```javascript
   // vite.config.js
   export default {
     build: {
       rollupOptions: {
         output: {
           entryFileNames: 'assets/[name].[hash].js',
           chunkFileNames: 'assets/[name].[hash].js',
           assetFileNames: 'assets/[name].[hash].[ext]'
         }
       }
     }
   }
   ```

2. **版本清理**：
   - 保留最近 5 个版本
   - 自动删除 30 天前的版本

### 6. 成本优化策略

#### 6.1 存储容量规划

**容量估算**：

1. **当前容量**：统计现有文件大小
2. **增长预测**：根据历史数据预测增长
3. **冗余考虑**：预留 20-30% 冗余

**优化方法**：
- 定期清理不需要的文件
- 使用生命周期规则自动清理
- 压缩图片和静态资源
- 使用合适的存储类型

#### 6.2 流量费用优化

**流量费用构成**：
- **CDN 回源流量**：从 OSS 到 CDN 的流量（较贵）
- **CDN 流量**：从 CDN 到用户的流量（较便宜）
- **直接访问流量**：用户直接访问 OSS 的流量（最贵）

**优化策略**：

1. **使用 CDN 加速**：
   - CDN 流量费用通常比 OSS 直接访问便宜 30-50%
   - 减少回源请求（提高 CDN 命中率）

2. **提高 CDN 命中率**：
   - 配置合理的缓存时间
   - 使用缓存预热
   - 避免频繁更新文件

3. **压缩资源**：
   - Gzip/Brotli 压缩
   - 图片压缩和格式优化
   - 减少传输数据量

4. **按需加载**：
   - 代码分割和懒加载
   - 图片懒加载
   - 减少不必要的请求

#### 6.3 请求费用优化

**请求费用构成**：
- **PUT 请求**：上传文件（较贵）
- **GET 请求**：下载文件（较便宜）
- **HEAD 请求**：获取元数据（最便宜）

**优化策略**：

1. **批量上传**：
   - 使用 SDK 的批量上传功能
   - 减少 PUT 请求次数

2. **使用 CDN**：
   - CDN 缓存减少 GET 请求
   - 降低 OSS 请求费用

3. **合并请求**：
   - 合并小文件
   - 减少请求次数

4. **缓存策略**：
   - 浏览器缓存
   - CDN 缓存
   - 减少重复请求

#### 6.4 成本监控和告警

**成本监控**：

1. **设置预算告警**：
   - 月度预算：100 元
   - 告警阈值：80%（80 元时告警）

2. **分析费用明细**：
   - 存储费用占比
   - 流量费用占比
   - 请求费用占比

3. **优化建议**：
   - 识别费用高的部分
   - 针对性优化

### 7. 静态网站托管配置

#### 7.1 静态网站托管概述

**静态网站托管**：
- 将 HTML、CSS、JS 等静态文件托管到对象存储
- 通过 CDN 加速访问
- 支持自定义域名和 HTTPS

**优势**：
- 成本低（按需付费）
- 高可用性（99.9%+ SLA）
- 无限扩展
- 无需服务器维护

#### 7.2 配置静态网站托管（阿里云 OSS）

**步骤**：

1. **开启静态网站托管**：
   - Bucket → 基础设置 → 静态网站托管
   - 开启静态网站托管
   - 设置默认首页：`index.html`
   - 设置默认 404 页：`404.html`

2. **配置路由规则**（SPA 应用）：
   - 错误文档：`index.html`
   - HTTP 状态码：`200`
   - 规则：所有 404 请求返回 `index.html`（用于前端路由）

3. **绑定自定义域名**：
   - 添加自定义域名：`www.yourdomain.com`
   - 配置 SSL 证书
   - 配置 CNAME 解析

4. **配置 CDN 加速**：
   - 创建 CDN 加速域名
   - 配置缓存策略
   - 配置 HTTPS

#### 7.3 SPA 应用路由配置

**问题**：SPA 应用使用前端路由（如 Vue Router、React Router），直接访问 `/about` 会返回 404。

**解决方案**：

**方案 1：OSS 错误文档配置**（推荐）：
- 错误文档：`index.html`
- HTTP 状态码：`200`
- 所有 404 请求返回 `index.html`，由前端路由处理

**方案 2：CDN 回源规则**：
- 配置 CDN 回源规则
- 所有请求回源到 `index.html`

**方案 3：Nginx 反向代理**：
- 使用 Nginx 作为反向代理
- 配置 try_files 规则

## 实战任务

### 任务 1: 云服务商选择和账号准备

**目标**：选择云服务商，完成账号注册和实名认证

**步骤**：

1. **对比云服务商**：
   - 访问阿里云、腾讯云、AWS 官网
   - 对比价格、功能、地域支持
   - 根据项目需求选择

2. **注册账号**：
   - 完成账号注册
   - 完成实名认证
   - 开通对象存储服务

3. **记录关键信息**：
   - AccessKey ID
   - AccessKey Secret
   - 地域选择
   - 计费方式

**注意事项**：
- AccessKey Secret 需要妥善保管，不要泄露
- 建议创建子账号，使用最小权限原则
- 开启 MFA 多因素认证

### 任务 2: 创建和配置 Bucket

**目标**：创建 Bucket，配置基础设置

**步骤**：

1. **创建 Bucket**：
   - Bucket 名称：`my-app-static-prod`（全局唯一）
   - 地域：选择离用户最近的地域（如：华东1-杭州）
   - 存储类型：标准存储
   - 读写权限：公共读（用于静态网站）
   - 版本控制：开启

2. **配置 CORS**：
   ```json
   {
     "AllowedOrigins": ["https://yourdomain.com"],
     "AllowedMethods": ["GET", "HEAD"],
     "AllowedHeaders": ["*"],
     "MaxAgeSeconds": 3600
   }
   ```

3. **配置生命周期规则**：
   - 规则名称：`auto-delete-old-versions`
   - 操作：删除历史版本
   - 条件：保留最新版本，删除 30 天前的版本

4. **记录 Bucket 信息**：
   - Bucket 名称
   - 地域
   - 访问域名

### 任务 3: 安装和配置 SDK

**目标**：安装对象存储 SDK，配置认证信息

**步骤**（以阿里云 OSS Node.js SDK 为例）：

1. **安装 SDK**：
   ```bash
   npm install ali-oss
   ```

2. **创建配置文件**：
   ```javascript
   // config/oss.js
   const OSS = require('ali-oss');
   
   const client = new OSS({
     region: 'oss-cn-hangzhou',
     accessKeyId: process.env.OSS_ACCESS_KEY_ID,
     accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
     bucket: 'my-app-static-prod'
   });
   
   module.exports = client;
   ```

3. **配置环境变量**：
   ```bash
   # .env
   OSS_ACCESS_KEY_ID=your-access-key-id
   OSS_ACCESS_KEY_SECRET=your-access-key-secret
   ```

4. **测试连接**：
   ```javascript
   // test-oss.js
   const client = require('./config/oss');
   
   async function test() {
     try {
       const result = await client.list();
       console.log('OSS 连接成功', result);
     } catch (err) {
       console.error('OSS 连接失败', err);
     }
   }
   
   test();
   ```

### 任务 4: 构建和优化前端项目

**目标**：构建生产版本，优化资源大小

**步骤**：

1. **配置生产构建**（Vite 项目）：
   ```javascript
   // vite.config.js
   import { defineConfig } from 'vite';
   import vue from '@vitejs/plugin-vue';
   import viteImagemin from 'vite-plugin-imagemin';
   
   export default defineConfig({
     plugins: [
       vue(),
       viteImagemin({
         gifsicle: { optimizationLevel: 7 },
         optipng: { optimizationLevel: 7 },
         webp: { quality: 75 }
       })
     ],
     build: {
       rollupOptions: {
         output: {
           entryFileNames: 'assets/[name].[hash].js',
           chunkFileNames: 'assets/[name].[hash].js',
           assetFileNames: 'assets/[name].[hash].[ext]'
         }
       },
       // 启用压缩
       minify: 'terser',
       terserOptions: {
         compress: {
           drop_console: true,
           drop_debugger: true
         }
       }
     }
   });
   ```

2. **构建项目**：
   ```bash
   npm run build
   ```

3. **检查构建产物**：
   - 查看 `dist` 目录
   - 检查文件大小
   - 确认文件命名包含哈希

4. **优化对比**：
   - 记录优化前的文件大小
   - 记录优化后的文件大小
   - 计算优化比例

### 任务 5: 上传项目到对象存储

**目标**：编写上传脚本，将构建产物上传到 OSS

**步骤**：

1. **创建上传脚本**：
   ```javascript
   // scripts/upload-to-oss.js
   const OSS = require('ali-oss');
   const path = require('path');
   const fs = require('fs');
   const glob = require('glob');
   
   const client = new OSS({
     region: 'oss-cn-hangzhou',
     accessKeyId: process.env.OSS_ACCESS_KEY_ID,
     accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
     bucket: 'my-app-static-prod'
   });
   
   async function uploadFile(localPath, remotePath) {
     try {
       const result = await client.put(remotePath, localPath);
       console.log(`✓ ${remotePath} 上传成功`);
       return result;
     } catch (err) {
       console.error(`✗ ${remotePath} 上传失败`, err);
       throw err;
     }
   }
   
   async function uploadDirectory(localDir, remotePrefix = '') {
     const files = glob.sync('**/*', {
       cwd: localDir,
       nodir: true,
       ignore: ['**/*.map'] // 忽略 source map
     });
   
     console.log(`开始上传 ${files.length} 个文件...`);
   
     for (const file of files) {
       const localPath = path.join(localDir, file);
       const remotePath = remotePrefix ? `${remotePrefix}/${file}` : file;
       await uploadFile(localPath, remotePath);
     }
   
     console.log('所有文件上传完成！');
   }
   
   // 执行上传
   const distDir = path.join(__dirname, '../dist');
   uploadDirectory(distDir).catch(console.error);
   ```

2. **安装依赖**：
   ```bash
   npm install --save-dev ali-oss glob
   ```

3. **添加上传命令**：
   ```json
   // package.json
   {
     "scripts": {
       "build": "vite build",
       "deploy": "npm run build && node scripts/upload-to-oss.js"
     }
   }
   ```

4. **执行上传**：
   ```bash
   npm run deploy
   ```

5. **验证上传结果**：
   - 在 OSS 控制台查看文件
   - 访问 OSS 域名测试

### 任务 6: 配置 CDN 加速

**目标**：配置 CDN 加速，提高访问速度

**步骤**（以阿里云 CDN 为例）：

1. **创建 CDN 加速域名**：
   - 进入 CDN 控制台
   - 添加域名：`static.yourdomain.com`
   - 源站类型：OSS 域名
   - 源站地址：`my-app-static-prod.oss-cn-hangzhou.aliyuncs.com`

2. **配置缓存策略**：
   - **静态资源**（`.js`、`.css`、`.png`、`.jpg`）：
     - 缓存时间：30 天
   - **HTML 文件**（`.html`）：
     - 缓存时间：0（不缓存）或 1 小时

3. **配置 HTTPS**：
   - 上传 SSL 证书或使用免费证书
   - 开启强制 HTTPS

4. **配置智能压缩**：
   - 开启 Gzip 和 Brotli 压缩
   - 压缩文件类型：`.js`、`.css`、`.html`、`.json`

5. **配置 DNS 解析**：
   - 在域名 DNS 解析中添加 CNAME 记录
   - 主机记录：`static`
   - 记录值：CDN 提供的 CNAME 地址

6. **等待生效**：
   - DNS 解析通常需要几分钟到几小时
   - CDN 配置通常立即生效

### 任务 7: 性能对比测试

**目标**：对比 CDN 加速前后的性能

**步骤**：

1. **测试 OSS 直接访问**：
   ```bash
   # 使用 curl 测试
   curl -o /dev/null -s -w "时间: %{time_total}s\n大小: %{size_download} bytes\n" \
     https://my-app-static-prod.oss-cn-hangzhou.aliyuncs.com/index.html
   ```

2. **测试 CDN 加速访问**：
   ```bash
   curl -o /dev/null -s -w "时间: %{time_total}s\n大小: %{size_download} bytes\n" \
     https://static.yourdomain.com/index.html
   ```

3. **使用浏览器开发者工具测试**：
   - 打开浏览器开发者工具
   - Network 面板
   - 对比加载时间、文件大小

4. **使用在线工具测试**：
   - PageSpeed Insights
   - WebPageTest
   - GTmetrix

5. **记录对比数据**：
   - OSS 直接访问时间
   - CDN 访问时间
   - 优化比例

### 任务 8: 配置生命周期管理

**目标**：配置自动清理旧版本和转换存储类型

**步骤**：

1. **配置删除旧版本规则**：
   - Bucket → 数据管理 → 生命周期
   - 创建规则：
     - 规则名称：`delete-old-versions`
     - 前缀：空（所有对象）
     - 操作：删除历史版本
     - 条件：保留最新版本，删除 30 天前的版本

2. **配置存储类型转换规则**：
   - 创建规则：
     - 规则名称：`convert-to-ia`
     - 前缀：`backup/`（备份文件）
     - 操作：转换存储类型
     - 条件：对象创建时间 > 90 天
     - 目标存储类型：低频访问存储

3. **验证规则**：
   - 上传测试文件
   - 等待规则执行（可能需要等待）
   - 检查文件状态

### 任务 9: 图片资源优化

**目标**：优化图片资源，减少存储和流量成本

**步骤**：

1. **安装图片优化工具**：
   ```bash
   npm install --save-dev vite-plugin-imagemin imagemin-webp imagemin-mozjpeg imagemin-pngquant
   ```

2. **配置图片压缩**（Vite）：
   ```javascript
   // vite.config.js
   import viteImagemin from 'vite-plugin-imagemin';
   
   export default {
     plugins: [
       viteImagemin({
         gifsicle: { optimizationLevel: 7 },
         optipng: { optimizationLevel: 7 },
         mozjpeg: { quality: 80 },
         pngquant: { quality: [0.8, 0.9] },
         svgo: {
           plugins: [
             { removeViewBox: false },
             { removeEmptyAttrs: false }
           ]
         },
         webp: { quality: 75 }
       })
     ]
   };
   ```

3. **构建并对比**：
   ```bash
   npm run build
   ```
   - 对比优化前后的图片大小
   - 计算优化比例

4. **手动优化大图片**：
   - 使用在线工具（TinyPNG、Squoosh）
   - 转换为 WebP 格式
   - 调整图片尺寸

### 任务 10: 配置静态网站托管

**目标**：配置静态网站托管，支持 SPA 路由

**步骤**：

1. **开启静态网站托管**：
   - Bucket → 基础设置 → 静态网站托管
   - 开启静态网站托管
   - 默认首页：`index.html`
   - 默认 404 页：`index.html`（用于 SPA 路由）

2. **配置错误文档**（SPA 应用）：
   - 错误文档：`index.html`
   - HTTP 状态码：`200`
   - 说明：所有 404 请求返回 `index.html`，由前端路由处理

3. **绑定自定义域名**：
   - 添加自定义域名：`www.yourdomain.com`
   - 配置 SSL 证书
   - 配置 CNAME 解析

4. **测试访问**：
   - 访问首页：`https://www.yourdomain.com`
   - 访问子路由：`https://www.yourdomain.com/about`
   - 验证路由是否正常

### 任务 11: 成本计算和优化对比

**目标**：计算存储成本，对比优化前后的费用

**步骤**：

1. **记录优化前数据**：
   - 存储容量：100 MB
   - 月流量：10 GB
   - 请求次数：10 万次

2. **计算优化前成本**（以阿里云 OSS 为例）：
   ```
   存储费用 = 100 MB × 0.12 元/GB/月 = 0.012 元/月
   流量费用 = 10 GB × 0.5 元/GB = 5 元
   请求费用 = 10 万次 × 0.01 元/万次 = 0.1 元
   总费用 = 0.012 + 5 + 0.1 = 5.112 元/月
   ```

3. **应用优化措施**：
   - 图片压缩：减少 50% 存储
   - Gzip 压缩：减少 60% 流量
   - CDN 加速：流量费用降低 30%
   - 生命周期管理：自动清理旧文件

4. **计算优化后数据**：
   - 存储容量：50 MB（减少 50%）
   - 月流量：4 GB（减少 60%）
   - 请求次数：8 万次（CDN 缓存减少请求）

5. **计算优化后成本**：
   ```
   存储费用 = 50 MB × 0.12 元/GB/月 = 0.006 元/月
   流量费用 = 4 GB × 0.35 元/GB（CDN 价格） = 1.4 元
   请求费用 = 8 万次 × 0.01 元/万次 = 0.08 元
   总费用 = 0.006 + 1.4 + 0.08 = 1.486 元/月
   ```

6. **计算优化比例**：
   ```
   成本降低 = (5.112 - 1.486) / 5.112 × 100% = 70.9%
   ```

7. **编写成本优化报告**：
   - 优化前成本
   - 优化后成本
   - 优化措施
   - 成本降低比例

### 任务 12: CI/CD 集成对象存储部署

**目标**：在 GitHub Actions 中集成对象存储部署

**步骤**：

1. **创建 GitHub Actions 工作流**：
   ```yaml
   # .github/workflows/deploy-oss.yml
   name: Deploy to OSS
   
   on:
     push:
       branches: [ main ]
   
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             cache: 'npm'
         
         - name: Install dependencies
           run: npm ci
         
         - name: Build project
           run: npm run build
         
         - name: Configure AWS credentials
           uses: aws-actions/configure-aws-credentials@v2
           with:
             access-key-id: ${{ secrets.OSS_ACCESS_KEY_ID }}
             secret-access-key: ${{ secrets.OSS_ACCESS_KEY_SECRET }}
             region: oss-cn-hangzhou
         
         - name: Deploy to OSS
           run: |
             npm install -g ali-oss-cli
             oss-cli cp -r dist/ oss://my-app-static-prod/ --update
         
         - name: Invalidate CDN cache
           run: |
             # 清除 CDN 缓存（需要配置 CDN API）
             echo "CDN cache invalidated"
   ```

2. **配置 GitHub Secrets**：
   - `OSS_ACCESS_KEY_ID`
   - `OSS_ACCESS_KEY_SECRET`

3. **测试部署流程**：
   - 推送代码到 main 分支
   - 查看 GitHub Actions 执行结果
   - 验证文件是否上传成功

### 任务 13: 编写对象存储优化实践文档

**目标**：总结优化经验和最佳实践

**文档内容应包括**：

1. **项目概述**：
   - 项目类型和规模
   - 使用的云服务商
   - 部署架构

2. **优化措施**：
   - CDN 加速配置
   - 压缩优化
   - 图片优化
   - 生命周期管理

3. **性能对比数据**：
   - 优化前后加载时间
   - 优化前后文件大小
   - 优化前后流量对比

4. **成本对比数据**：
   - 优化前后存储费用
   - 优化前后流量费用
   - 优化前后总费用
   - 成本降低比例

5. **遇到的问题和解决方案**：
   - CORS 配置问题
   - SPA 路由问题
   - CDN 缓存问题

6. **最佳实践清单**：
   - Bucket 配置最佳实践
   - CDN 配置最佳实践
   - 成本优化最佳实践

7. **后续优化建议**：
   - 进一步优化方向
   - 监控和告警配置
   - 自动化部署优化

## 知识点总结

### 对象存储基础配置检查清单

- [ ] Bucket 创建和命名规范
- [ ] 权限配置（读写权限、CORS）
- [ ] 自定义域名配置
- [ ] SSL 证书配置
- [ ] 版本控制开启

### 时间优化检查清单

- [ ] CDN 加速配置
- [ ] 缓存策略配置（静态资源、HTML）
- [ ] 智能压缩配置（Gzip、Brotli）
- [ ] HTTP/2 支持
- [ ] 多地域部署（如需要）

### 空间优化检查清单

- [ ] 存储类型选择（标准、低频、归档）
- [ ] 生命周期规则配置（自动删除、转换类型）
- [ ] 图片压缩和格式优化（WebP、AVIF）
- [ ] 资源去重（内容哈希命名）
- [ ] 版本管理策略

### 成本优化检查清单

- [ ] 存储容量规划
- [ ] 流量费用优化（CDN、压缩）
- [ ] 请求费用优化（CDN 缓存）
- [ ] 成本监控和告警配置
- [ ] 定期成本分析

### 静态网站托管检查清单

- [ ] 静态网站托管开启
- [ ] 默认首页和 404 页配置
- [ ] SPA 路由支持（错误文档配置）
- [ ] 自定义域名绑定
- [ ] CDN 加速配置

## 常见问题排查

### 问题 1: CORS 跨域错误

**错误信息**：
```
Access to fetch at 'https://xxx.oss-cn-hangzhou.aliyuncs.com/xxx' 
from origin 'https://yourdomain.com' has been blocked by CORS policy
```

**原因**：Bucket 未配置 CORS 或配置不正确

**解决**：
1. 检查 Bucket CORS 配置
2. 确认允许的源（Origin）包含你的域名
3. 确认允许的方法（GET、HEAD）
4. 清除浏览器缓存后重试

### 问题 2: SPA 路由 404 错误

**错误信息**：直接访问 `/about` 返回 404

**原因**：对象存储不知道前端路由，直接访问路径会查找对应的文件

**解决**：
1. 配置错误文档为 `index.html`
2. 设置 HTTP 状态码为 `200`
3. 所有 404 请求返回 `index.html`，由前端路由处理

### 问题 3: CDN 缓存不更新

**原因**：CDN 缓存了旧版本的文件

**解决**：
1. 使用内容哈希命名文件（`app.[hash].js`）
2. 手动刷新 CDN 缓存
3. 配置较短的 HTML 缓存时间
4. 使用 CDN 缓存刷新 API

### 问题 4: 图片加载慢

**原因**：图片文件过大或未使用 CDN

**解决**：
1. 压缩图片（使用工具或构建插件）
2. 转换为 WebP 格式
3. 配置 CDN 加速
4. 使用响应式图片（不同设备不同尺寸）

### 问题 5: 费用超出预期

**原因**：未优化存储、流量或请求

**解决**：
1. 分析费用明细（存储、流量、请求）
2. 应用优化措施：
   - 压缩资源减少流量
   - 使用 CDN 降低流量费用
   - 配置生命周期规则清理旧文件
   - 选择合适的存储类型
3. 设置预算告警

### 问题 6: 上传文件失败

**错误信息**：`AccessDenied` 或 `InvalidAccessKeyId`

**原因**：AccessKey 配置错误或权限不足

**解决**：
1. 检查 AccessKey ID 和 Secret 是否正确
2. 确认 AccessKey 有上传权限
3. 检查 Bucket 权限配置
4. 使用子账号时确认权限范围

## 学习资源

- **阿里云 OSS 文档**：https://help.aliyun.com/product/31815.html
- **腾讯云 COS 文档**：https://cloud.tencent.com/document/product/436
- **AWS S3 文档**：https://docs.aws.amazon.com/s3/
- **CDN 加速原理**：https://developer.mozilla.org/zh-CN/docs/Glossary/CDN
- **WebP 图片格式**：https://developers.google.com/speed/webp
- **HTTP/2 详解**：https://developers.google.com/web/fundamentals/performance/http2

## 验收标准

完成 Day 14 学习后，应达成以下目标：

1. ✅ 选择并配置云服务商对象存储服务
2. ✅ 创建 Bucket 并配置基础设置（权限、CORS、域名）
3. ✅ 将前端项目部署到对象存储
4. ✅ 配置 CDN 加速，访问速度提升至少 50%
5. ✅ 配置智能压缩，文件大小减少至少 50%
6. ✅ 配置生命周期管理，自动清理旧版本
7. ✅ 优化图片资源，图片大小减少至少 50%
8. ✅ 计算并对比优化前后的存储成本，成本降低至少 30%
9. ✅ 配置静态网站托管，支持 SPA 路由
10. ✅ 集成对象存储到 CI/CD 流程
11. ✅ 编写完整的对象存储优化实践文档

## 扩展学习（可选）

- **对象存储高级功能**：
  - 图片处理（缩放、裁剪、水印）
  - 视频处理（转码、截图）
  - 数据备份和恢复
- **多云部署策略**：
  - 同时使用多个云服务商
  - 故障切换方案
- **监控和告警**：
  - 配置云监控
  - 设置告警规则
  - 性能分析报告
