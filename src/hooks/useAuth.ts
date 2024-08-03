import { useContext } from 'react';
import { AuthContext, type AuthContextType } from '@/components/AuthProvider';

export default function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
