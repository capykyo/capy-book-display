'use client';

import type {
  ExtractArticleRequest,
  ExtractArticleResponse,
  ExtractArticleErrorResponse,
} from '@/types/api';

/**
 * 获取 API URL（根据环境）
 * 使用 Next.js API 路由作为代理，避免 CORS 问题
 * 
 * @returns API URL
 */
function getApiUrl(): string {
  // 使用 Next.js API 路由作为代理
  // 这样请求从服务器端发起，不受浏览器 CORS 限制
  return '/api/extract';
}

/**
 * 判断是否需要认证
 * 
 * @deprecated 认证现在由服务器端代理处理，客户端不再需要处理认证
 * @returns 如果需要认证返回 true，否则返回 false
 */
function needAuth(): boolean {
  // 认证现在由 Next.js API 路由代理处理
  return false;
}

/**
 * 获取认证 Token
 * 
 * @deprecated 认证现在由服务器端代理处理，客户端不再需要处理认证
 * @returns JWT Token，如果获取失败返回 null
 */
async function getAuthToken(): Promise<string | null> {
  // 认证现在由 Next.js API 路由代理处理
  // 如果将来需要从客户端 Cookie 传递 Token，可以在这里实现
  return null;
}

/**
 * 提取文章内容
 * 
 * @param url - 文章 URL
 * @returns 文章数据或错误信息
 * 
 * @example
 * const result = await extractArticle('https://quanben.io/n/xuanjiezhimen/1.html')
 * if (result.success) {
 *   console.log(result.data.title)
 * } else {
 *   console.error(result.error)
 * }
 */
export async function extractArticle(
  url: string
): Promise<ExtractArticleResponse | ExtractArticleErrorResponse> {
  try {
    // 准备请求
    const apiUrl = getApiUrl();
    console.log('[API Client] Requesting article from:', apiUrl);
    console.log('[API Client] Article URL:', url);
    
    // 准备请求头
    // 注意：认证现在由 Next.js API 路由代理处理
    // 客户端不再需要处理 JWT Token
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // 发送请求
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ url } as ExtractArticleRequest),
    });

    // 处理响应
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `API request failed: ${response.statusText}`;
      
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        // 如果响应不是 JSON，使用原始文本
        errorMessage = errorText || errorMessage;
      }

      return {
        success: false,
        error: errorMessage,
        message: `HTTP ${response.status}: ${errorMessage}`,
      };
    }

    const data = await response.json();

    // 验证响应格式
    if (data.success && data.data) {
      return data as ExtractArticleResponse;
    } else {
      return {
        success: false,
        error: data.error || 'Invalid response format',
        message: data.message,
      };
    }
  } catch (error) {
    console.error('Failed to extract article:', error);
    
    const apiUrl = getApiUrl();
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    let errorMessage = error instanceof Error ? error.message : 'Unknown error';
    let userMessage = `网络请求失败: ${errorMessage}`;
    
    // 针对 "Failed to fetch" 错误提供更详细的提示
    if (errorMessage === 'Failed to fetch' || errorMessage.includes('fetch')) {
      if (isDevelopment) {
        userMessage = `无法连接到开发服务器 (${apiUrl})。请确保：1. API 服务器正在运行；2. 服务器地址正确；3. 没有 CORS 限制。`;
      } else {
        userMessage = `无法连接到 API 服务器 (${apiUrl})。请检查网络连接。`;
      }
    }
    
    console.error('[API Client] Request failed:', {
      apiUrl,
      error: errorMessage,
      userMessage,
    });
    
    return {
      success: false,
      error: errorMessage,
      message: userMessage,
    };
  }
}

