import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API 路由 - 作为代理转发请求到实际 API
 * 这样可以避免 CORS 问题，因为请求是从服务器端发起的
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const body = await request.json();
    
    // 验证请求体
    if (!body || !body.url) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing url in request body',
          message: '请求体中缺少 url 参数'
        },
        { status: 400 }
      );
    }

    // 根据环境确定目标 API URL
    const isDevelopment = process.env.NODE_ENV === 'development';
    const targetApiUrl = isDevelopment
      ? process.env.NEXT_PUBLIC_API_URL_DEV || 'http://localhost:3000/api/extract'
      : process.env.NEXT_PUBLIC_API_URL_PROD || 'https://capy-book-fetch.vercel.app/api/extract';

    // 准备请求头
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // 生产环境添加认证
    if (!isDevelopment) {
      // 从环境变量获取初始 Token（生产环境）
      const token = process.env.INITIAL_JWT_TOKEN;
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        console.warn('[API Proxy] No JWT token found in environment variables');
      }
    }

    console.log('[API Proxy] Forwarding request to:', targetApiUrl);
    console.log('[API Proxy] Request body:', body);

    // 转发请求到实际 API
    const response = await fetch(targetApiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    // 获取响应数据
    const data = await response.json();

    // 返回响应（保持原始状态码）
    return NextResponse.json(data, { 
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error) {
    console.error('[API Proxy] Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        message: `代理请求失败: ${errorMessage}`
      },
      { status: 500 }
    );
  }
}

