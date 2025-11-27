/**
 * API 请求/响应类型定义
 */

/**
 * API 请求体类型
 */
export interface ExtractArticleRequest {
  url: string;
}

/**
 * API 响应数据中的文章数据
 */
export interface ArticleData {
  title: string;
  content: string;
  author: string;
  prevLink: string | null;
  nextLink: string | null;
  bookName: string;
  description: string;
}

/**
 * API 成功响应类型
 */
export interface ExtractArticleResponse {
  success: true;
  data: ArticleData;
}

/**
 * API 错误响应类型
 */
export interface ExtractArticleErrorResponse {
  success: false;
  error: string;
  message?: string;
}

/**
 * API 响应类型（成功或失败）
 */
export type ExtractArticleResponseType =
  | ExtractArticleResponse
  | ExtractArticleErrorResponse;

