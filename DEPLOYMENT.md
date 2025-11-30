# 部署文档

本文档说明如何将应用部署到 Cloudflare Pages。

## 前置要求

1. Cloudflare 账户
2. GitHub 仓库
3. Cloudflare API Token

## 部署方式

### 方式 1: 使用 GitHub Actions（推荐）

项目已配置 GitHub Actions 自动部署工作流。当代码推送到 `main` 或 `master` 分支时，会自动部署到 Cloudflare Pages。

#### 配置步骤

1. **获取 Cloudflare API Token**
   - 登录 Cloudflare Dashboard
   - 进入 "My Profile" > "API Tokens"
   - 点击 "Create Token"
   - 使用 "Edit Cloudflare Workers" 模板，或自定义权限：
     - Account: Cloudflare Pages:Edit
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

### 方式 2: 使用 Cloudflare Dashboard（手动部署）

1. **登录 Cloudflare Dashboard**
   - 进入 "Workers & Pages"
   - 点击 "Create application" > "Pages" > "Connect to Git"

2. **连接 Git 仓库**
   - 选择 GitHub
   - 授权并选择仓库
   - 选择分支（通常是 `main` 或 `master`）

3. **配置构建设置**
   - **Framework preset**: Next.js
   - **Build command**: `pnpm build`
   - **Build output directory**: `out`（Next.js 静态导出输出目录）
   - **Root directory**: `/`（项目根目录）
   - **Node.js version**: 20（推荐）
   
   **注意**：项目已配置为静态导出（`output: 'export'`），输出目录为 `out`，而不是 `.next`

4. **配置环境变量**
   在 "Environment variables" 中添加：
   ```
   NEXT_PUBLIC_API_URL_DEV=http://localhost:3000/api/extract
   NEXT_PUBLIC_API_URL_PROD=https://capy-book-fetch.vercel.app/api/extract
   NEXT_PUBLIC_JWT_TOKEN=your-jwt-token-here
   ```

5. **保存并部署**
   - 点击 "Save and Deploy"
   - Cloudflare 会自动构建并部署应用

## 环境变量配置

### 必需的环境变量

- `NEXT_PUBLIC_API_URL_PROD`: 生产环境 API URL
- `NEXT_PUBLIC_JWT_TOKEN`: JWT Token（生产环境 API 认证）

### 可选的环境变量

- `NEXT_PUBLIC_API_URL_DEV`: 开发环境 API URL（通常不需要在生产环境设置）

## 自定义域名

1. 在 Cloudflare Pages 项目设置中
2. 进入 "Custom domains"
3. 添加您的域名
4. Cloudflare 会自动配置 DNS 记录

## 部署流程

1. **CI 检查**（`.github/workflows/ci.yml`）
   - 运行 linter
   - 运行测试
   - 构建应用

2. **CD 部署**（`.github/workflows/deploy.yml`）
   - 仅在 CI 通过后运行
   - 构建生产版本
   - 部署到 Cloudflare Pages

## 故障排查

### 构建失败

1. 检查环境变量是否正确配置
2. 检查 `pnpm-lock.yaml` 是否已提交
3. 查看 Cloudflare Pages 构建日志

### 部署后应用无法访问

1. 检查环境变量是否在 Cloudflare Dashboard 中正确设置
2. 检查 API URL 是否正确
3. 检查 JWT Token 是否有效

### API 请求失败

1. 确认 API 服务器支持 CORS
2. 检查 JWT Token 是否正确配置
3. 查看浏览器控制台错误信息

## 相关链接

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Next.js on Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [GitHub Actions 文档](https://docs.github.com/en/actions)

