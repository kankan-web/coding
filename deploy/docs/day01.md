# Day 1: 静态资源部署基础 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 理解前端构建工具的生产环境配置要点
- 掌握资源压缩和优化的多种方法
- 理解并实践浏览器缓存和 CDN 缓存策略
- 正确配置资源路径，避免部署后的路径问题
- 实现代码分割和懒加载优化
- 对比优化前后的性能指标

## 核心知识点

### 1. 静态资源打包和构建

#### Webpack 生产配置

- **mode: 'production'**
  - 自动启用代码压缩、Tree Shaking 等优化
  - 设置 `process.env.NODE_ENV` 为 `'production'`

- **环境变量配置（process.env）**
  - 使用 `DefinePlugin` 定义全局常量
  - 区分开发环境和生产环境的配置
  - 敏感信息使用环境变量，不要硬编码

- **代码压缩（TerserPlugin）**
  - 移除 console、debugger
  - 代码混淆和压缩
  - 配置压缩选项平衡压缩率和构建时间

- **Tree Shaking 原理**
  - 基于 ES6 模块的静态分析
  - 移除未使用的代码
  - 注意 CommonJS 模块不支持 Tree Shaking

- **Scope Hoisting 优化**
  - 减少模块包装代码
  - 降低代码体积，提升执行效率
  - 默认在生产模式下启用

#### Vite 生产配置

- **build 配置选项**
  - `outDir`: 输出目录
  - `assetsDir`: 静态资源目录
  - `minify`: 压缩工具选择（terser/esbuild）
  - `sourcemap`: 是否生成 sourcemap

- **rollup 插件配置**
  - 通过 `rollupOptions` 配置 Rollup 选项
  - 自定义输出格式和文件名策略
  - 配置外部依赖

- **环境变量处理（.env 文件）**
  - `.env` 文件管理不同环境变量
  - 使用 `import.meta.env` 访问环境变量
  - 变量必须以 `VITE_` 开头才能在客户端访问

- **生产构建优化**
  - 默认启用代码分割
  - 自动压缩和优化
  - 配置 chunk 大小警告阈值

### 2. 资源压缩和优化

#### Gzip 压缩

- **原理和适用场景**
  - 基于 DEFLATE 算法的压缩
  - 适合文本类资源（HTML、CSS、JS、JSON）
  - 不适合已压缩的资源（图片、视频）

- **配置方法**
  - **构建工具配置**: 使用插件预压缩（如 `vite-plugin-compression`）
  - **服务器配置**: Nginx、Apache 等服务器动态压缩
  - 构建工具压缩：构建时生成 .gz 文件，服务器直接返回
  - 服务器压缩：服务器实时压缩，更灵活但消耗 CPU

- **压缩级别和性能权衡**
  - 级别 1-9，级别越高压缩率越高但耗时越长
  - 推荐级别 6-7，平衡压缩率和性能
  - 构建时压缩可用更高级别（9），服务器压缩建议 6

#### Brotli 压缩

- **相比 Gzip 的优势**
  - 压缩率比 Gzip 高 15-20%
  - 压缩速度较慢但解压速度快
  - 特别适合文本资源

- **浏览器支持情况**
  - Chrome 50+、Firefox 44+、Safari 11+、Edge 15+
  - 现代浏览器普遍支持
  - 建议同时配置 Gzip 和 Brotli（服务器自动选择）

- **配置方法**
  - 类似 Gzip，可构建时预压缩或服务器动态压缩
  - Nginx 需要安装 `ngx_brotli` 模块
  - 构建工具使用 `vite-plugin-compression` 配置

### 3. 缓存策略

#### 浏览器缓存

- **Cache-Control 响应头**
  - `max-age`: 资源缓存时间（秒）
  - `no-cache`: 使用前必须验证
  - `no-store`: 不缓存
  - `public`: 可被任何缓存缓存
  - `private`: 只能被浏览器缓存
  - `must-revalidate`: 过期后必须重新验证

- **ETag 和 Last-Modified**
  - ETag: 基于文件内容的唯一标识
  - Last-Modified: 文件最后修改时间
  - 用于协商缓存，检查资源是否更新

- **Expires vs Cache-Control**
  - Expires: HTTP/1.0 标准，指定绝对过期时间
  - Cache-Control: HTTP/1.1 标准，更灵活
  - 同时存在时 Cache-Control 优先级更高

