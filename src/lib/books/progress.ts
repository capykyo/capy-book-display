'use client';

import { getItem, setItem, STORAGE_KEYS } from '@/lib/storage/localStorage';
import type { ReadingProgress } from '@/types/book';

/**
 * 获取所有阅读进度
 * 
 * @returns 阅读进度映射表（bookId -> ReadingProgress）
 */
export function getAllProgress(): Record<string, ReadingProgress> {
  const progress = getItem<Record<string, ReadingProgress>>(STORAGE_KEYS.READING_PROGRESS);
  return progress ?? {};
}

/**
 * 获取指定书籍的阅读进度
 * 
 * @param bookId - 书籍 ID
 * @returns 阅读进度，如果不存在返回 undefined
 */
export function getProgress(bookId: string): ReadingProgress | undefined {
  const allProgress = getAllProgress();
  return allProgress[bookId];
}

/**
 * 保存阅读进度
 * 
 * @param bookId - 书籍 ID
 * @param chapterNumber - 章节号
 * @param lastReadUrl - 最后阅读的 URL
 * @returns 是否保存成功
 */
export function saveProgress(
  bookId: string,
  chapterNumber: number,
  lastReadUrl: string
): boolean {
  const allProgress = getAllProgress();

  const progress: ReadingProgress = {
    bookId,
    currentChapter: chapterNumber,
    lastReadUrl,
    updatedAt: Date.now(),
  };

  allProgress[bookId] = progress;
  const success = setItem(STORAGE_KEYS.READING_PROGRESS, allProgress);
  console.log('[progress.ts] saveProgress:', {
    bookId,
    chapterNumber,
    lastReadUrl,
    success,
    savedData: allProgress[bookId],
  });
  return success;
}

/**
 * 更新阅读进度
 * 
 * @param bookId - 书籍 ID
 * @param updates - 要更新的字段
 * @returns 是否更新成功
 */
export function updateProgress(
  bookId: string,
  updates: Partial<Pick<ReadingProgress, 'currentChapter' | 'lastReadUrl'>>
): boolean {
  const allProgress = getAllProgress();
  const existingProgress = allProgress[bookId];

  if (!existingProgress) {
    // 如果不存在，创建新的进度记录
    if (!updates.currentChapter || !updates.lastReadUrl) {
      return false; // 缺少必要字段
    }
    return saveProgress(bookId, updates.currentChapter, updates.lastReadUrl);
  }

  // 更新现有进度
  const updatedProgress: ReadingProgress = {
    ...existingProgress,
    ...updates,
    updatedAt: Date.now(),
  };

  allProgress[bookId] = updatedProgress;
  return setItem(STORAGE_KEYS.READING_PROGRESS, allProgress);
}

/**
 * 删除指定书籍的阅读进度
 * 
 * @param bookId - 书籍 ID
 * @returns 是否删除成功
 */
export function removeProgress(bookId: string): boolean {
  const allProgress = getAllProgress();

  if (!allProgress[bookId]) {
    return false;
  }

  delete allProgress[bookId];
  return setItem(STORAGE_KEYS.READING_PROGRESS, allProgress);
}

/**
 * 清空所有阅读进度
 * 
 * @returns 是否清空成功
 */
export function clearAllProgress(): boolean {
  return setItem(STORAGE_KEYS.READING_PROGRESS, {});
}

