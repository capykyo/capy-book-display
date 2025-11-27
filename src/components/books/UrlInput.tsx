'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBooks } from '@/hooks/useBooks';
import { isValidBookUrl } from '@/lib/books/urlParser';
import { Plus, AlertCircle } from 'lucide-react';

/**
 * URL 输入组件 Props
 */
export interface UrlInputProps {
  /** 添加成功后的回调 */
  onSuccess?: (bookName: string) => void;
  /** 添加失败后的回调 */
  onError?: (error: string) => void;
}

/**
 * URL 输入组件
 * 用于输入书籍 URL 并添加到书籍列表
 */
export function UrlInput({ onSuccess, onError }: UrlInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { addBook } = useBooks();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 验证 URL 格式
    if (!url.trim()) {
      setError('请输入书籍 URL');
      return;
    }

    if (!isValidBookUrl(url.trim())) {
      setError('URL 格式不正确，应为：https://quanben.io/n/{book-id}/{chapter-number}.html');
      return;
    }

    setIsAdding(true);

    try {
      const book = await addBook(url.trim());

      if (book) {
        setUrl('');
        setError(null);
        onSuccess?.(book.bookName);
      } else {
        const errorMsg = '添加书籍失败，请检查 URL 是否正确';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '添加书籍时发生错误';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="url"
          placeholder="输入书籍 URL，例如：https://quanben.io/n/xuanjiezhimen/1.html"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError(null);
          }}
          className="flex-1"
          disabled={isAdding}
        />
        <Button type="submit" disabled={isAdding || !url.trim()}>
          {isAdding ? (
            <>
              <span className="animate-spin">⏳</span>
              添加中...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              添加
            </>
          )}
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