- **强缓存 vs 协商缓存**
  - **强缓存**: 不发送请求，直接使用缓存（200 from cache）
  - **协商缓存**: 发送请求验证，未变化返回 304（304 Not Modified）
  - 静态资源适合强缓存，HTML 适合协商缓存

#### CDN 缓存

- **CDN 缓存规则配置**
  - 设置缓存时间（TTL）
  - 配置缓存键（Cache Key）
  - 设置缓存层级

- **缓存失效策略**
  - 通过文件名 hash 实现缓存更新
  - 主动刷新（Purge）
  - 预热（Preload）重要资源

- **缓存预热**
  - 新资源部署后主动请求，填充 CDN 缓存
  - 提升首次访问性能

### 4. 资源路径配置

#### 绝对路径 vs 相对路径

- **base 配置（Vite）**
  - `base: '/'`: 绝对路径，适用于根域名部署
  - `base: './'`: 相对路径，适用于任意路径部署
  - `base: '/subpath/'`: 子路径部署

- **publicPath 配置（Webpack）**
  - 类似 Vite 的 base
  - 影响所有资源的引用路径
  - 生产环境通常设置为 `'/'` 或 CDN 地址

- **子路径部署场景**
  - 项目部署在域名的子路径下（如 `/app/`）
  - 需要正确配置 base/publicPath
  - 路由也需要配置 base（Vue Router、React Router）

- **路径问题的排查方法**
  - 检查浏览器控制台的 404 错误
  - 检查构建后的 HTML 中的资源路径
  - 使用 Network 面板查看实际请求路径

### 5. 代码分割和懒加载

#### 代码分割策略

- **入口分割**
  - 多个入口文件，分别打包
  - 适合多页面应用

- **动态导入（import()）**
  - ES2020 动态 import 语法
  - 返回 Promise，实现按需加载
  - 自动进行代码分割

- **SplitChunksPlugin 配置（Webpack）**
  - 分离第三方库（vendor）
  - 分离公共代码（common）
  - 配置缓存组（cacheGroups）

- **rollup chunk 配置（Vite）**
  - 通过 `rollupOptions.output.manualChunks` 手动分割
  - 函数形式动态分割
  - 基于模块路径或名称分割

#### 路由懒加载

- **Vue Router 懒加载**
  ```javascript
  // 方式 1: 动态 import
  const routes = [
    {
      path: '/about',
      component: () => import('./views/About.vue')
    }
  ]
  
  // 方式 2: 使用 webpackChunkName 注释
  const About = () => import(/* webpackChunkName: "about" */ './views/About.vue')
  ```

- **React Router 懒加载**
  ```javascript
  import { lazy, Suspense } from 'react'
  
  const About = lazy(() => import('./views/About'))
  
  function App() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/about" element={<About />} />
        </Routes>
      </Suspense>
    )
  }
  ```

- **预加载策略**
  - `<link rel="preload">`: 预加载关键资源
  - `<link rel="prefetch">`: 预取可能需要的资源
  - 使用 `import.meta.preload` 或 `import.meta.prefetch`（Vite）

## 实战任务

### 任务 1: 配置生产环境构建

#### Vite 项目配置

1. **基础生产配置**

   - 修改 `vite.config.ts`，添加生产构建配置
   - 配置环境变量
   - 设置构建输出目录和文件名策略

2. **配置示例**
   ```typescript
   // vite.config.ts
   import { defineConfig } from 'vite'
   import vue from '@vitejs/plugin-vue'
   import { resolve } from 'path'
   
   export default defineConfig({
     plugins: [vue()],
     
     // 基础路径配置
     base: '/',
     
     // 构建配置
     build: {
       // 输出目录
       outDir: 'dist',
       // 静态资源目录
       assetsDir: 'assets',
       
       // 文件名配置（包含 hash）
       rollupOptions: {
         output: {
           // chunk 文件名
           chunkFileNames: 'assets/js/[name]-[hash].js',
           // 入口文件名
           entryFileNames: 'assets/js/[name]-[hash].js',
           // 静态资源文件名
           assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
           // 手动代码分割
           manualChunks(id) {
             // 将 node_modules 中的依赖单独打包
             if (id.includes('node_modules')) {
               return 'vendor'
             }
           }
         }
       },
       
       // 压缩配置
       minify: 'terser',
       terserOptions: {
         compress: {
           // 移除 console
           drop_console: true,
           // 移除 debugger
           drop_debugger: true
         }
       },
       
       // 代码分割配置
       chunkSizeWarningLimit: 1000,
       
       // 生成 sourcemap（生产环境建议关闭）
       sourcemap: false
     }
   })
   ```

