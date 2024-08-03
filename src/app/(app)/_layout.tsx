import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import { migrateSharedStorage } from 'storage/mmkv';
import { usePushNotificationsInner } from '@utility/pushNotifications';
import useAuth from '@/hooks/useAuth';

export default function AppLayout() {
  const { username, token, server } = useAuth();
  const signedIn = !!token;
  usePushNotificationsInner();

  useEffect(() => {
    migrateSharedStorage();
  }, []);

  useEffect(() => {
    Sentry.setUser({ username });
    Sentry.setTag('server', server);
  }, [server, username]);

  if (!signedIn) {
    return <Redirect href="/login" />;
  }
  // This layout can be deferred because it's not the root layout.
  return (
    <Stack screenOptions={{ headerShown: false }}>
    </Stack>
  );
}
