/**
 * 类型统一导出
 * 方便其他模块导入类型
 */

// API 相关类型
export type {
  ExtractArticleRequest,
  ArticleData as ApiArticleData,
  ExtractArticleResponse,
  ExtractArticleErrorResponse,
  ExtractArticleResponseType,
} from './api';

// 文章相关类型
export type { ArticleData } from './article';

// 书籍相关类型
export type {
  Book,
  ReadingProgress,
  BookList,
  ParsedBookUrl,
} from './book';