3. **环境变量配置**
   ```bash
   # .env.production
   VITE_API_BASE_URL=https://api.example.com
   VITE_APP_TITLE=生产环境
   ```
   
   ```typescript
   // 在代码中使用
   const apiUrl = import.meta.env.VITE_API_BASE_URL
   ```

#### Webpack 项目配置

1. **基础生产配置**

   - 修改 `webpack.config.js`，设置 mode: 'production'
   - 配置代码压缩和优化插件

2. **配置示例**
   ```javascript
   // webpack.config.js
   const path = require('path')
   const TerserPlugin = require('terser-webpack-plugin')
   
   module.exports = {
     mode: 'production',
     
     entry: {
       main: './src/main.js'
     },
     
     output: {
       path: path.resolve(__dirname, 'dist'),
       filename: 'assets/js/[name]-[contenthash].js',
       chunkFilename: 'assets/js/[name]-[contenthash].js',
       clean: true,
       publicPath: '/'
     },
     
     optimization: {
       minimize: true,
       minimizer: [
         new TerserPlugin({
           terserOptions: {
             compress: {
               drop_console: true,
               drop_debugger: true
             }
           }
         })
       ],
       splitChunks: {
         chunks: 'all',
         cacheGroups: {
           // 第三方库单独打包
           vendor: {
             test: /[\\/]node_modules[\\/]/,
             name: 'vendors',
             priority: 10,
             reuseExistingChunk: true
           },
           // 公共代码提取
           common: {
             minChunks: 2,
             priority: 5,
             reuseExistingChunk: true
           }
         }
       }
     }
   }
   ```

3. **环境变量配置**
   ```javascript
   // webpack.config.js
   const webpack = require('webpack')
   
   module.exports = {
     plugins: [
       new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production'),
         'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL)
       })
     ]
   }
   ```

### 任务 2: 实践资源压缩

1. **构建前后对比**

   - 记录构建前的资源大小
   - 执行生产构建：`npm run build` 或 `yarn build`
   - 记录构建后的资源大小
   - 对比压缩效果

2. **启用 Gzip 压缩（Vite）**

   ```bash
   # 安装插件
   npm install vite-plugin-compression -D
   ```
   
   ```typescript
   // vite.config.ts
   import viteCompression from 'vite-plugin-compression'
   
   export default defineConfig({
     plugins: [
       vue(),
       viteCompression({
         algorithm: 'gzip',
         ext: '.gz',
         threshold: 1024, // 只压缩大于 1KB 的文件
         deleteOriginFile: false // 保留原文件
       })
     ]
   })
   ```

3. **启用 Brotli 压缩（Vite）**

   ```typescript
   // vite.config.ts
   import viteCompression from 'vite-plugin-compression'
   
   export default defineConfig({
     plugins: [
       vue(),
       viteCompression({
         algorithm: 'brotliCompress',
         ext: '.br',
         threshold: 1024
       }),
       viteCompression({
         algorithm: 'gzip',
        ext: '.gz',
        threshold: 1024
       })
     ]
   })
   ```

4. **验证压缩效果**

   - 构建后检查 dist 目录，应该看到 `.gz` 和 `.br` 文件
   - 使用浏览器 DevTools Network 面板查看响应头
   - 检查 `Content-Encoding: gzip` 或 `Content-Encoding: br`

### 任务 3: 配置缓存策略

1. **在构建工具中配置文件名 Hash**

   - **Vite**: 默认已启用 hash，格式为 `[name]-[hash]`
   - **Webpack**: 配置 `[contenthash]` 确保内容变化时 hash 变化
   
   ```javascript
   // webpack.config.js
   output: {
     filename: 'assets/js/[name]-[contenthash:8].js',
     chunkFilename: 'assets/js/[name]-[contenthash:8].js',
     assetModuleFilename: 'assets/[ext]/[name]-[hash:8].[ext]'
   }
   ```

2. **配置服务器缓存响应头（Nginx）**

   ```nginx
   server {
     listen 80;
     server_name example.com;
     
     root /var/www/html;
     index index.html;
     
     # 静态资源长期缓存（1年）
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
       access_log off;
     }
     
     # HTML 文件不缓存或短期缓存
     location ~* \.html$ {
       expires -1;
       add_header Cache-Control "no-cache, no-store, must-revalidate";
       add_header Pragma "no-cache";
     }
     
     # 启用 ETag
     etag on;
   }
   ```

