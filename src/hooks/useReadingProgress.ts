'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAllProgress,
  getProgress,
  saveProgress as saveProgressToStorage,
  updateProgress as updateProgressInStorage,
  removeProgress as removeProgressFromStorage,
} from '@/lib/books/progress';
import type { ReadingProgress } from '@/types/book';

/**
 * 阅读进度 Hook 的返回类型
 */
export interface UseReadingProgressReturn {
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
 * 阅读进度管理 Hook
 * 
 * @returns 阅读进度状态和管理方法
 * 
 * @example
 * const { getBookProgress, saveProgress } = useReadingProgress()
 * 
 * const progress = getBookProgress('xuanjiezhimen')
 * if (progress) {
 *   console.log('Current chapter:', progress.currentChapter)
 * }
 * 
 * await saveProgress('xuanjiezhimen', 5, 'https://quanben.io/n/xuanjiezhimen/5.html')
 */
export function useReadingProgress(): UseReadingProgressReturn {
  const [allProgress, setAllProgress] = useState<Record<string, ReadingProgress>>({});
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 加载阅读进度
  const loadProgress = useCallback(() => {
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

  // 初始化时加载阅读进度
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // 获取指定书籍的阅读进度
  const getBookProgress = useCallback(
    (bookId: string): ReadingProgress | undefined => {
      return getProgress(bookId);
    },
    []
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
          // 刷新进度列表
          loadProgress();
        }
        return success;
      } catch (error) {
        console.error('Failed to save reading progress:', error);
        return false;
      }
    },
    [loadProgress]
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
          // 刷新进度列表
          loadProgress();
        }
        return success;
      } catch (error) {
        console.error('Failed to update reading progress:', error);
        return false;
      }
    },
    [loadProgress]
  );

  // 删除阅读进度
  const removeProgress = useCallback(
    async (bookId: string): Promise<boolean> => {
      try {
        const success = removeProgressFromStorage(bookId);
        if (success) {
          // 刷新进度列表
          loadProgress();
        }
        return success;
      } catch (error) {
        console.error('Failed to remove reading progress:', error);
        return false;
      }
    },
    [loadProgress]
  );

  return {
    allProgress,
    isLoading,
    getBookProgress,
    saveProgress,
    updateProgress,
    removeProgress,
    refreshProgress: loadProgress,
  };
}

