import type { AuthContextType } from '@/hooks/authContext';
import { use } from 'react';
import { AuthContext } from '@/hooks/authContext';

export default function useAuth(): AuthContextType {
  return use(AuthContext);
}