3. **配置服务器缓存响应头（Apache）**

   ```apache
   # .htaccess
   <IfModule mod_expires.c>
     ExpiresActive On
     
     # 静态资源 1 年
     ExpiresByType application/javascript "access plus 1 year"
     ExpiresByType text/css "access plus 1 year"
     ExpiresByType image/png "access plus 1 year"
     ExpiresByType image/jpg "access plus 1 year"
     ExpiresByType image/jpeg "access plus 1 year"
     
     # HTML 不缓存
     ExpiresByType text/html "access plus 0 seconds"
   </IfModule>
   
   <IfModule mod_headers.c>
     # 静态资源强缓存
     <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg)$">
       Header set Cache-Control "public, max-age=31536000, immutable"
     </FilesMatch>
     
     # HTML 不缓存
     <FilesMatch "\.html$">
       Header set Cache-Control "no-cache, no-store, must-revalidate"
     </FilesMatch>
   </IfModule>
   ```

4. **测试缓存效果**

   - 使用浏览器 DevTools Network 面板
   - 首次加载：查看响应头 `Cache-Control` 和 `ETag`
   - 刷新页面：查看是否返回 `304 Not Modified`
   - 修改文件后重新构建：检查 hash 变化，文件重新加载

### 任务 4: 配置资源路径

1. **测试不同 base 配置（Vite）**

   ```typescript
   // vite.config.ts
   
   // 场景 1: 根域名部署
   export default defineConfig({
     base: '/',
     // 生成的路径: /assets/js/main.js
   })
   
   // 场景 2: 相对路径部署（任意路径）
   export default defineConfig({
     base: './',
     // 生成的路径: ./assets/js/main.js
   })
   
   // 场景 3: 子路径部署
   export default defineConfig({
     base: '/my-app/',
     // 生成的路径: /my-app/assets/js/main.js
   })
   ```

2. **配置 Vue Router base（子路径部署）**

   ```javascript
   // router/index.js
   import { createRouter, createWebHistory } from 'vue-router'
   
   const router = createRouter({
     history: createWebHistory('/my-app/'), // 与 vite.config.ts 中的 base 保持一致
     routes: [...]
   })
   ```

3. **验证路径配置**

   - 在不同 base 配置下构建项目
   - 检查 `dist/index.html` 中的资源路径
   - 使用本地服务器测试资源加载
   - 检查浏览器控制台是否有 404 错误

### 任务 5: 实现代码分割和懒加载

1. **配置代码分割（Vite）**

   ```typescript
   // vite.config.ts
   export default defineConfig({
     build: {
       rollupOptions: {
         output: {
           manualChunks(id) {
             // node_modules 单独打包
             if (id.includes('node_modules')) {
               // 将大型库单独打包
               if (id.includes('vue')) {
                 return 'vue-vendor'
               }
               if (id.includes('vue-router')) {
                 return 'router-vendor'
               }
               // 其他第三方库
               return 'vendor'
             }
           }
         }
       }
     }
   })
   ```

2. **配置代码分割（Webpack）**

   ```javascript
   // webpack.config.js
   optimization: {
     splitChunks: {
       chunks: 'all',
       cacheGroups: {
         vue: {
           test: /[\\/]node_modules[\\/](vue|vue-router|vuex)[\\/]/,
           name: 'vue-vendor',
           priority: 20
         },
         vendor: {
           test: /[\\/]node_modules[\\/]/,
           name: 'vendors',
           priority: 10
         },
         common: {
           minChunks: 2,
           priority: 5,
           reuseExistingChunk: true
         }
       }
     }
   }
   ```

3. **实现路由懒加载（Vue Router）**

   ```javascript
   // router/index.js
   import { createRouter, createWebHistory } from 'vue-router'
   
   const routes = [
     {
       path: '/',
       component: () => import('../views/Home.vue')
     },
     {
       path: '/about',
       // 使用 webpackChunkName 指定 chunk 名称
       component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
     },
     {
       path: '/user/:id',
       component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
     }
   ]
   
   const router = createRouter({
     history: createWebHistory(),
     routes
   })
   
   export default router
   ```

4. **实现路由懒加载（React Router）**

   ```javascript
   // App.jsx
   import { lazy, Suspense } from 'react'
   import { BrowserRouter, Routes, Route } from 'react-router-dom'
   
   const Home = lazy(() => import('./views/Home'))
   const About = lazy(() => import('./views/About'))
   
   function App() {
     return (
       <BrowserRouter>
         <Suspense fallback={<div>Loading...</div>}>
           <Routes>
             <Route path="/" element={<Home />} />
             <Route path="/about" element={<About />} />
           </Routes>
         </Suspense>
       </BrowserRouter>
     )
   }
   ```

