import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Stack, router } from 'expo-router';
import msarEventEmitter from '../utility/msarEventEmitter';

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

    useNotificationObserver();

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="settings"
                options={{ presentation: 'modal'}} />
        </Stack>
    );
}

export default Layout;