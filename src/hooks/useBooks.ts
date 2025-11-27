'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAllBooks,
  addBook as addBookToStorage,
  removeBook as removeBookFromStorage,
  updateBook,
  type Book,
} from '@/lib/books/manager';
import { parseBookUrl } from '@/lib/books/urlParser';
import type { BookList } from '@/types/book';

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
  const [books, setBooks] = useState<BookList>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载书籍列表
  const loadBooks = useCallback(() => {
    setIsLoading(true);
    try {
      const allBooks = getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Failed to load books:', error);
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 初始化时加载书籍列表
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // 添加书籍
  const addBook = useCallback(
    async (url: string, bookName?: string): Promise<Book | null> => {
      // 验证 URL 格式
      if (!parseBookUrl(url)) {
        return null;
      }

      try {
        const newBook = addBookToStorage(url, bookName);
        if (newBook) {
          // 刷新列表
          loadBooks();
        }
        return newBook;
      } catch (error) {
        console.error('Failed to add book:', error);
        return null;
      }
    },
    [loadBooks]
  );

  // 删除书籍
  const removeBook = useCallback(
    async (bookId: string): Promise<boolean> => {
      try {
        const success = removeBookFromStorage(bookId);
        if (success) {
          // 刷新列表
          loadBooks();
        }
        return success;
      } catch (error) {
        console.error('Failed to remove book:', error);
        return false;
      }
    },
    [loadBooks]
  );

  // 更新书籍信息
  const updateBookInfo = useCallback(
    async (
      bookId: string,
      updates: Partial<Pick<Book, 'bookName' | 'currentChapter' | 'lastReadUrl'>>
    ): Promise<boolean> => {
      try {
        const success = updateBook(bookId, updates);
        if (success) {
          // 刷新列表
          loadBooks();
        }
        return success;
      } catch (error) {
        console.error('Failed to update book:', error);
        return false;
      }
    },
    [loadBooks]
  );

  return {
    books,
    isLoading,
    addBook,
    removeBook,
    updateBookInfo,
    refreshBooks: loadBooks,
  };
}

