'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  getAllProgress,
  getProgress,
  saveProgress as saveProgressToStorage,
  updateProgress as updateProgressInStorage,
  removeProgress as removeProgressFromStorage,
} from '@/lib/books/progress';
import type { ReadingProgress } from '@/types/book';

/**
 * 阅读进度管理 Context 的值类型
 */
interface ReadingProgressContextValue {
  /** 所有阅读进度 */
  allProgress: Record<string, ReadingProgress>;
  /** 加载状态 */
  isLoading: boolean;
  /** 获取指定书籍的阅读进度 */
  getBookProgress: (bookId: string) => ReadingProgress | undefined;
  /** 保存阅读进度 */
  saveProgress: (bookId: string, chapterNumber: number, lastReadUrl: string) => Promise<boolean>;
  /** 更新阅读进度 */
  updateProgress: (
    bookId: string,
    updates: Partial<Pick<ReadingProgress, 'currentChapter' | 'lastReadUrl'>>
  ) => Promise<boolean>;
  /** 删除阅读进度 */
  removeProgress: (bookId: string) => Promise<boolean>;
  /** 刷新进度列表 */
  refreshProgress: () => void;
}

/**
 * 阅读进度管理 Context
 */
const ReadingProgressContext = createContext<ReadingProgressContextValue | undefined>(undefined);

/**
 * 阅读进度管理 Provider Props
 */
interface ReadingProgressProviderProps {
  children: ReactNode;
}

/**
 * 阅读进度管理 Provider 组件
 * 提供全局的阅读进度状态管理
 */
export function ReadingProgressProvider({ children }: ReadingProgressProviderProps) {
  const [allProgress, setAllProgress] = useState<Record<string, ReadingProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载阅读进度
  const loadProgress = useCallback(() => {
    try {
      const progress = getAllProgress();
      setAllProgress(progress);
    } catch (error) {
      console.error('Failed to load reading progress:', error);
      setAllProgress({});
    }
  }, []);

  // 初始化时加载阅读进度
  useEffect(() => {
    setIsLoading(true);
    try {
      const progress = getAllProgress();
      setAllProgress(progress);
    } catch (error) {
      console.error('Failed to load reading progress:', error);
      setAllProgress({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 获取指定书籍的阅读进度（从状态中读取，确保响应式）
  const getBookProgress = useCallback(
    (bookId: string): ReadingProgress | undefined => {
      return allProgress[bookId];
    },
    [allProgress]
  );

  // 保存阅读进度
  const saveProgress = useCallback(
    async (
      bookId: string,
      chapterNumber: number,
      lastReadUrl: string
    ): Promise<boolean> => {
      try {
        const success = saveProgressToStorage(bookId, chapterNumber, lastReadUrl);
        if (success) {
          // 立即刷新进度列表，确保状态同步
          const updatedProgress = getAllProgress();
          setAllProgress(updatedProgress);
        }
        return success;
      } catch (error) {
        console.error('Failed to save reading progress:', error);
        return false;
      }
    },
    []
  );

  // 更新阅读进度
  const updateProgress = useCallback(
    async (
      bookId: string,
      updates: Partial<Pick<ReadingProgress, 'currentChapter' | 'lastReadUrl'>>
    ): Promise<boolean> => {
      try {
        const success = updateProgressInStorage(bookId, updates);
        if (success) {
          // 立即刷新进度列表，确保状态同步
          const updatedProgress = getAllProgress();
          setAllProgress(updatedProgress);
        }
        return success;
      } catch (error) {
        console.error('Failed to update reading progress:', error);
        return false;
      }
    },
    []
  );

  // 删除阅读进度
  const removeProgress = useCallback(
    async (bookId: string): Promise<boolean> => {
      try {
        const success = removeProgressFromStorage(bookId);
        if (success) {
          // 立即刷新进度列表，确保状态同步
          const updatedProgress = getAllProgress();
          setAllProgress(updatedProgress);
        }
        return success;
      } catch (error) {
        console.error('Failed to remove reading progress:', error);
        return false;
      }
    },
    []
  );

  const value: ReadingProgressContextValue = {
    allProgress,
    isLoading,
    getBookProgress,
    saveProgress,
    updateProgress,
    removeProgress,
    refreshProgress: loadProgress,
  };

  return (
    <ReadingProgressContext.Provider value={value}>
      {children}
    </ReadingProgressContext.Provider>
  );
}

/**
 * 使用阅读进度管理 Context 的 Hook
 * 
 * @returns 阅读进度管理 Context 的值
 * @throws 如果不在 ReadingProgressProvider 内使用会抛出错误
 * 
 * @example
 * const { getBookProgress, saveProgress } = useReadingProgressContext()
 */
export function useReadingProgressContext(): ReadingProgressContextValue {
  const context = useContext(ReadingProgressContext);
  if (context === undefined) {
    throw new Error('useReadingProgressContext must be used within a ReadingProgressProvider');
  }
  return context;
}

