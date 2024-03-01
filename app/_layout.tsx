import { useEffect, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import NetInfo from '@react-native-community/netinfo'
import * as Sentry from "@sentry/react-native";
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import { QueryCache, QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";
import { Slot, useNavigationContainerRef } from 'expo-router';
import { SentryDsn } from "../utility/constants";
import { usePushNotifications } from '../utility/pushNotifications';
import React from 'react';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: SentryDsn,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 10, // 10 seconds
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
onlineManager.setEventListener(setOnline => {
  return NetInfo.addEventListener(state => {
    setOnline(state.isConnected)
  })
})


// React query: Refetch on App focus
function onAppStateChange(status: AppStateStatus) {
  if (Platform.OS !== 'web') {
      console.log('onAppStateChange');
      focusManager.setFocused(status === 'active')
  }
}
const useAppStateRefresh = () => {
    useEffect(() => {
        const subscription = AppState.addEventListener('change', onAppStateChange)
        return () => subscription.remove()
    }, []);
}


const Layout = () => {
  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();

  React.useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

    useAppStateRefresh();
    usePushNotifications(queryClient);

    return (
      <RootSiblingParent>
        <QueryClientProvider client={queryClient}>
          <Slot />
        </QueryClientProvider>
      </RootSiblingParent>
    );
}

export default Sentry.wrap(Layout);
