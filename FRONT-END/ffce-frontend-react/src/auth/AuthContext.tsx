import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import AuthService, { type AuthResponse, type LoginDto } from './AuthService';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
  token:   string | null;
  role:    'Cliente' | 'Produtor' | null;
  userId:  number | null;
  loading: boolean;
  login(dto: LoginDto): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token,  setToken]  = useState<string | null>(null);
  const [role,   setRole]   = useState<'Cliente' | 'Produtor' | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  /** Aplica dados lidos do storage ou recebidos do login */
  const applyAuth = (data: AuthResponse) => {
    setToken(data.token);
    setRole(data.role);
    setUserId(data.id);
    localStorage.setItem('auth', JSON.stringify(data));
  };

  /** Remove sessão */
  const clearAuth = () => {
    setToken(null);
    setRole(null);
    setUserId(null);
    localStorage.removeItem('auth');
  };

  /** Carrega sessão (se existir) e testa validade */
  useEffect(() => {
    (async () => {
      const raw = localStorage.getItem('auth');
      if (!raw) return setLoading(false);

      try {
        const parsed = JSON.parse(raw) as AuthResponse;
        applyAuth(parsed);

        const stillValid = await AuthService.verificar();
        if (!stillValid) clearAuth();
      } catch {
        clearAuth();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /** Login explícito */
  const login = async (dto: LoginDto) => {
    setLoading(true);
    try {
      const data = await AuthService.login(dto);
      applyAuth(data);

      navigate(data.role === 'Cliente'
        ? '/cliente/produtos'
        : '/produtor/flores');
    } finally {
      setLoading(false);
    }
  };

  /** Logout */
  const logout = () => {
    clearAuth();
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, role, userId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
