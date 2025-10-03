import type { AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import * as Sentry from '@sentry/react-native';
import { clientStorage } from '@storage/mmkv';
import { experimental_createQueryPersister } from '@tanstack/query-persist-client-core';
import { focusManager, onlineManager, QueryCache, QueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';
import Toast from 'react-native-root-toast';
import superjson from 'superjson';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 10, // 10 seconds
      persister: experimental_createQueryPersister({
        storage: clientStorage,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        serialize: superjson.stringify,
        deserialize: superjson.parse,
      }).persisterFn,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      Sentry.captureException(error);
      console.log('QueryCache onError:', error);
      Toast.show(`Something went wrong: ${error.message}`);
    },
  }),
});

// React query: Online status management
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(state.isConnected);
  });
});

// React query: Refetch on App focus
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
    console.log('onAppStateChange');
    focusManager.setFocused(status === 'active');
  }
}

export function useReactQueryAppStateRefresh() {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', onAppStateChange);
    return () => subscription.remove();
  }, []);
}
