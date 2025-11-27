import type { ArticleData } from '@/types/article';
import { BookOpen, User, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 文章头部组件 Props
 */
export interface ArticleHeaderProps {
  /** 文章数据 */
  article: ArticleData;
  /** 自定义类名 */
  className?: string;
}

/**
 * 文章头部组件
 * 显示书名、标题、作者和描述信息
 */
export function ArticleHeader({ article, className }: ArticleHeaderProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* 书名 */}
      {article.bookName && (
        <div className="flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <BookOpen className="h-5 w-5" />
          <span>{article.bookName}</span>
        </div>
      )}

      {/* 标题 */}
      <h1 className="text-3xl md:text-4xl font-bold leading-tight">
        {article.title}
      </h1>

      {/* 作者 */}
      {article.author && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{article.author}</span>
        </div>
      )}

      {/* 描述 */}
      {article.description && (
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">{article.description}</p>
        </div>
      )}
    </div>
  );
}

