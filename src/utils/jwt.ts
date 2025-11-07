import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';

import type { UserProfile } from '../types/user.ts';

const TOKEN_COOKIE = 'app_token';

interface JwtPayload {
  sub: string;
  name: string;
  email: string;
  roles?: string[];
  avatarUrl?: string;
  [key: string]: unknown;
}

export const getAccessToken = () => Cookies.get(TOKEN_COOKIE);

export const getUserFromToken = (): UserProfile | null => {
  const token = getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const payload = jwtDecode<JwtPayload>(token);

    return {
      id: payload.sub,
      nome: payload.name,
      email: payload.email,
      roles: payload.roles ?? [],
      avatarUrl: payload.avatarUrl
    };
  } catch (error) {
    console.error('Falha ao decodificar token JWT', error);
    return null;
  }
};
