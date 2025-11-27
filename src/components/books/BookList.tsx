'use client';

import { BookCard } from './BookCard';
import { useBooks } from '@/hooks/useBooks';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 书籍列表组件 Props
 */
export interface BookListProps {
  /** 点击继续阅读的回调 */
  onContinueReading?: (url: string) => void;
  /** 自定义类名 */
  className?: string;
}

/**
 * 书籍列表组件
 * 显示所有书籍，支持空状态提示
 */
export function BookList({ onContinueReading, className }: BookListProps) {
  const { books, isLoading } = useBooks();

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-12 space-y-4', className)}>
        <BookOpen className="h-12 w-12 text-muted-foreground" />
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold">暂无书籍</h3>
          <p className="text-sm text-muted-foreground">
            添加书籍 URL 开始阅读
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-3', className)}>
      {books.map((book) => (
        <BookCard
          key={book.bookId}
          book={book}
          onContinueReading={onContinueReading}
        />
      ))}
    </div>
  );
}

