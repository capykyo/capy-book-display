'use client';

import { Button } from '@/components/ui/button';
import type { ArticleData } from '@/types/article';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 文章导航组件 Props
 */
export interface ArticleNavigationProps {
  /** 文章数据 */
  article: ArticleData;
  /** 点击上一章的回调 */
  onPrev?: (url: string) => void;
  /** 点击下一章的回调 */
  onNext?: (url: string) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 文章导航组件
 * 显示上一章和下一章按钮
 */
export function ArticleNavigation({
  article,
  onPrev,
  onNext,
  className,
}: ArticleNavigationProps) {
  const hasPrev = article.prevLink !== null;
  const hasNext = article.nextLink !== null;

  if (!hasPrev && !hasNext) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-4 mt-8 pt-6 border-t',
        className
      )}
    >
      <Button
        variant="outline"
        className="flex-1"
        disabled={!hasPrev}
        onClick={() => {
          if (hasPrev && article.prevLink && onPrev) {
            onPrev(article.prevLink);
          }
        }}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        上一章
      </Button>

      <Button
        variant="outline"
        className="flex-1"
        disabled={!hasNext}
        onClick={() => {
          if (hasNext && article.nextLink && onNext) {
            onNext(article.nextLink);
          }
        }}
      >
        下一章
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
}

