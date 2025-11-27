'use client';

import { useEffect } from 'react';
import { ArticleHeader } from './ArticleHeader';
import { ArticleContent } from './ArticleContent';
import { ArticleNavigation } from './ArticleNavigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useArticle } from '@/hooks/useArticle';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { parseBookUrl } from '@/lib/books/urlParser';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 文章阅读器组件 Props
 */
export interface ArticleReaderProps {
  /** 文章 URL */
  url: string;
  /** 自定义类名 */
  className?: string;
}

/**
 * 文章阅读器主组件
 * 整合所有子组件，管理文章状态和处理导航逻辑
 */
export function ArticleReader({ url, className }: ArticleReaderProps) {
  const { article, isLoading, error, fetchArticle } = useArticle();
  const { saveProgress } = useReadingProgress();

  // 加载文章
  useEffect(() => {
    if (url) {
      fetchArticle(url);
    }
  }, [url, fetchArticle]);

  // 保存阅读进度
  useEffect(() => {
    if (article && url) {
      const parsed = parseBookUrl(url);
      if (parsed) {
        saveProgress(parsed.bookId, parsed.chapterNumber, url);
      }
    }
  }, [article, url, saveProgress]);

  // 处理章节导航
  const handleNavigate = (newUrl: string) => {
    fetchArticle(newUrl);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className={cn('space-y-6', className)}>
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-64 w-full" />
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // 无文章数据
  if (!article) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-muted-foreground">暂无文章内容</p>
      </div>
    );
  }

  // 正常显示
  return (
    <div className={cn('max-w-4xl mx-auto px-4 py-8', className)}>
      <ArticleHeader article={article} />
      <ArticleContent article={article} />
      <ArticleNavigation
        article={article}
        onPrev={handleNavigate}
        onNext={handleNavigate}
      />
    </div>
  );
}

