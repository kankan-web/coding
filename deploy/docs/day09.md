# Day 9: Git 工作流和版本管理 - 详细学习计划

## 学习目标

完成本日学习后，你将能够：

- 理解并掌握三种主流 Git 分支策略（Git Flow、GitHub Flow、Trunk-Based），能够根据项目特点选择合适的策略
- 掌握语义化版本管理（semver），规范版本号命名
- 熟练配置和使用 pre-commit hooks，实现代码质量和规范检查
- 理解代码审查流程，掌握 Pull Request 规范和最佳实践
- 掌握提交信息规范（Conventional Commits），提升代码可追溯性
- **核心目标**：建立规范的 Git 工作流程，提升团队协作效率

## 学习时间分配

- **理论学习**: 2-2.5 小时
- **实践操作**: 3-4 小时
- **配置和测试**: 1 小时
- **总结和文档**: 30 分钟

## 核心知识点

### 1. Git 分支策略

#### 1.1 Git Flow 策略

**Git Flow 简介**

Git Flow 是一种经典的分支管理模型，适合需要严格版本控制和发布流程的项目。它定义了明确的分支类型和使用规则。

**分支类型**

- **main/master**: 生产环境代码，永远稳定可部署
- **develop**: 开发主分支，集成分支，包含最新开发特性
- **feature/**: 功能分支，从 develop 分支创建，开发完成后合并回 develop
- **release/**: 发布分支，从 develop 创建，用于准备发布，修复 bug，完成后合并到 main 和 develop
- **hotfix/**: 热修复分支，从 main 创建，紧急修复生产问题，完成后合并到 main 和 develop

**Git Flow 工作流程**

```bash
# 1. 初始化 Git Flow（需要安装 git-flow 工具）
git flow init

# 2. 开始开发新功能
git flow feature start feature-name
# 等价于：
git checkout -b feature/feature-name develop

# 3. 完成功能开发
git flow feature finish feature-name
# 等价于：
git checkout develop
git merge --no-ff feature/feature-name
git branch -d feature/feature-name

# 4. 开始发布准备
git flow release start 1.0.0
# 等价于：
git checkout -b release/1.0.0 develop

# 5. 完成发布
git flow release finish 1.0.0
# 等价于：
git checkout main
git merge --no-ff release/1.0.0
git tag -a 1.0.0
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0

# 6. 紧急修复
git flow hotfix start 1.0.1
# 等价于：
git checkout -b hotfix/1.0.1 main

# 7. 完成热修复
git flow hotfix finish 1.0.1
# 等价于：
git checkout main
git merge --no-ff hotfix/1.0.1
git tag -a 1.0.1
git checkout develop
git merge --no-ff hotfix/1.0.1
git branch -d hotfix/1.0.1
```

**Git Flow 优缺点**

**优点**：
- 版本控制严格，适合需要长期维护的项目
- 分支职责清晰，协作流程规范
- 支持多版本并行维护

**缺点**：
- 流程复杂，学习成本高
- 分支过多，维护成本高
- 不适合快速迭代的项目

**适用场景**：
- 需要严格版本控制的企业级项目
- 需要支持多版本维护的产品
- 团队规模较大，需要严格流程控制

#### 1.2 GitHub Flow 策略

**GitHub Flow 简介**

GitHub Flow 是 GitHub 推荐的简化分支模型，适合快速迭代和持续部署的项目。它只有两个主要分支：main 和 feature。

**分支类型**

- **main**: 生产环境代码，永远可部署
- **feature/**: 功能分支，从 main 创建，通过 Pull Request 合并回 main

**GitHub Flow 工作流程**

```bash
# 1. 从 main 创建功能分支
git checkout main
git pull origin main
git checkout -b feature/new-feature

# 2. 开发和提交
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. 在 GitHub 创建 Pull Request
# 4. Code Review
# 5. 合并到 main（通过 PR 合并）
# 6. 部署到生产环境

# 7. 紧急修复：直接在 main 创建 hotfix 分支
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug
# 修复后直接合并到 main
```

**GitHub Flow 优缺点**

**优点**：
- 流程简单，易于理解和实施
- 适合快速迭代和持续部署
- 减少分支管理复杂度

**缺点**：
- 不适合需要严格版本控制的项目
- 功能分支可能堆积，需要及时清理

**适用场景**：
- 快速迭代的 Web 应用
- 团队规模较小，协作简单
- 持续部署的项目

#### 1.3 Trunk-Based Development 策略

**Trunk-Based 简介**

Trunk-Based Development（基于主干的开发）是一种极简分支策略，所有开发都在 main 分支进行，通过短生命周期分支和特性开关控制功能。

**分支类型**

- **main**: 唯一的长期分支，所有代码都在这里
- **feature/**: 短生命周期分支（1-2 天），快速合并到 main

**Trunk-Based 工作流程**

```bash
# 1. 保持 main 分支最新
git checkout main
git pull origin main

# 2. 创建短生命周期分支（可选）
git checkout -b feature/quick-fix

# 3. 快速开发和提交（小步快跑）
git add .
git commit -m "feat: add feature toggle"
git push origin feature/quick-fix

# 4. 立即创建 PR 并合并（1-2 天内完成）
# 5. 通过特性开关控制功能发布
```

**特性开关（Feature Flags）**

```javascript
// 使用特性开关控制功能发布
if (featureFlags.enableNewFeature) {
  // 新功能代码
  renderNewFeature();
} else {
  // 旧功能代码
  renderOldFeature();
}
```

**Trunk-Based 优缺点**

**优点**：
- 简化分支管理，减少合并冲突
- 促进持续集成和持续部署
- 减少上下文切换成本

**缺点**：
- 要求团队协作能力高
- 需要完善的测试和 CI/CD
- 不适合大规模重构

**适用场景**：
- 高度自动化的 CI/CD 环境
- 团队协作能力强
- 需要频繁发布的项目

#### 1.4 分支策略选择指南

**选择因素**

| 因素 | Git Flow | GitHub Flow | Trunk-Based |
|------|----------|-------------|-------------|
| 团队规模 | 中大型 | 中小型 | 任何规模 |
| 发布频率 | 定期发布 | 频繁发布 | 持续发布 |
| 版本维护 | 多版本 | 单版本 | 单版本 |
| 流程复杂度 | 高 | 中 | 低 |
| 学习成本 | 高 | 低 | 中 |

**选择建议**

- **选择 Git Flow**：需要严格版本控制，多版本并行维护
- **选择 GitHub Flow**：快速迭代的 Web 应用，团队规模中小
- **选择 Trunk-Based**：高度自动化，持续集成和部署

### 2. 版本标签管理

#### 2.1 语义化版本（SemVer）

**语义化版本规范**

语义化版本号格式：`MAJOR.MINOR.PATCH`

- **MAJOR（主版本号）**：不兼容的 API 修改
- **MINOR（次版本号）**：向下兼容的功能性新增
- **PATCH（修订号）**：向下兼容的问题修正

**版本号示例**

```
1.0.0  # 初始版本
1.0.1  # 修复 bug
1.1.0  # 新增功能（向下兼容）
2.0.0  # 重大更新（不兼容）
2.0.1  # 修复 bug
2.1.0  # 新增功能
```

**预发布版本**

```
1.0.0-alpha.1    # 内部测试版本
1.0.0-beta.1     # 公开测试版本
1.0.0-rc.1       # 发布候选版本
1.0.0            # 正式版本
```

#### 2.2 Git 标签操作

**创建标签**

```bash
# 创建轻量标签（lightweight tag）
git tag v1.0.0

# 创建附注标签（annotated tag，推荐）
git tag -a v1.0.0 -m "Release version 1.0.0"

# 在指定提交创建标签
git tag -a v1.0.0 9fceb02 -m "Release version 1.0.0"

# 创建预发布标签
git tag -a v1.0.0-alpha.1 -m "Alpha release 1.0.0"
```

**查看标签**

```bash
# 列出所有标签
git tag

# 按模式过滤标签
git tag -l "v1.0.*"

# 查看标签详细信息
git show v1.0.0

# 查看标签列表和提交信息
git tag -n
```

**推送标签**

```bash
# 推送单个标签
git push origin v1.0.0

# 推送所有标签
git push origin --tags

# 推送所有标签（包括远程已删除的）
git push origin --follow-tags
```

**删除标签**

```bash
# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
# 或
git push origin :refs/tags/v1.0.0
```

#### 2.3 版本管理最佳实践

**版本号规范**

```bash
# 1. 使用语义化版本号
v1.0.0  # 正确
v1.0    # 不推荐
1.0.0   # 可以，但推荐加 v 前缀

# 2. 标签命名规范
v1.0.0           # 正式版本
v1.0.0-alpha.1   # Alpha 版本
v1.0.0-beta.1    # Beta 版本
v1.0.0-rc.1      # 候选版本

# 3. 标签信息规范
git tag -a v1.0.0 -m "Release v1.0.0

- 新增用户登录功能
- 修复首页加载问题
- 优化性能"
```

**自动化版本管理**

```json
// package.json 中使用语义化版本
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "version": "npm version patch",      // 1.0.0 -> 1.0.1
    "version:minor": "npm version minor", // 1.0.0 -> 1.1.0
    "version:major": "npm version major"  // 1.0.0 -> 2.0.0
  }
}
```

```bash
# npm version 会自动：
# 1. 更新 package.json 版本号
# 2. 创建 Git 提交
# 3. 创建 Git 标签
npm version patch
```

### 3. 预提交钩子（Pre-commit Hooks）

#### 3.1 Git Hooks 简介

**Git Hooks 类型**

- **pre-commit**: 提交前执行，可以阻止提交
- **commit-msg**: 提交信息检查
- **pre-push**: 推送前执行
- **post-merge**: 合并后执行

**Hooks 位置**

```bash
# 项目本地 hooks（仅影响当前仓库）
.git/hooks/

# 全局 hooks（影响所有仓库）
git config --global core.hooksPath ~/.git-hooks
```

#### 3.2 使用 Husky 管理 Hooks

**安装 Husky**

```bash
# 安装 husky
npm install --save-dev husky

# 初始化 husky
npx husky install

# 在 package.json 中添加 prepare 脚本
npm pkg set scripts.prepare="husky install"
```

**配置 Pre-commit Hook**

```bash
# 创建 pre-commit hook
npx husky add .husky/pre-commit "npm run lint"

# 或手动创建 .husky/pre-commit 文件
```

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 运行 lint 检查
npm run lint

# 运行测试
npm run test

# 运行格式化检查
npm run format:check
```

#### 3.3 代码检查工具配置

**ESLint 配置**

```json
// package.json
{
  "scripts": {
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
  },
  "devDependencies": {
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^5.0.0",
    "@typescript-eslint/parser": "^5.0.0"
  }
}
```

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended'
  ],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error'
  }
};
```

**Prettier 配置**

```json
// package.json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\""
  },
  "devDependencies": {
    "prettier": "^2.8.0"
  }
}
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

**使用 lint-staged 优化性能**

```bash
# 安装 lint-staged
npm install --save-dev lint-staged
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**TypeScript 类型检查**

```json
// package.json
{
  "scripts": {
    "type-check": "tsc --noEmit"
  }
}
```

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npx lint-staged
```

#### 3.4 提交信息检查 Hook

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 使用 commitlint 检查提交信息
npx --no -- commitlint --edit "$1"
```

```bash
# 安装 commitlint
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复 bug
        'docs',     // 文档变更
        'style',    // 代码格式（不影响代码运行）
        'refactor', // 重构（既不是新增功能，也不是修复 bug）
        'perf',     // 性能优化
        'test',     // 增加测试
        'chore',    // 构建过程或辅助工具的变动
        'revert',   // 回滚
        'build',    // 打包
        'ci',       // CI 配置
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
  },
};
```

### 4. 代码审查流程（Pull Request）

#### 4.1 Pull Request 规范

**PR 标题规范**

遵循 Conventional Commits 格式：

```
feat: 添加用户登录功能
fix: 修复首页加载错误
docs: 更新 README 文档
style: 格式化代码
refactor: 重构用户模块
perf: 优化图片加载性能
test: 添加用户登录测试
chore: 更新依赖版本
```

**PR 描述模板**

```markdown
## 变更类型
- [ ] 新功能 (feature)
- [ ] Bug 修复 (fix)
- [ ] 文档更新 (docs)
- [ ] 代码重构 (refactor)
- [ ] 性能优化 (perf)
- [ ] 测试相关 (test)
- [ ] 构建相关 (chore)

## 变更描述
简要描述本次 PR 的变更内容

## 相关 Issue
Closes #123

## 变更清单
- [ ] 功能点 1
- [ ] 功能点 2

## 测试说明
1. 测试步骤
2. 预期结果

## 截图（如适用）
[添加相关截图]

## 检查清单
- [ ] 代码已通过 lint 检查
- [ ] 已添加必要的测试
- [ ] 文档已更新
- [ ] 已自测通过
```

#### 4.2 PR 审查清单

**代码审查要点**

1. **功能正确性**
   - 代码是否实现预期功能
   - 边界情况是否处理
   - 错误处理是否完善

2. **代码质量**
   - 代码可读性和可维护性
   - 是否符合项目规范
   - 是否有重复代码

3. **性能考虑**
   - 是否有性能问题
   - 是否引入不必要的依赖
   - 资源使用是否合理

4. **安全性**
   - 是否存在安全漏洞
   - 用户输入是否验证
   - 敏感信息是否泄露

5. **测试覆盖**
   - 是否添加必要测试
   - 测试是否充分
   - 测试是否通过

#### 4.3 PR 审查流程

**审查流程**

```bash
# 1. 创建功能分支
git checkout -b feature/new-feature

# 2. 开发和提交
git add .
git commit -m "feat: add new feature"
git push origin feature/new-feature

# 3. 在 GitHub/GitLab 创建 PR
# 4. 等待审查（至少 1 人审查）
# 5. 根据审查意见修改
git add .
git commit -m "fix: address review comments"
git push origin feature/new-feature

# 6. 审查通过后合并
# 7. 删除功能分支
git checkout main
git pull origin main
git branch -d feature/new-feature
```

**审查最佳实践**

- **及时审查**：PR 创建后尽快审查，避免阻塞
- **友好沟通**：审查意见要具体、友好、建设性
- **小步提交**：保持 PR 小而专注，便于审查
- **自动化检查**：利用 CI/CD 自动化检查，减少人工审查负担

### 5. 提交信息规范（Conventional Commits）

#### 5.1 Conventional Commits 规范

**提交信息格式**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type 类型**

- **feat**: 新功能
- **fix**: 修复 bug
- **docs**: 文档变更
- **style**: 代码格式（不影响代码运行）
- **refactor**: 重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **ci**: CI 配置变更
- **build**: 构建系统变更
- **revert**: 回滚提交

**提交信息示例**

```bash
# 简单提交（只有 type 和 subject）
feat: 添加用户登录功能

# 带 scope 的提交
feat(auth): 添加用户登录功能

# 完整格式提交
feat(auth): 添加用户登录功能

实现了用户登录、注册、密码重置功能

Closes #123
```

#### 5.2 提交信息最佳实践

**好的提交信息**

```bash
feat: 添加用户登录功能
fix: 修复首页加载错误
docs: 更新 API 文档
style: 格式化代码
refactor: 重构用户模块
perf: 优化图片加载性能
test: 添加用户登录测试
chore: 更新依赖版本
```

**不好的提交信息**

```bash
# 太模糊
update code
fix bug
changes

# 没有类型前缀
添加登录功能
修复错误

# 使用中文类型（不一致）
新功能: 添加登录
修复: 修复错误
```

#### 5.3 提交信息工具

**使用 commitizen 规范提交**

```bash
# 安装 commitizen
npm install -g commitizen
npm install --save-dev cz-conventional-changelog
```

```json
// package.json
{
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "scripts": {
    "commit": "cz"
  }
}
```

```bash
# 使用 commitizen 提交
npm run commit
# 或
git cz
```

**交互式提交流程**

```
? Select the type of change (选择变更类型)
> feat:     A new feature
  fix:      A bug fix
  docs:     Documentation only changes
  style:    Changes that do not affect the meaning of the code
  refactor: A code change that neither fixes a bug nor adds a feature
  perf:     A code change that improves performance
  test:     Adding missing tests or correcting existing tests
  chore:    Changes to the build process or auxiliary tools

? What is the scope of this change (变更范围)
> auth

? Write a short, imperative tense description of the change (简短描述)
> 添加用户登录功能

? Provide a longer description of the change (详细描述)
> 实现了用户登录、注册、密码重置功能

? List any breaking changes (破坏性变更)
> 

? Issues this commit closes (相关 Issue)
> #123
```

## 实践任务

### 任务 1: 设计项目 Git 工作流

**任务目标**: 为你的项目选择合适的 Git 分支策略并实施

**实施步骤**:

1. **分析项目特点**
   - 评估项目规模、团队大小、发布频率
   - 确定适合的分支策略（Git Flow / GitHub Flow / Trunk-Based）

2. **创建分支结构**
   ```bash
   # 创建主要分支
   git checkout -b develop
   git push origin develop
   
   # 创建功能分支示例
   git checkout -b feature/user-login develop
   ```

3. **编写工作流文档**
   ```markdown
   # Git 工作流规范
   
   ## 分支策略
   使用 GitHub Flow 策略
   
   ## 分支命名规范
   - feature/: 功能分支
   - hotfix/: 紧急修复分支
   - docs/: 文档更新分支
   
   ## 工作流程
   1. 从 main 创建功能分支
   2. 开发并提交
   3. 创建 PR
   4. Code Review
   5. 合并到 main
   ```

**验收标准**:
- [ ] 确定并实施分支策略
- [ ] 创建必要的分支
- [ ] 编写工作流文档

### 任务 2: 配置 Pre-commit Hooks

**任务目标**: 配置 pre-commit hooks，实现代码质量和规范检查

**实施步骤**:

1. **安装工具**
   ```bash
   npm install --save-dev husky lint-staged
   npm install --save-dev eslint prettier @commitlint/cli @commitlint/config-conventional
   ```

2. **初始化 Husky**
   ```bash
   npx husky install
   npm pkg set scripts.prepare="husky install"
   ```

3. **配置 ESLint**
   ```bash
   # 创建 .eslintrc.js
   # 配置 lint-staged
   ```

4. **配置 Prettier**
   ```bash
   # 创建 .prettierrc
   # 配置 lint-staged
   ```

5. **创建 Pre-commit Hook**
   ```bash
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

6. **创建 Commit-msg Hook**
   ```bash
   npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
   ```

7. **测试 Hooks**
   ```bash
   # 测试 lint 检查
   git add .
   git commit -m "test: test pre-commit hook"
   
   # 测试提交信息检查
   git commit -m "invalid commit message"
   ```

**验收标准**:
- [ ] Husky 配置成功
- [ ] Pre-commit hook 能阻止不合规代码提交
- [ ] Commit-msg hook 能检查提交信息格式
- [ ] lint-staged 只检查暂存文件，提升性能

### 任务 3: 实践代码审查流程

**任务目标**: 通过 Pull Request 实践完整的代码审查流程

**实施步骤**:

1. **创建功能分支**
   ```bash
   git checkout -b feature/git-workflow-demo
   ```

2. **开发功能**
   ```bash
   # 添加一些代码变更
   git add .
   git commit -m "feat: add git workflow demo"
   git push origin feature/git-workflow-demo
   ```

3. **创建 Pull Request**
   - 在 GitHub/GitLab 创建 PR
   - 使用 PR 模板填写描述
   - 添加审查者

4. **代码审查**
   - 审查代码质量
   - 提出修改建议
   - 讨论技术方案

5. **根据审查意见修改**
   ```bash
   git add .
   git commit -m "fix: address review comments"
   git push origin feature/git-workflow-demo
   ```

6. **合并 PR**
   - 审查通过后合并
   - 删除功能分支

**验收标准**:
- [ ] 创建并完成至少一个 PR
- [ ] PR 包含完整的描述和检查清单
- [ ] 完成代码审查流程
- [ ] 根据审查意见修改代码

### 任务 4: 配置提交信息规范检查

**任务目标**: 使用 commitlint 确保提交信息符合 Conventional Commits 规范

**实施步骤**:

1. **安装 commitlint**
   ```bash
   npm install --save-dev @commitlint/cli @commitlint/config-conventional
   ```

2. **创建配置文件**
   ```javascript
   // commitlint.config.js
   module.exports = {
     extends: ['@commitlint/config-conventional'],
     rules: {
       'type-enum': [
         2,
         'always',
         [
           'feat',
           'fix',
           'docs',
           'style',
           'refactor',
           'perf',
           'test',
           'chore',
           'revert',
           'build',
           'ci',
         ],
       ],
     },
   };
   ```

3. **配置 commit-msg hook**
   ```bash
   npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
   ```

4. **测试提交信息检查**
   ```bash
   # 测试错误格式（应该失败）
   git commit -m "invalid message"
   
   # 测试正确格式（应该成功）
   git commit -m "feat: add new feature"
   ```

5. **（可选）配置 commitizen**
   ```bash
   npm install --save-dev commitizen cz-conventional-changelog
   ```

**验收标准**:
- [ ] commitlint 配置成功
- [ ] commit-msg hook 能阻止不合规的提交信息
- [ ] 提交信息符合 Conventional Commits 规范
- [ ] （可选）commitizen 配置成功

## 配置文件示例

### package.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "type-check": "tsc --noEmit",
    "commit": "cz"
  },
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,css}": [
      "prettier --write"
    ]
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  },
  "devDependencies": {
    "husky": "^8.0.0",
    "lint-staged": "^13.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.8.0",
    "@commitlint/cli": "^17.0.0",
    "@commitlint/config-conventional": "^17.0.0",
    "commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0"
  }
}
```

### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run type-check
npx lint-staged
```

### .husky/commit-msg

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
```

### commitlint.config.js

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'build',
        'ci',
      ],
    ],
    'subject-case': [2, 'never', ['upper-case']],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
  },
};
```

### .eslintrc.js

```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'error',
    '@typescript-eslint/no-unused-vars': 'warn',
  },
};
```

### .prettierrc

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "arrowParens": "avoid"
}
```

## 常见问题解答

### Q1: 如何选择合适的分支策略？

**A**: 根据以下因素选择：
- **团队规模**：小团队适合 GitHub Flow，大团队适合 Git Flow
- **发布频率**：频繁发布用 GitHub Flow 或 Trunk-Based，定期发布用 Git Flow
- **项目复杂度**：简单项目用 GitHub Flow，复杂项目用 Git Flow

### Q2: Pre-commit hook 执行太慢怎么办？

**A**: 优化策略：
1. 使用 `lint-staged` 只检查暂存文件
2. 并行执行检查任务
3. 缓存检查结果
4. 将耗时检查移到 CI/CD 中

### Q3: 如何强制团队使用提交信息规范？

**A**: 方法：
1. 配置 `commit-msg` hook 检查提交信息
2. 使用 `commitizen` 引导规范提交
3. 在 CI/CD 中检查提交信息
4. 定期审查和培训

### Q4: Git Flow 和 GitHub Flow 可以混用吗？

**A**: 不建议混用，但可以：
- 在 GitHub Flow 基础上添加 `release/` 分支用于发布准备
- 在 Git Flow 基础上简化流程，减少分支

### Q5: 如何处理合并冲突？

**A**: 策略：
1. **预防**：保持分支小而专注，及时合并 main 分支
2. **解决**：使用 `git rebase` 或 `git merge` 解决冲突
3. **工具**：使用 IDE 或工具（如 VS Code）可视化解决冲突

### Q6: 标签和分支有什么区别？

**A**: 区别：
- **分支**：可变，指向提交，可以继续开发
- **标签**：不可变，指向特定提交，用于标记版本

### Q7: 如何回滚到指定版本？

**A**: 方法：
```bash
# 使用标签回滚
git checkout v1.0.0

# 创建回滚提交
git revert <commit-hash>

# 重置到指定版本（谨慎使用）
git reset --hard <commit-hash>
```

## 学习检查清单

完成本日学习后，检查以下内容：

- [ ] 理解三种 Git 分支策略的特点和适用场景
- [ ] 能够为项目选择合适的分支策略
- [ ] 掌握语义化版本管理，能够创建和管理版本标签
- [ ] 成功配置 pre-commit hooks，实现代码质量检查
- [ ] 掌握 Pull Request 规范，能够创建规范的 PR
- [ ] 理解代码审查流程，能够进行有效的代码审查
- [ ] 配置提交信息规范检查，确保提交信息符合规范
- [ ] 完成所有实践任务
- [ ] 记录学习笔记和最佳实践

## 扩展学习资源

- [Git Flow 官方文档](https://www.git-flow.com/)
- [GitHub Flow 文档](https://docs.github.com/en/get-started/quickstart/github-flow)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)
- [Semantic Versioning 规范](https://semver.org/)
- [Husky 文档](https://typicode.github.io/husky/)
- [Commitlint 文档](https://commitlint.js.org/)
- [ESLint 文档](https://eslint.org/)
- [Prettier 文档](https://prettier.io/)

## 总结

通过本日学习，你应该：

1. **掌握 Git 分支策略**：理解三种主流策略，能够根据项目特点选择
2. **规范版本管理**：使用语义化版本，规范版本标签
3. **自动化代码检查**：配置 pre-commit hooks，保证代码质量
4. **规范代码审查**：掌握 PR 规范和审查流程
5. **规范提交信息**：使用 Conventional Commits，提升代码可追溯性

这些技能将帮助你建立规范的 Git 工作流程，提升团队协作效率和代码质量。

