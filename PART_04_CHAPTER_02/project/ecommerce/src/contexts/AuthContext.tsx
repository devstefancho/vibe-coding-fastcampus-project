'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '@/lib/types';
import { api } from '@/lib/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(email, password);

      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return true;
      } else {
        alert(response.error || '로그인에 실패했습니다.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('로그인 중 오류가 발생했습니다.');
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, phone: string, address: string): Promise<boolean> => {
    try {
      const response = await api.register(email, password, name, phone, address);

      if (response.userId) {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        return true;
      } else {
        alert(response.error || '회원가입에 실패했습니다.');
        return false;
      }
    } catch (error) {
      console.error('Register error:', error);
      alert('회원가입 중 오류가 발생했습니다.');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}