import type { ParsedBookUrl } from '@/types/book';

/**
 * 书籍 URL 格式的正则表达式
 * 格式：https://quanben.io/n/{book-id}/{chapter-number}.html
 */
const BOOK_URL_PATTERN = /^https:\/\/quanben\.io\/n\/([^/]+)\/(\d+)\.html$/;

/**
 * 解析书籍 URL
 * 
 * @param url - 书籍 URL 字符串
 * @returns 解析后的 URL 信息，如果格式不正确返回 null
 * 
 * @example
 * const parsed = parseBookUrl('https://quanben.io/n/xuanjiezhimen/1.html')
 * if (parsed) {
 *   console.log(parsed.bookId) // 'xuanjiezhimen'
 *   console.log(parsed.chapterNumber) // 1
 * }
 */
export function parseBookUrl(url: string): ParsedBookUrl | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const match = url.trim().match(BOOK_URL_PATTERN);
  if (!match) {
    return null;
  }

  const bookId = match[1];
  const chapterNumber = parseInt(match[2], 10);

  // 验证章节号是否有效
  if (isNaN(chapterNumber) || chapterNumber < 1) {
    return null;
  }

  return {
    bookId,
    chapterNumber,
    fullUrl: url.trim(),
  };
}

/**
 * 验证书籍 URL 格式
 * 
 * @param url - 书籍 URL 字符串
 * @returns 如果格式正确返回 true，否则返回 false
 * 
 * @example
 * if (isValidBookUrl(url)) {
 *   // URL 格式正确
 * }
 */
export function isValidBookUrl(url: string): boolean {
  return parseBookUrl(url) !== null;
}

/**
 * 从 URL 提取书籍 ID
 * 
 * @param url - 书籍 URL 字符串
 * @returns 书籍 ID，如果无法提取返回 null
 * 
 * @example
 * const bookId = extractBookId('https://quanben.io/n/xuanjiezhimen/1.html')
 * // 'xuanjiezhimen'
 */
export function extractBookId(url: string): string | null {
  const parsed = parseBookUrl(url);
  return parsed?.bookId ?? null;
}

/**
 * 从 URL 提取章节号
 * 
 * @param url - 书籍 URL 字符串
 * @returns 章节号，如果无法提取返回 null
 * 
 * @example
 * const chapter = extractChapterNumber('https://quanben.io/n/xuanjiezhimen/1.html')
 * // 1
 */
export function extractChapterNumber(url: string): number | null {
  const parsed = parseBookUrl(url);
  return parsed?.chapterNumber ?? null;
}

