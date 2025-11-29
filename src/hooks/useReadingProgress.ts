'use client';

import { useReadingProgressContext } from '@/contexts/ReadingProgressContext';
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
 * 这是一个便捷的 Hook，内部使用 ReadingProgressContext 来管理状态。
 * 确保在 ReadingProgressProvider 内使用此 Hook。
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
  return useReadingProgressContext();
}

