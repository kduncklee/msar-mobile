import { createContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { storage } from '@storage/mmkv';
import * as pushNotificationToken from '@/utility/pushNotificationToken';
import { Api } from '@/remote/api';
import type { loginResponse } from '@/remote/responses';
import { clearCredentials, clearServer, getCredentials, getServer, storeCredentials, storeServer } from '@/storage/storage';

export interface AuthContextType {
  username: string;
  token: string;
  server: string;
  api: Api;
  loading: boolean;
  login: (username: string, password: string) => Promise<string>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [username, setUsername] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [server, setServer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);
  const queryClient = useQueryClient();
  const api = new Api(server, token);

  useEffect(() => {
    const tokenCheck = async () => {
      const creds = await getCredentials();
      setUsername(creds.username);
      setToken(creds.token);
      const server = await getServer();
      setServer(server);
      setLoadingInitial(false);
    };
    tokenCheck();
  }, []);

  async function login(username: string, password: string) {
    setLoading(true);

    let server;
    let server_username = username;
    const match = username.match(/_([^_]+)_(.+)/);
    if (match) {
      server = match[1];
      server_username = match[2];
      console.log(server, server_username);
      await storeServer(server);
      setServer(server);
    }
    else {
      console.log('clear server', server_username);
      await clearServer();
      setServer(null);
    }
    const response: loginResponse = await api.login(server, server_username, password);
    if (response.non_field_errors) {
      setLoading(false);
      return response.non_field_errors.join('\n');
    }

    if (response.token) {
      setUsername(server_username);
      setToken(response.token);
      console.log('storing', server_username, response.token);
      await storeCredentials(server_username, response.token);
      setLoading(false);
      return null;
    }
    setLoading(false);
    return 'No token found in response';
  }

  function logout() {
    pushNotificationToken.removePushToken(api);

    setUsername(null);
    setToken(null);
    setServer(null);

    clearCredentials();
    clearServer();
    queryClient.invalidateQueries();
    queryClient.clear();
    storage.clearAll();
  }

  const memoedValue = useMemo(
    () => ({
      username,
      token,
      server,
      api,
      loading,
      login,
      logout,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [username, token, server, api, loading],
  );
  return (
    <AuthContext.Provider value={memoedValue as AuthContextType}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}
