'use client';

import type {
  ExtractArticleRequest,
  ExtractArticleResponse,
  ExtractArticleErrorResponse,
} from '@/types/api';
import { getTokenFromCookie } from '@/lib/auth/token';

/**
 * 获取 API URL（根据环境）
 * 直接请求外部 API 服务器（已支持 CORS）
 * 
 * @returns API URL
 */
function getApiUrl(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:3000/api/extract';
  } else {
    return process.env.NEXT_PUBLIC_API_URL_PROD || 'https://capy-book-fetch.vercel.app/api/extract';
  }
}

/**
 * 判断是否需要认证
 * 
 * @returns 如果需要认证返回 true，否则返回 false
 */
function needAuth(): boolean {
  const isDevelopment = process.env.NODE_ENV === 'development';
  // 开发环境不需要认证，生产环境需要认证
  return !isDevelopment;
}

/**
 * 获取认证 Token
 * 
 * @returns JWT Token，如果获取失败返回 null
 */
async function getAuthToken(): Promise<string | null> {
  if (!needAuth()) {
    return null;
  }

  try {
    // 从 Cookie 读取 Token
    const token = getTokenFromCookie();
    
    if (!token) {
      console.warn('[API Client] No token found in cookie');
      return null;
    }

    // 注意：如果 Token 在 Cookie 中是加密存储的，这里需要先解密
    // 目前假设 Cookie 中存储的是原始 JWT Token
    // 如果实际是加密的，需要调用解密函数
    return token;
  } catch (error) {
    console.error('[API Client] Failed to get auth token:', error);
    return null;
  }
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // 生产环境添加认证 Token
    if (needAuth()) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('[API Client] Added Authorization header');
      } else {
        console.warn('[API Client] No token available for authentication');
      }
    }

    // 发送请求（直接请求外部 API，不再通过 Next.js API 路由）
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
      const isDevelopment = process.env.NODE_ENV === 'development';
      if (isDevelopment) {
        userMessage = `无法连接到开发服务器 (${apiUrl})。请确保：1. API 服务器正在运行；2. 服务器地址正确；3. 服务器已配置 CORS 支持。`;
      } else {
        userMessage = `无法连接到 API 服务器 (${apiUrl})。请检查网络连接和 CORS 配置。`;
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

