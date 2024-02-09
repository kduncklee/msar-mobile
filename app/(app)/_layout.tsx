import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import "../../storage/global";
import { checkNotificationDefaults, registerForPushNotificationsAsync } from '../../utility/pushNotifications';

export default function AppLayout() {

  if (!global.currentCredentials?.token) {
    return <Redirect href="/login" />;
  }

  useEffect(() => {
    console.log('inner layout useEffect');
    registerForPushNotificationsAsync();
    checkNotificationDefaults();
  }, []);

  // This layout can be deferred because it's not the root layout.
  return (
        <Stack screenOptions={{ headerShown: false }}>
        </Stack>
  );
}
