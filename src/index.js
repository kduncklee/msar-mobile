import { setupPushNotificationsBackground } from '@utility/pushNotifications';

// This file should only import and register the root. No components or exports
// should be added here.
import { App } from 'expo-router/build/qualified-entry';
import { renderRootComponent } from 'expo-router/build/renderRootComponent';

// `@expo/metro-runtime` MUST be the first import to ensure Fast Refresh works
// on web.
import '@expo/metro-runtime';

// This needs to be here to register for headless background updates.
setupPushNotificationsBackground();

renderRootComponent(App);