5. **分析构建产物**

   - 执行构建：`npm run build`
   - 查看 `dist` 目录中的文件结构
   - 检查 chunk 数量和大小
   - 使用工具分析 bundle 大小（如 `webpack-bundle-analyzer`）
   - 验证路由懒加载是否生效（Network 面板查看按需加载）

### 任务 6: 性能对比分析

1. **构建前记录**

   - 执行构建，记录以下指标：
     - 构建产物总大小（`du -sh dist`）
     - 单个文件最大大小
     - 文件数量（`find dist -type f | wc -l`）
     - 构建时间（记录 `npm run build` 的执行时间）
     - JS 文件总大小
     - CSS 文件总大小

2. **优化后记录**

   - 完成所有优化配置后，重新构建
   - 重新记录上述所有指标
   - 计算优化比例：
     ```
     优化比例 = (优化前大小 - 优化后大小) / 优化前大小 × 100%
     ```

3. **生成对比报告**

   | 指标 | 优化前 | 优化后 | 优化比例 |
   |------|--------|--------|----------|
   | 构建产物总大小 | XX MB | XX MB | XX% |
   | 最大单个文件 | XX KB | XX KB | XX% |
   | 文件数量 | XX 个 | XX 个 | - |
   | 构建时间 | XX 秒 | XX 秒 | XX% |
   | JS 总大小 | XX KB | XX KB | XX% |
   | CSS 总大小 | XX KB | XX KB | XX% |
   | Gzip 后大小 | - | XX KB | - |

4. **记录优化措施和效果**

   - 列出实施的优化措施
   - 记录每个优化措施的效果
   - 总结最佳实践和注意事项

## 需要关注的知识点

### 1. 构建工具选择

- **Vite**
  - 优势：开发体验好，构建速度快，配置简单
  - 适用：新项目、中小型项目
  - 技术栈：基于 Rollup，支持 Vue、React、Svelte 等

- **Webpack**
  - 优势：生态成熟，配置灵活，插件丰富
  - 适用：复杂项目、需要精细控制的项目
  - 技术栈：JavaScript 模块打包器，支持各种资源类型

### 2. 文件名 Hash 策略

- **Hash**: 基于文件内容，内容不变 hash 不变
  - 适用于：所有文件类型
  - 问题：依赖变化会导致 hash 变化，即使文件本身没变

- **ContentHash**: 更细粒度，依赖变化时才变化
  - 适用于：CSS、JS 等代码文件
  - 优势：只有代码变化时 hash 才变化，最大化缓存利用

- **ChunkHash**: 基于 chunk，chunk 变化时变化
  - 适用于：按 chunk 分割的文件
  - 注意：chunk 内任何文件变化都会导致 hash 变化

### 3. 缓存策略选择

- **静态资源（JS、CSS、图片）**
  - 策略：长期缓存（如 1 年），通过文件名 hash 更新
  - 配置：`Cache-Control: public, max-age=31536000, immutable`
  - 原理：文件名包含 hash，内容变化文件名变化，浏览器自动更新

- **HTML 文件**
  - 策略：短期缓存或不缓存，确保及时更新
  - 配置：`Cache-Control: no-cache` 或 `max-age=0`
  - 原理：HTML 是入口文件，需要及时获取最新版本

- **API 响应**
  - 策略：根据业务需求配置
  - 配置：根据数据更新频率设置缓存时间
  - 注意：动态数据通常不缓存或短时间缓存

### 4. 代码分割最佳实践

- **第三方库单独打包**
  - 原因：第三方库变化频率低，单独打包可最大化缓存
  - 实现：使用 `splitChunks` 或 `manualChunks` 配置

- **公共代码提取**
  - 原因：避免重复代码，减少总体积
  - 实现：提取多个页面/组件共享的代码

- **路由级别分割**
  - 原因：实现按需加载，提升首屏性能
  - 实现：使用动态 `import()` 和路由懒加载

- **避免过度分割**
  - 原因：HTTP/2 多路复用，过多小文件可能影响性能
  - 建议：chunk 大小控制在 100KB-500KB 之间

### 5. 常见问题和解决方案

**问题 1: 部署后资源 404**

