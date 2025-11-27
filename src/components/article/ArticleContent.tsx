import { Card, CardContent } from '@/components/ui/card';
import type { ArticleData } from '@/types/article';
import { cn } from '@/lib/utils';

/**
 * 文章内容组件 Props
 */
export interface ArticleContentProps {
  /** 文章数据 */
  article: ArticleData;
  /** 自定义类名 */
  className?: string;
}

/**
 * 格式化文章内容
 * 将 \n 转换为段落
 */
function formatContent(content: string): string[] {
  return content.split('\n').filter((line) => line.trim().length > 0);
}

/**
 * 文章内容组件
 * 格式化显示文章内容，优化阅读体验
 */
export function ArticleContent({ article, className }: ArticleContentProps) {
  const paragraphs = formatContent(article.content);

  return (
    <Card className={cn('mt-6', className)}>
      <CardContent className="p-6 md:p-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="space-y-4 text-base leading-7 text-foreground">
            {paragraphs.map((paragraph, index) => (
              <p
                key={index}
                className="mb-4 last:mb-0"
                style={{
                  textIndent: '2em',
                  lineHeight: '1.8',
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

