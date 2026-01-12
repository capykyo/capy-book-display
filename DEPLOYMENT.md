# 部署文档

本文档说明如何将应用部署到 Cloudflare Workers（通过 @opennextjs/cloudflare）。

## 前置要求

1. Cloudflare 账户
2. GitHub 仓库
3. Cloudflare API Token

## 部署方式

### 方式 1: 使用 GitHub Actions（推荐）

项目已配置 GitHub Actions 自动部署工作流。当代码推送到 `main` 或 `master` 分支时，会自动部署到 Cloudflare Workers。

#### 配置步骤

1. **获取 Cloudflare API Token**
   - 登录 Cloudflare Dashboard
   - 进入 "My Profile" > "API Tokens"
   - 点击 "Create Token"
   - 使用 "Edit Cloudflare Workers" 模板，或自定义权限：
     - Account: Cloudflare Workers:Edit
     - Zone: 如果需要自定义域名，添加 Zone:Read
   - 复制生成的 Token

2. **获取 Account ID**
   - 在 Cloudflare Dashboard 右侧边栏可以看到 Account ID

3. **配置 GitHub Secrets**
   - 进入 GitHub 仓库
   - Settings > Secrets and variables > Actions
   - 添加以下 Secrets：
     - `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
     - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID
     - `NEXT_PUBLIC_JWT_TOKEN`: JWT Token（用于生产环境 API 认证）

4. **推送代码**
   - 推送到 `main` 或 `master` 分支
   - GitHub Actions 会自动运行部署工作流
   - 工作流会执行 `pnpm run deploy`，自动构建并部署到 Cloudflare Workers

### 方式 2: 使用命令行手动部署

1. **安装依赖**
   ```bash
   pnpm install
   ```

2. **配置 Cloudflare 认证**
   - 设置环境变量：
     ```bash
     export CLOUDFLARE_API_TOKEN="your-api-token"
     export CLOUDFLARE_ACCOUNT_ID="your-account-id"
     ```
   - 或者运行 `wrangler login` 进行交互式登录

3. **配置环境变量**
   在部署前设置必要的环境变量：
   ```bash
   export NEXT_PUBLIC_API_URL_PROD="https://capy-book-fetch.vercel.app/api/extract"
   export NEXT_PUBLIC_JWT_TOKEN="your-jwt-token"
   export INITIAL_JWT_TOKEN="your-jwt-token"
   ```

4. **部署**
   ```bash
   pnpm run deploy
   ```
   这个命令会：
   - 构建 Next.js 应用（`opennextjs-cloudflare build`）
   - 部署到 Cloudflare Workers（`opennextjs-cloudflare deploy`）

### 方式 3: 本地预览

在部署前，可以在本地预览应用：

```bash
pnpm run preview
```

这会构建应用并在本地启动 Wrangler 开发服务器。

## 环境变量配置

### 部署时需要的环境变量

#### GitHub Actions 部署
以下环境变量需要在 GitHub Secrets 中配置：
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token（必需）
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID（必需）
- `NEXT_PUBLIC_JWT_TOKEN`: JWT Token（用于生产环境 API 认证）

#### 应用运行时环境变量
以下环境变量可以在 `wrangler.toml` 中配置，或通过 Cloudflare Dashboard 设置：
- `NEXT_PUBLIC_API_URL_PROD`: 生产环境 API URL
- `NEXT_PUBLIC_JWT_TOKEN`: JWT Token（生产环境 API 认证）
- `INITIAL_JWT_TOKEN`: API 路由使用的 JWT Token（与 NEXT_PUBLIC_JWT_TOKEN 相同）
- `NEXT_PUBLIC_API_URL_DEV`: 开发环境 API URL（通常不需要在生产环境设置）

### 在 Cloudflare Dashboard 中配置环境变量

1. 登录 Cloudflare Dashboard
2. 进入 "Workers & Pages" > 选择您的 Worker
3. 进入 "Settings" > "Variables and Secrets"
4. 添加环境变量（生产环境使用 `vars`，预览环境使用 `env.preview.vars`）

## 自定义域名

1. 在 Cloudflare Dashboard 中
2. 进入 "Workers & Pages" > 选择您的 Worker
3. 进入 "Triggers" > "Custom Domains"
4. 添加您的域名
5. Cloudflare 会自动配置 DNS 记录

## 部署流程

1. **CI 检查**（`.github/workflows/ci.yml`）
   - 运行 linter
   - 运行测试
   - 构建应用

2. **CD 部署**（`.github/workflows/deploy.yml`）
   - 仅在 CI 通过后运行
   - 执行 `pnpm run deploy` 命令
   - 自动构建并部署到 Cloudflare Workers

## 故障排查

### 构建失败

1. 检查环境变量是否正确配置
2. 检查 `pnpm-lock.yaml` 是否已提交
3. 检查 `wrangler.toml` 配置是否正确
4. 查看 GitHub Actions 构建日志

### 部署失败

1. 检查 `CLOUDFLARE_API_TOKEN` 和 `CLOUDFLARE_ACCOUNT_ID` 是否正确配置
2. 检查 API Token 是否有足够的权限（需要 Workers:Edit）
3. 查看 GitHub Actions 部署日志或 Wrangler 错误信息

### 部署后应用无法访问

1. 检查环境变量是否在 Cloudflare Dashboard 中正确设置
2. 检查 API URL 是否正确
3. 检查 JWT Token 是否有效
4. 查看 Cloudflare Workers 的日志和错误信息

### API 请求失败

1. 确认 API 服务器支持 CORS
2. 检查 JWT Token 是否正确配置
3. 查看浏览器控制台错误信息

## 配置文件说明

### wrangler.toml

项目根目录的 `wrangler.toml` 文件包含 Cloudflare Workers 的配置：
- `name`: Worker 名称
- `main`: Worker 入口点（由 @opennextjs/cloudflare 生成）
- `compatibility_date`: 兼容性日期
- `compatibility_flags`: 兼容性标志（包含 `nodejs_compat`）
- `[assets]`: 静态资源配置
- `[vars]`: 环境变量配置

### open-next.config.ts

OpenNext Cloudflare 的配置文件，用于自定义构建行为。

## 相关链接

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [@opennextjs/cloudflare 文档](https://opennext.js.org/cloudflare)
- [Wrangler 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Next.js on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

