/* eslint-disable react-refresh/only-export-components */
import * as Sentry from '@sentry/react-native';
import { QueryClientProvider } from '@tanstack/react-query';
import { SentryDsn } from '@utility/constants';
import { usePushNotificationsOuter } from '@utility/pushNotifications';
import { Slot, useNavigationContainerRef } from 'expo-router';
import { useEffect } from 'react';
import { RootSiblingParent } from 'react-native-root-siblings';
import { queryClient, useReactQueryAppStateRefresh } from 'utility/reactQuery';
import { AuthProvider } from '@/components/AuthProvider';

const routingInstrumentation = Sentry.reactNavigationIntegration();

Sentry.init({
  dsn: SentryDsn,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
  attachScreenshot: true,
  attachViewHierarchy: true,
  integrations: [
    routingInstrumentation,
  ],
});

function Layout() {
  // Capture the NavigationContainer ref and register it with the instrumentation.
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  useReactQueryAppStateRefresh();
  usePushNotificationsOuter();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RootSiblingParent>
          <Slot />
        </RootSiblingParent>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default Sentry.wrap(Layout);
