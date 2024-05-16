import { Redirect, Stack, router } from 'expo-router';
import { useEffect } from 'react';
import * as Sentry from "@sentry/react-native";
import "../../storage/global";
import { checkNotificationDefaults, doInitialRedirect, registerForPushNotificationsAsync } from '../../utility/pushNotifications';
import { migrateSharedStorage } from 'storage/mmkv';
import { getServer } from 'storage/storage';

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
    Sentry.setUser({username: global.currentCredentials?.username});
    getServer().then((server:string) => {
      Sentry.setTag('server', server)
    })
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
