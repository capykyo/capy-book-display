/**
 * 书籍相关类型定义
 */

/**
 * 书籍接口
 */
export interface Book {
  /** 书籍唯一标识（从 URL 中解析的 book-id） */
  bookId: string;
  /** 书籍名称 */
  bookName: string;
  /** 当前阅读章节 */
  currentChapter: number;
  /** 最后阅读的 URL */
  lastReadUrl: string;
  /** 添加时间戳（毫秒） */
  addedAt: number;
}

/**
 * 阅读进度接口
 */
export interface ReadingProgress {
  /** 书籍唯一标识 */
  bookId: string;
  /** 当前阅读章节 */
  currentChapter: number;
  /** 最后阅读的 URL */
  lastReadUrl: string;
  /** 更新时间戳（毫秒） */
  updatedAt: number;
}

/**
 * 书籍列表类型
 */
export type BookList = Book[];

/**
 * 解析后的 URL 信息
 */
export interface ParsedBookUrl {
  /** 书籍唯一标识 */
  bookId: string;
  /** 章节编号 */
  chapterNumber: number;
  /** 完整 URL */
  fullUrl: string;
}

