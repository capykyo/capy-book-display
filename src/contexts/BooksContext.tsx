'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  getAllBooks,
  addBook as addBookToStorage,
  removeBook as removeBookFromStorage,
  updateBook,
} from '@/lib/books/manager';
import { parseBookUrl } from '@/lib/books/urlParser';
import type { Book, BookList } from '@/types/book';

/**
 * 书籍管理 Context 的值类型
 */
interface BooksContextValue {
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
 * 书籍管理 Context
 */
const BooksContext = createContext<BooksContextValue | undefined>(undefined);

/**
 * 书籍管理 Provider Props
 */
interface BooksProviderProps {
  children: ReactNode;
}

/**
 * 书籍管理 Provider 组件
 * 提供全局的书籍状态管理
 */
export function BooksProvider({ children }: BooksProviderProps) {
  const [books, setBooks] = useState<BookList>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载书籍列表
  const loadBooks = useCallback(() => {
    try {
      const allBooks = getAllBooks();
      setBooks(allBooks);
    } catch (error) {
      console.error('Failed to load books:', error);
      setBooks([]);
    }
  }, []);

  // 初始化时加载书籍列表
  useEffect(() => {
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
          // 立即刷新列表，确保状态同步
          const updatedBooks = getAllBooks();
          setBooks(updatedBooks);
        }
        return newBook;
      } catch (error) {
        console.error('Failed to add book:', error);
        return null;
      }
    },
    []
  );

  // 删除书籍
  const removeBook = useCallback(
    async (bookId: string): Promise<boolean> => {
      try {
        const success = removeBookFromStorage(bookId);
        if (success) {
          // 立即刷新列表，确保状态同步
          const updatedBooks = getAllBooks();
          setBooks(updatedBooks);
        }
        return success;
      } catch (error) {
        console.error('Failed to remove book:', error);
        return false;
      }
    },
    []
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
          // 立即刷新列表，确保状态同步
          const updatedBooks = getAllBooks();
          setBooks(updatedBooks);
        }
        return success;
      } catch (error) {
        console.error('Failed to update book:', error);
        return false;
      }
    },
    []
  );

  const value: BooksContextValue = {
    books,
    isLoading,
    addBook,
    removeBook,
    updateBookInfo,
    refreshBooks: loadBooks,
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

/**
 * 使用书籍管理 Context 的 Hook
 * 
 * @returns 书籍管理 Context 的值
 * @throws 如果不在 BooksProvider 内使用会抛出错误
 * 
 * @example
 * const { books, addBook, removeBook } = useBooksContext()
 */
export function useBooksContext(): BooksContextValue {
  const context = useContext(BooksContext);
  if (context === undefined) {
    throw new Error('useBooksContext must be used within a BooksProvider');
  }
  return context;
}

