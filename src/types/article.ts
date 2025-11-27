/**
 * 文章相关类型定义
 */

/**
 * 文章数据接口
 * 与 API 返回的 ArticleData 保持一致
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

