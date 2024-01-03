import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import NetInfo from '@react-native-community/netinfo'
import { QueryClient, QueryClientProvider, focusManager, onlineManager } from "@tanstack/react-query";
import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import msarEventEmitter from '../utility/msarEventEmitter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 5, // 5 seconds
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
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="settings"
                options={{ presentation: 'modal'}} />
        </Stack>
      </QueryClientProvider>
    );
}

export default Layout;