- **原因**: 路径配置错误（base/publicPath 配置不正确）
- **症状**: 浏览器控制台出现 404 错误，资源无法加载
- **解决**:
  1. 检查 `vite.config.ts` 中的 `base` 配置
  2. 检查 `webpack.config.js` 中的 `publicPath` 配置
  3. 确认部署路径与配置一致
  4. 检查 `dist/index.html` 中的资源路径是否正确

**问题 2: 缓存不生效**

- **原因**: 服务器未配置缓存响应头
- **症状**: 每次访问都重新下载资源，响应头中没有 `Cache-Control`
- **解决**:
  1. 配置 Nginx 或 Apache 的缓存响应头
  2. 检查服务器配置是否正确生效
  3. 使用浏览器 DevTools 验证响应头

**问题 3: 构建产物过大**

- **原因**: 未启用压缩、未代码分割、包含了未使用的代码
- **症状**: 构建后的文件很大，加载时间长
- **解决**:
  1. 启用代码压缩（terser/minify）
  2. 配置代码分割，分离第三方库
  3. 使用 Tree Shaking 移除未使用的代码
  4. 使用打包分析工具找出大文件

**问题 4: 更新后用户看到旧版本**

- **原因**: 浏览器缓存了 HTML 文件，文件名 hash 未变化
- **症状**: 部署新版本后，用户仍看到旧版本
- **解决**:
  1. 确保 HTML 文件使用协商缓存或禁用缓存
  2. 确保资源文件名包含 hash，内容变化时 hash 变化
  3. 配置 HTML 文件的 `Cache-Control: no-cache`

**问题 5: 代码分割后加载顺序错误**

- **原因**: 动态导入的模块加载顺序不确定
- **症状**: 某些功能无法正常工作，控制台报错
- **解决**:
  1. 使用 `preload` 预加载关键 chunk
  2. 检查异步组件的加载逻辑
  3. 确保路由懒加载的正确使用

## 学习检查清单

完成以下检查项，确保掌握 Day 1 内容：

- [ ] 理解生产环境构建的关键配置
- [ ] 能够配置 Vite 或 Webpack 的生产构建
- [ ] 理解 Gzip 和 Brotli 压缩的区别和适用场景
- [ ] 能够配置资源压缩（构建工具或服务器）
- [ ] 理解浏览器缓存的两种机制（强缓存、协商缓存）
- [ ] 能够配置静态资源的缓存策略
- [ ] 理解绝对路径和相对路径的区别和使用场景
- [ ] 能够正确配置资源路径，避免部署问题
- [ ] 理解代码分割的原理和好处
- [ ] 能够配置代码分割和实现路由懒加载
- [ ] 完成优化前后的性能对比分析
- [ ] 记录了学习笔记和遇到的问题

## 参考资源

- [Vite 生产构建文档](https://cn.vitejs.dev/guide/build.html)
- [Webpack 生产环境配置](https://webpack.js.org/guides/production/)
- [MDN - HTTP 缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching)
- [Web.dev - 代码分割](https://web.dev/code-splitting-suspense/)
- [Web.dev - 压缩文本](https://web.dev/reduce-network-payloads-using-text-compression/)
- [Webpack Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)

## 学习时间分配建议

- **理论学习**: 1.5 小时
  - 构建工具生产配置: 30 分钟
  - 资源压缩原理: 20 分钟
  - 缓存策略: 30 分钟
  - 代码分割和懒加载: 30 分钟
  - 资源路径配置: 10 分钟

- **实践操作**: 2.5 小时
  - 配置生产构建: 40 分钟
  - 资源压缩实践: 30 分钟
  - 缓存策略配置: 30 分钟
  - 代码分割和懒加载: 40 分钟
  - 性能对比分析: 20 分钟

- **总结笔记**: 30 分钟
  - 记录关键配置和代码
  - 记录遇到的问题和解决方案
  - 总结优化效果和最佳实践

## 实战练习建议

1. **选择一个现有项目**
   - 可以是 Vue 项目或 React 项目
   - 如果没有，可以快速创建一个示例项目

2. **按照任务顺序实践**
   - 从基础配置开始，逐步添加优化
   - 每完成一个任务，测试验证效果

3. **记录实践过程**
   - 记录配置步骤
   - 记录遇到的问题和解决方案
   - 记录优化前后的对比数据

4. **总结最佳实践**
   - 整理常用的配置模板
   - 总结不同场景下的最佳配置
   - 形成自己的部署配置规范

