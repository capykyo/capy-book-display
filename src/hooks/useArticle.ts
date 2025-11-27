'use client';

import { useState, useCallback } from 'react';
import { extractArticle } from '@/lib/api/client';
import type { ArticleData, ExtractArticleErrorResponse } from '@/types/api';

/**
 * 文章数据获取 Hook 的返回类型
 */
export interface UseArticleReturn {
  /** 文章数据 */
  article: ArticleData | null;
  /** 加载状态 */
  isLoading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 获取文章的方法 */
  fetchArticle: (url: string) => Promise<void>;
  /** 重置状态 */
  reset: () => void;
}

/**
 * 文章数据获取 Hook
 * 
 * @returns 文章数据、加载状态、错误信息和获取方法
 * 
 * @example
 * const { article, isLoading, error, fetchArticle } = useArticle()
 * 
 * useEffect(() => {
 *   fetchArticle('https://quanben.io/n/xuanjiezhimen/1.html')
 * }, [])
 */
export function useArticle(): UseArticleReturn {
  const [article, setArticle] = useState<ArticleData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchArticle = useCallback(async (url: string) => {
    setIsLoading(true);
    setError(null);
    setArticle(null);

    try {
      const result = await extractArticle(url);

      if (result.success) {
        setArticle(result.data);
        setError(null);
      } else {
        const errorResponse = result as ExtractArticleErrorResponse;
        setError(errorResponse.error || errorResponse.message || 'Failed to fetch article');
        setArticle(null);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setArticle(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setArticle(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    article,
    isLoading,
    error,
    fetchArticle,
    reset,
  };
}

