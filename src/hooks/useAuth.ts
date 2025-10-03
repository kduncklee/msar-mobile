import type { AuthContextType } from '@/components/AuthProvider';
import { use } from 'react';
import { AuthContext } from '@/components/AuthProvider';

export default function useAuth(): AuthContextType {
  return use(AuthContext);
}
