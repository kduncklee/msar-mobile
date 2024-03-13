import { useEffect } from "react";
import { AppState, AppStateStatus, Platform } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import {
  QueryCache,
  QueryClient,
  focusManager,
  onlineManager,
} from "@tanstack/react-query";
import { experimental_createPersister } from "@tanstack/query-persist-client-core";
import * as Sentry from "@sentry/react-native";
import Toast from "react-native-root-toast";
import superjson from 'superjson';
import { clientStorage } from "storage/mmkv";


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 10, // 10 seconds
      persister: experimental_createPersister({
        storage: clientStorage,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        serialize: superjson.stringify,
        deserialize: superjson.parse,
      }),
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      Sentry.captureException(error);
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
  if (Platform.OS !== "web") {
    console.log("onAppStateChange");
    focusManager.setFocused(status === "active");
  }
}

export const useReactQueryAppStateRefresh = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);
    return () => subscription.remove();
  }, []);
};
