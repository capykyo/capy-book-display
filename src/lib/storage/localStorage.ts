'use client';

/**
 * localStorage 存储键名常量
 */
export const STORAGE_KEYS = {
  BOOKS: 'book-dis:books',
  READING_PROGRESS: 'book-dis:reading-progress',
} as const;

/**
 * 获取 localStorage 中的值
 * 
 * @param key - 存储键名
 * @returns 解析后的值，如果不存在或解析失败返回 null
 * 
 * @example
 * const books = getItem<Book[]>(STORAGE_KEYS.BOOKS)
 */
export function getItem<T>(key: string): T | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to get item from localStorage (key: ${key}):`, error);
    return null;
  }
}

/**
 * 设置 localStorage 中的值
 * 
 * @param key - 存储键名
 * @param value - 要存储的值（会被 JSON.stringify）
 * @returns 是否设置成功
 * 
 * @example
 * setItem(STORAGE_KEYS.BOOKS, books)
 */
export function setItem<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error(`Failed to set item to localStorage (key: ${key}):`, error);
    // 可能是存储空间不足或隐私模式
    return false;
  }
}

/**
 * 删除 localStorage 中的值
 * 
 * @param key - 存储键名
 * @returns 是否删除成功
 * 
 * @example
 * removeItem(STORAGE_KEYS.BOOKS)
 */
export function removeItem(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove item from localStorage (key: ${key}):`, error);
    return false;
  }
}

/**
 * 清空所有 localStorage（仅清空项目相关的键）
 * 
 * @returns 是否清空成功
 * 
 * @example
 * clear() // 清空所有 book-dis: 开头的键
 */
export function clear(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // 只清空项目相关的键
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * 检查 localStorage 是否可用
 * 
 * @returns 如果可用返回 true，否则返回 false
 * 
 * @example
 * if (isAvailable()) {
 *   // localStorage 可用
 * }
 */
export function isAvailable(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    const testKey = '__localStorage_test__';
    window.localStorage.setItem(testKey, 'test');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    // 可能是隐私模式或存储空间不足
    return false;
  }
}

