'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBooks } from '@/hooks/useBooks';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import type { Book } from '@/types/book';
import { BookOpen, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * 书籍卡片组件 Props
 */
export interface BookCardProps {
  /** 书籍数据 */
  book: Book;
  /** 点击继续阅读的回调 */
  onContinueReading?: (url: string) => void;
}

/**
 * 格式化时间戳为可读日期
 */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return '今天';
  } else if (days === 1) {
    return '昨天';
  } else if (days < 7) {
    return `${days}天前`;
  } else {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
}

/**
 * 书籍卡片组件
 * 显示书籍信息，支持继续阅读和删除功能
 */
export function BookCard({ book, onContinueReading }: BookCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { removeBook } = useBooks();
  const { getBookProgress } = useReadingProgress();

  const progress = getBookProgress(book.bookId);
  const lastReadTime = progress?.updatedAt || book.addedAt;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await removeBook(book.bookId);
      if (success) {
        setShowDeleteDialog(false);
      }
    } catch (error) {
      console.error('Failed to delete book:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleContinueReading = () => {
    if (book.lastReadUrl && onContinueReading) {
      onContinueReading(book.lastReadUrl);
    }
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {book.bookName}
            </span>
          </CardTitle>
          <CardDescription>
            当前章节：第 {book.currentChapter} 章
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>最后阅读：{formatDate(lastReadTime)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={handleContinueReading}
            disabled={!book.lastReadUrl}
          >
            继续阅读
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除《{book.bookName}》吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

