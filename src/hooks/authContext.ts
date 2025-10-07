import type { Api } from '@/remote/api';
import { createContext } from 'react';

export interface AuthContextType {
  username: string;
  token: string;
  server: string;
  api: Api;
  loading: boolean;
  login: (username: string, password: string, server?: string) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
