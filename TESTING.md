# 测试文档

本项目使用 Jest 和 React Testing Library 进行测试。

## 安装依赖

```bash
pnpm install
```

## 运行测试

### 运行所有测试

```bash
pnpm test
```

### 监听模式（开发时使用）

```bash
pnpm test:watch
```

### 生成覆盖率报告

```bash
pnpm test:coverage
```

## 测试文件结构

测试文件应该放在与被测试文件相同的目录下，使用 `__tests__` 文件夹：

```
src/
  lib/
    books/
      __tests__/
        urlParser.test.ts
      urlParser.ts
```

或者使用 `.test.ts` 或 `.spec.ts` 后缀：

```
src/
  lib/
    books/
      urlParser.ts
      urlParser.test.ts
```

## 编写测试

### 工具函数测试示例

```typescript
import { parseBookUrl } from '../urlParser'

describe('parseBookUrl', () => {
  it('should parse valid book URL correctly', () => {
    const url = 'https://quanben.io/n/xuanjiezhimen/1.html'
    const result = parseBookUrl(url)

    expect(result).not.toBeNull()
    expect(result?.bookId).toBe('xuanjiezhimen')
    expect(result?.chapterNumber).toBe(1)
  })
})
```

### React 组件测试示例

```typescript
import { render, screen } from '@testing-library/react'
import { BookCard } from '../BookCard'

describe('BookCard', () => {
  it('should render book information', () => {
    const book = {
      bookId: 'test',
      bookName: 'Test Book',
      currentChapter: 1,
      lastReadUrl: 'https://quanben.io/n/test/1.html',
      addedAt: Date.now(),
    }

    render(<BookCard book={book} />)
    expect(screen.getByText('Test Book')).toBeInTheDocument()
  })
})
```

## CI/CD

GitHub Actions 会在以下情况自动运行测试：

- 推送到 `main`、`master` 或 `develop` 分支
- 创建 Pull Request

CI 流程包括：

1. 运行 linter
2. 运行所有测试
3. 生成覆盖率报告
4. 构建应用（如果测试通过）

## 覆盖率目标

- 工具函数：> 80%
- 组件：> 60%
- 整体：> 70%

