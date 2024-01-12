import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo'
import * as Sentry from "@sentry/react-native";
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";
import * as Notifications from 'expo-notifications';
import { Slot, router } from 'expo-router';
import { SentryDsn } from "../utility/constants";
import msarEventEmitter from '../utility/msarEventEmitter';

Sentry.init({
  dsn: SentryDsn,
  enableInExpoDevelopment: true,
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.ReactNativeTracing({
      enableAppStartTracking: false,
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

const useNotificationObserver = () => {
    useEffect(() => {
      let isMounted = true;
  
      function redirect(notification: Notifications.Notification) {
        const url = notification.request.content.data?.url;
        if (url) {
          if (url === 'view-callout') {
            router.push({ pathname: 'view-callout', params: { id: notification.request.content.data?.id, type: notification.request.content.data?.type } })
            msarEventEmitter.emit('refreshCallout',{});
          } else {
            router.push({ pathname: url })
          }
        }
      }
  
      Notifications.getLastNotificationResponseAsync()
        .then(response => {
          if (!isMounted || !response?.notification) {
            return;
          }
          redirect(response?.notification);
        });
  
      const subscription = Notifications.addNotificationResponseReceivedListener(response => {
        redirect(response.notification);
      });
  
      return () => {
        isMounted = false;
        subscription.remove();
      };
    }, []);
  }

const Layout = () => {

    useAppStateRefresh();
    useNotificationObserver();

    return (
      <QueryClientProvider client={queryClient}>
        <Slot />
      </QueryClientProvider>
    );
}

export default Sentry.wrap(Layout);
