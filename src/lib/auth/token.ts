'use client';

import { getCookie, setCookie, removeCookie, type CookieOptions } from './cookie';
import { parseJWT, isTokenExpired, isValidTokenFormat } from './jwt';

/**
 * Token 存储的 Cookie 名称
 */
const TOKEN_COOKIE_NAME = 'auth_token';

/**
 * Cookie 配置
 */
const COOKIE_OPTIONS: CookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  // maxAge 根据 Token 的 exp 动态设置
};

/**
 * 从环境变量获取初始 Token
 * 
 * @returns 初始 JWT Token，如果不存在返回 undefined
 */
export function getInitialTokenFromEnv(): string | undefined {
  if (typeof window === 'undefined') {
    // 服务端环境，从环境变量读取
    return process.env.JWT_TOKEN;
  }
  
  // 客户端环境，无法直接访问环境变量（非 NEXT_PUBLIC_ 前缀）
  // 需要通过服务端获取或从 Cookie 读取
  return undefined;
}

/**
 * 从 Cookie 获取 Token（加密值）
 * 
 * @returns 加密的 Token 字符串，如果不存在返回 undefined
 */
export function getTokenFromCookie(): string | undefined {
  return getCookie(TOKEN_COOKIE_NAME);
}

/**
 * 保存 Token 到 Cookie（加密存储）
 * 
 * @param encryptedToken - 加密后的 Token 字符串
 * @param maxAge - Cookie 过期时间（秒），如果不提供则根据 Token 的 exp 计算
 */
export function saveTokenToCookie(encryptedToken: string, maxAge?: number): void {
  // 如果提供了 maxAge，直接使用
  // 否则尝试从 Token 中解析 exp 来计算
  let cookieMaxAge = maxAge;
  
  if (!cookieMaxAge) {
    // 尝试解析 Token 获取过期时间
    // 注意：这里假设传入的是原始 JWT（用于计算过期时间）
    // 实际存储时应该是加密后的值
    const payload = parseJWT(encryptedToken);
    if (payload?.exp) {
      const expirationTime = payload.exp * 1000;
      const now = Date.now();
      cookieMaxAge = Math.max(0, Math.floor((expirationTime - now) / 1000));
    }
  }

  setCookie(TOKEN_COOKIE_NAME, encryptedToken, {
    ...COOKIE_OPTIONS,
    maxAge: cookieMaxAge,
  });
}

/**
 * 从 Cookie 删除 Token
 */
export function removeTokenFromCookie(): void {
  removeCookie(TOKEN_COOKIE_NAME, COOKIE_OPTIONS);
}

/**
 * 检查 Token 是否过期
 * 
 * @param token - JWT Token（原始 JWT，未加密）
 * @returns 如果过期返回 true，否则返回 false
 */
export function checkTokenExpiration(token: string): boolean {
  return isTokenExpired(token);
}

/**
 * 验证 Token 格式
 * 
 * @param token - JWT Token 字符串
 * @returns 如果格式正确返回 true，否则返回 false
 */
export function validateTokenFormat(token: string): boolean {
  return isValidTokenFormat(token);
}

