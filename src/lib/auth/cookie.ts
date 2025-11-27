'use client';

/**
 * Cookie 操作接口
 */
export interface CookieOptions {
  /** 过期时间（秒数） */
  maxAge?: number;
  /** 过期日期 */
  expires?: Date;
  /** 仅 HTTPS 传输 */
  secure?: boolean;
  /** SameSite 策略 */
  sameSite?: 'strict' | 'lax' | 'none';
  /** Cookie 路径 */
  path?: string;
}

/**
 * 设置 Cookie
 * 
 * @param name - Cookie 名称
 * @param value - Cookie 值
 * @param options - Cookie 选项
 * @throws 如果不在客户端环境会抛出错误
 * 
 * @example
 * setCookie('token', 'value', { maxAge: 3600, secure: true })
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof window === 'undefined') {
    throw new Error('setCookie can only be used in client components');
  }

  // 编码名称和值
  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);

  // 构建 Cookie 字符串
  let cookieString = `${encodedName}=${encodedValue}`;

  // 添加过期时间
  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  } else if (options.expires) {
    cookieString += `; expires=${options.expires.toUTCString()}`;
  }

  // 添加 secure 标志
  if (options.secure) {
    cookieString += '; secure';
  }

  // 添加 sameSite 策略
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }

  // 添加路径
  cookieString += `; path=${options.path || '/'}`;

  // 设置 Cookie
  document.cookie = cookieString;
}

/**
 * 获取 Cookie
 * 
 * @param name - Cookie 名称
 * @returns Cookie 值，如果不存在返回 undefined
 * 
 * @example
 * const token = getCookie('token')
 */
export function getCookie(name: string): string | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const encodedName = encodeURIComponent(name);
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${encodedName}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue ? decodeURIComponent(cookieValue) : undefined;
  }

  return undefined;
}

/**
 * 删除 Cookie
 * 
 * @param name - Cookie 名称
 * @param options - Cookie 选项（用于匹配原始 Cookie 的路径等）
 * 
 * @example
 * removeCookie('token', { path: '/' })
 */
export function removeCookie(name: string, options: CookieOptions = {}): void {
  setCookie(name, '', {
    ...options,
    maxAge: 0,
  });
}

