'use client';

import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage/localStorage';
import { parseBookUrl } from './urlParser';
import type { Book, BookList } from '@/types/book';

/**
 * 获取所有书籍列表
 * 
 * @returns 书籍列表
 */
export function getAllBooks(): BookList {
  const books = getItem<BookList>(STORAGE_KEYS.BOOKS);
  return books ?? [];
}

/**
 * 根据 bookId 获取书籍
 * 
 * @param bookId - 书籍 ID
 * @returns 书籍对象，如果不存在返回 undefined
 */
export function getBookById(bookId: string): Book | undefined {
  const books = getAllBooks();
  return books.find((book) => book.bookId === bookId);
}

/**
 * 添加书籍
 * 
 * @param url - 书籍 URL
 * @param bookName - 书籍名称（可选，如果提供则使用，否则从 URL 解析）
 * @returns 添加的书籍对象，如果 URL 格式错误或已存在返回 null
 */
export function addBook(url: string, bookName?: string): Book | null {
  // 解析 URL
  const parsed = parseBookUrl(url);
  if (!parsed) {
    return null;
  }

  const books = getAllBooks();

  // 检查是否已存在（根据 bookId）
  const existingBook = books.find((book) => book.bookId === parsed.bookId);
  if (existingBook) {
    // 如果已存在，更新最后阅读 URL（如果新 URL 的章节号更大）
    if (parsed.chapterNumber > existingBook.currentChapter) {
      existingBook.currentChapter = parsed.chapterNumber;
      existingBook.lastReadUrl = parsed.fullUrl;
      saveBooks(books);
    }
    return existingBook;
  }

  // 创建新书籍
  const newBook: Book = {
    bookId: parsed.bookId,
    bookName: bookName || parsed.bookId, // 如果没有提供名称，使用 bookId
    currentChapter: parsed.chapterNumber,
    lastReadUrl: parsed.fullUrl,
    addedAt: Date.now(),
  };

  // 添加到列表
  books.push(newBook);
  saveBooks(books);

  return newBook;
}

/**
 * 删除书籍
 * 
 * @param bookId - 书籍 ID
 * @returns 是否删除成功
 */
export function removeBook(bookId: string): boolean {
  const books = getAllBooks();
  const filteredBooks = books.filter((book) => book.bookId !== bookId);

  if (filteredBooks.length === books.length) {
    // 没有找到要删除的书籍
    return false;
  }

  saveBooks(filteredBooks);
  return true;
}

/**
 * 更新书籍信息
 * 
 * @param bookId - 书籍 ID
 * @param updates - 要更新的字段
 * @returns 是否更新成功
 */
export function updateBook(
  bookId: string,
  updates: Partial<Pick<Book, 'bookName' | 'currentChapter' | 'lastReadUrl'>>
): boolean {
  const books = getAllBooks();
  const bookIndex = books.findIndex((book) => book.bookId === bookId);

  if (bookIndex === -1) {
    console.warn('[manager.ts] updateBook: 书籍不存在', bookId);
    return false;
  }

  // 更新书籍信息
  const oldBook = books[bookIndex];
  books[bookIndex] = {
    ...books[bookIndex],
    ...updates,
  };

  const success = saveBooks(books);
  console.log('[manager.ts] updateBook:', {
    bookId,
    updates,
    oldBook: { currentChapter: oldBook.currentChapter, lastReadUrl: oldBook.lastReadUrl },
    newBook: { currentChapter: books[bookIndex].currentChapter, lastReadUrl: books[bookIndex].lastReadUrl },
    success,
  });
  return success;
}

/**
 * 保存书籍列表到 localStorage
 * 
 * @param books - 书籍列表
 */
function saveBooks(books: BookList): void {
  setItem(STORAGE_KEYS.BOOKS, books);
}

/**
 * 清空所有书籍
 * 
 * @returns 是否清空成功
 */
export function clearAllBooks(): boolean {
  return setItem(STORAGE_KEYS.BOOKS, []);
}

