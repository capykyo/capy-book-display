/**
 * JWT 工具函数
 */

/**
 * JWT Payload 接口
 */
export interface JWTPayload {
  userId?: string;
  iat?: number;
  exp?: number;
  env?: string;
  generatedAt?: string;
  [key: string]: unknown;
}

/**
 * 解析 JWT Token（不验证签名）
 * 
 * @param token - JWT Token 字符串
 * @returns 解析后的 Payload，如果解析失败返回 null
 * 
 * @example
 * const payload = parseJWT(token)
 * if (payload && payload.exp) {
 *   const isExpired = Date.now() >= payload.exp * 1000
 * }
 */
export function parseJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded) as JWTPayload;
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

/**
 * 检查 JWT Token 是否过期
 * 
 * @param token - JWT Token 字符串
 * @returns 如果过期返回 true，未过期或无法判断返回 false
 * 
 * @example
 * if (isTokenExpired(token)) {
 *   // Token 已过期，需要刷新
 * }
 */
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return false; // 如果没有 exp 字段，认为未过期
  }

  // exp 是秒级时间戳，转换为毫秒后比较
  const expirationTime = payload.exp * 1000;
  return Date.now() >= expirationTime;
}

/**
 * 验证 JWT Token 格式
 * 
 * @param token - JWT Token 字符串
 * @returns 如果格式正确返回 true，否则返回 false
 * 
 * @example
 * if (isValidTokenFormat(token)) {
 *   // Token 格式正确
 * }
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token || typeof token !== 'string') {
    return false;
  }

  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * 获取 Token 过期时间
 * 
 * @param token - JWT Token 字符串
 * @returns 过期时间（Date 对象），如果无法获取返回 null
 * 
 * @example
 * const expiresAt = getTokenExpiration(token)
 * if (expiresAt) {
 *   console.log('Token expires at:', expiresAt)
 * }
 */
export function getTokenExpiration(token: string): Date | null {
  const payload = parseJWT(token);
  if (!payload || !payload.exp) {
    return null;
  }

  return new Date(payload.exp * 1000);
}

