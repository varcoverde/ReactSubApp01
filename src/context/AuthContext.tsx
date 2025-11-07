import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import type { UserProfile } from '../types/user.ts';
import { getUserFromToken } from '../utils/jwt.ts';

interface AuthContextValue {
  usuario: UserProfile | null;
  carregando: boolean;
  atualizarSessao: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<UserProfile | null>(null);
  const [carregando, setCarregando] = useState(true);

  const atualizarSessao = () => {
    const user = getUserFromToken();
    setUsuario(user);
    setCarregando(false);
  };

  useEffect(() => {
    atualizarSessao();
  }, []);

  const value = useMemo(
    () => ({
      usuario,
      carregando,
      atualizarSessao
    }),
    [usuario, carregando]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
