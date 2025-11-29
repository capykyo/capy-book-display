'use client';

import { useBooksContext } from '@/contexts/BooksContext';
import type { Book, BookList } from '@/types/book';

/**
 * 书籍管理 Hook 的返回类型
 */
export interface UseBooksReturn {
  /** 书籍列表 */
  books: BookList;
  /** 加载状态 */
  isLoading: boolean;
  /** 添加书籍的方法 */
  addBook: (url: string, bookName?: string) => Promise<Book | null>;
  /** 删除书籍的方法 */
  removeBook: (bookId: string) => Promise<boolean>;
  /** 更新书籍的方法 */
  updateBookInfo: (
    bookId: string,
    updates: Partial<Pick<Book, 'bookName' | 'currentChapter' | 'lastReadUrl'>>
  ) => Promise<boolean>;
  /** 刷新书籍列表 */
  refreshBooks: () => void;
}

/**
 * 书籍管理 Hook
 * 
 * 这是一个便捷的 Hook，内部使用 BooksContext 来管理状态。
 * 确保在 BooksProvider 内使用此 Hook。
 * 
 * @returns 书籍列表和管理方法
 * 
 * @example
 * const { books, addBook, removeBook } = useBooks()
 * 
 * const handleAdd = async () => {
 *   const book = await addBook('https://quanben.io/n/xuanjiezhimen/1.html')
 *   if (book) {
 *     console.log('Book added:', book.bookName)
 *   }
 * }
 */
export function useBooks(): UseBooksReturn {
  return useBooksContext();
}

