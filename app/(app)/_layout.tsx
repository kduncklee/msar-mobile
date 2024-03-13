import { Redirect, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import "../../storage/global";
import { checkNotificationDefaults, doInitialRedirect, registerForPushNotificationsAsync } from '../../utility/pushNotifications';
import { migrateSharedStorage } from 'storage/mmkv';

export default function AppLayout() {

  if (!global.currentCredentials?.token) {
    return <Redirect href="/login" />;
  }

  useEffect(() => {
    console.log('inner layout useEffect');
    registerForPushNotificationsAsync();
    checkNotificationDefaults();
    migrateSharedStorage();
  }, []);

  useEffect(() => {
    doInitialRedirect();
  }, []);

  // This layout can be deferred because it's not the root layout.
  return (
        <Stack screenOptions={{ headerShown: false }}>
        </Stack>
  );
}
