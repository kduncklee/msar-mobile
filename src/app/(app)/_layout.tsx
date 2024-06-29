import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import '@storage/global';
import { migrateSharedStorage } from 'storage/mmkv';
import { getServer } from 'storage/storage';
import { checkNotificationDefaults, doInitialRedirect, registerForPushNotificationsAsync } from '@utility/pushNotifications';

export default function AppLayout() {
  const signedIn = global.currentCredentials?.token;

  useEffect(() => {
    console.log('inner layout useEffect', signedIn);
    if (signedIn) {
      registerForPushNotificationsAsync();
      checkNotificationDefaults();
      migrateSharedStorage();
    }
  }, [signedIn]);

  useEffect(() => {
    Sentry.setUser({ username: global.currentCredentials?.username });
    getServer().then((server: string) => {
      Sentry.setTag('server', server);
    });
  }, []);

  useEffect(() => {
    if (signedIn) {
      doInitialRedirect();
    }
  }, [signedIn]);

  if (!signedIn) {
    return <Redirect href="/login" />;
  }
  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ headerShown: false }}>
    </Stack>
  );
}
