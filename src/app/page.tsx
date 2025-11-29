'use client';

import { useState } from 'react';
import { UrlInput } from '@/components/books/UrlInput';
import { BookList } from '@/components/books/BookList';
import { ArticleReader } from '@/components/article/ArticleReader';
import { BooksProvider } from '@/contexts/BooksContext';
import { ReadingProgressProvider } from '@/contexts/ReadingProgressContext';
import { BookOpen } from 'lucide-react';

/**
 * 主页面组件
 * 集成书籍管理和文章阅读功能
 */
function HomeContent() {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [showReader, setShowReader] = useState(false);

  // 处理继续阅读
  const handleContinueReading = (url: string) => {
    setCurrentUrl(url);
    setShowReader(true);
  };

  // 处理添加书籍成功
  const handleAddSuccess = () => {
    // 书籍添加成功（可以在这里添加成功提示UI）
  };

  // 返回书籍列表
  const handleBackToList = () => {
    setShowReader(false);
    setCurrentUrl(null);
  };

  // 如果正在阅读文章，显示阅读器
  if (showReader && currentUrl) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={handleBackToList}
            className="mb-4 text-sm text-muted-foreground hover:text-foreground flex items-center gap-2"
          >
            ← 返回书籍列表
          </button>
          <ArticleReader url={currentUrl} />
        </div>
      </div>
    );
  }

  // 显示书籍列表和管理界面
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            文章阅读器
          </h1>
          <p className="text-muted-foreground mt-2">
            添加书籍 URL 开始阅读，支持保存阅读进度
          </p>
        </div>

        {/* URL 输入区域 */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">添加书籍</h2>
          <UrlInput onSuccess={handleAddSuccess} />
        </div>

        {/* 书籍列表 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">我的书籍</h2>
          <BookList onContinueReading={handleContinueReading} />
        </div>
      </div>
    </div>
  );
}

/**
 * 主页面（带 Provider）
 */
export default function Home() {
  return (
    <BooksProvider>
      <ReadingProgressProvider>
        <HomeContent />
      </ReadingProgressProvider>
    </BooksProvider>
  );
}
