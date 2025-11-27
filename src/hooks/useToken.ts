'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getTokenFromCookie,
  saveTokenToCookie,
  removeTokenFromCookie,
  getInitialTokenFromEnv,
  checkTokenExpiration,
  validateTokenFormat,
} from '@/lib/auth/token';

/**
 * Token 管理 Hook 的返回类型
 */
export interface UseTokenReturn {
  /** Token 值 */
  token: string | null;
  /** Token 是否已过期 */
  isExpired: boolean;
  /** 更新 Token 的方法 */
  updateToken: (newToken: string) => void;
  /** 删除 Token 的方法 */
  removeToken: () => void;
  /** 刷新 Token 的方法（从环境变量重新获取） */
  refreshToken: () => void;
}

/**
 * Token 管理 Hook
 * 
 * @returns Token 状态和管理方法
 * 
 * @example
 * const { token, isExpired, updateToken, removeToken } = useToken()
 */
export function useToken(): UseTokenReturn {
  const [token, setToken] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  // 从 Cookie 初始化 Token
  useEffect(() => {
    const loadToken = () => {
      const cookieToken = getTokenFromCookie();
      
      if (cookieToken) {
        // 验证 Token 格式
        if (validateTokenFormat(cookieToken)) {
          setToken(cookieToken);
          setIsExpired(checkTokenExpiration(cookieToken));
        } else {
          // Token 格式无效，清除
          removeTokenFromCookie();
        }
      } else {
        // Cookie 中没有 Token，尝试从环境变量获取初始 Token
        const envToken = getInitialTokenFromEnv();
        if (envToken && validateTokenFormat(envToken)) {
          // 保存到 Cookie（注意：这里应该加密后再保存）
          // TODO: 实现加密逻辑
          saveTokenToCookie(envToken);
          setToken(envToken);
          setIsExpired(checkTokenExpiration(envToken));
        }
      }
    };

    loadToken();
  }, []);

  // 更新 Token
  const updateToken = useCallback((newToken: string) => {
    if (!validateTokenFormat(newToken)) {
      console.error('Invalid token format');
      return;
    }

    // 保存到 Cookie（注意：这里应该加密后再保存）
    // TODO: 实现加密逻辑
    saveTokenToCookie(newToken);
    setToken(newToken);
    setIsExpired(checkTokenExpiration(newToken));
  }, []);

  // 删除 Token
  const removeToken = useCallback(() => {
    removeTokenFromCookie();
    setToken(null);
    setIsExpired(false);
  }, []);

  // 刷新 Token（从环境变量重新获取）
  const refreshToken = useCallback(() => {
    const envToken = getInitialTokenFromEnv();
    if (envToken && validateTokenFormat(envToken)) {
      updateToken(envToken);
    }
  }, [updateToken]);

  return {
    token,
    isExpired,
    updateToken,
    removeToken,
    refreshToken,
  };
}

