import { useEffect } from 'react';
import type { AppStateStatus } from 'react-native';
import { AppState, Platform } from 'react-native';
import { router } from 'expo-router';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from '@notifee/react-native';
import * as Sentry from '@sentry/react-native';
import * as Notifications from 'expo-notifications';
import { getCriticalAlertsVolume, getCriticalForChannel, getIsSnoozing, getSoundForChannel, storeBadgeCount, storeCriticalAlertsVolume, storeCriticalForChannel, storeSoundForChannel } from '@storage/mmkv';
import msarEventEmitter from '@utility/msarEventEmitter';
import { queryClient } from '@utility/reactQuery';
import { updatePushToken } from './pushNotificationToken';
import { prefetchCalloutListQuery, prefetchCalloutLogQuery, prefetchCalloutQuery, prefetchChatLogQuery } from '@/remote/query';
import { activeTabStatusQuery } from '@/types/calloutSummary';
import { Api } from '@/remote/api';
import useAuth from '@/hooks/useAuth';
import { getCredentials, getServer } from '@/storage/storage';

const NO_NOTIFICATION = 'none';
const SILENT = 'silent2'; // 'silent' was already used with default sound.

const availableChannels = [
  { label: 'System Default', value: 'default' },
  { label: 'Distortion - Short', value: 'distortion_1_time' },
  { label: 'Distortion - Long', value: 'distortion_3_times' },
  { label: 'MDC new call', value: 'mdc_new_call' },
  { label: 'Rising 1 beep', value: 'beeprising' },
  { label: 'Rising 4 beeps', value: 'uprising' },
  { label: 'Radio - Short', value: 'radio_1_time' },
  { label: 'Radio - Long', value: 'radio_4_times' },
  { label: 'Serene multi-ding', value: 'serene_multi_ding' },
  { label: 'Ships bells', value: 'ships_bells' },
  { label: 'Simple ding', value: 'simple_ding' },
  { label: 'Sweet - Short', value: 'sweet_1_time' },
  { label: 'Sweet - Long', value: 'sweet_6_times' },
  { label: 'Trumpets - Short', value: 'trumpets_1_time' },
  { label: 'Trumpets - Long', value: 'trumpets_4_times' },
  { label: 'Wooden drum', value: 'wooden_drum' },
  { label: 'Yucatan - Short', value: 'yucatan_1_time' },
  { label: 'Yucatan - Long', value: 'yucatan_6_times' },
];

export const availableSounds = [
  { label: 'No notification', value: NO_NOTIFICATION },
  { label: 'Silent', value: SILENT },
].concat(availableChannels);

const vibrationForChannel = {
  'callout': 'long',
  'callout-resolved': 'medium',
  'log': 'short',
  'announcement': 'short',
};

async function checkApplicationPermission() {
  const settings = await notifee.requestPermission({
    criticalAlert: true,
    sound: true,
    announcement: true,
  });

  if (settings.authorizationStatus) {
    console.log('User has notification permissions enabled');
  }
  else {
    const message = 'Notifications disabled. Check your settings.';
    console.log(message);
    Sentry.captureMessage(message);
    // eslint-disable-next-line no-alert
    alert(message);
  }
}

async function registerForPushNotificationsAsync(api: Api) {
  checkApplicationPermission();

  // While this sometimes generates a warning that it is not required, leave
  // it here. In some cases, the device was not registered and getToken failed
  // below.
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }

  updatePushToken();
}

async function setupChannels() {
  const importance = Notifications.AndroidImportance.MAX;
  const groupId = 'main';
  const vibrations = {
    short: [0, 250, 250, 250, 250],
    medium: [0, 500, 500, 500, 500, 500, 500],
    long: [0, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600],
  };

  Notifications.setNotificationChannelGroupAsync(groupId, { name: 'main' });

  for (const soundEnum of availableChannels) {
    const sound = soundEnum.value;
    Object.entries(vibrations).forEach(([vibration, pattern]) => {
      const channel = `${sound}-${vibration}`;
      Notifications.setNotificationChannelAsync(channel, {
        name: channel,
        groupId,
        importance,
        sound: `${sound}.mp3`,
        vibrationPattern: pattern,
      });

      Notifications.setNotificationChannelAsync(`${channel}-alarm`, {
        name: `${channel} - Alarm`,
        importance,
        groupId,
        sound: `${sound}.mp3`,
        vibrationPattern: pattern,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
        },
      });
    });
  }

  Notifications.setNotificationChannelAsync(SILENT, {
    name: 'Silent',
    groupId,
    importance: Notifications.AndroidImportance.LOW,
  });
}

function getChannelForNotification(remoteMessage) {
  const dataChannel: string = remoteMessage.data?.channel ?? 'default';
  const dataLogType = remoteMessage.data?.logType;
  const dataAttending = remoteMessage.data?.attending === 'True';
  const responseChannel = `callout-response-${dataAttending ? 'yes' : 'no'}`;
  const channel = (dataLogType === 'response') ? responseChannel : dataChannel;
  return channel;
}

async function displayNotification(remoteMessage) {
  const channel = getChannelForNotification(remoteMessage);
  const snoozed = getIsSnoozing();
  const critical = !snoozed && getCriticalForChannel(channel);
  const ios_critical = critical
    ? {
        critical: true,
        criticalVolume: getCriticalAlertsVolume(),
      }
    : {};
  const sound = getSoundForChannel(channel) ?? 'default';
  if (sound === NO_NOTIFICATION) {
    console.log('suppress notification', channel);
    return;
  }
  const silent = snoozed || (sound === SILENT);
  const ios_sound = silent ? {} : { sound: `${sound}.mp3` };
  const vibration = vibrationForChannel[channel] ?? 'short';
  let android_channel = `${sound}-${vibration}${critical ? '-alarm' : ''}`;
  if (silent) {
    android_channel = SILENT;
  }
  console.log('display', remoteMessage.data?.body, critical, ios_critical, channel, sound, android_channel);
  notifee.displayNotification({
    title: remoteMessage.data?.title,
    body: remoteMessage.data?.body,
    data: remoteMessage.data,
    android: {
      channelId: android_channel,
      pressAction: { id: 'default' },
    },
    ios: {
      ...(ios_sound),
      interruptionLevel: 'timeSensitive',
      ...(ios_critical),
    },
  });
}

export async function testDisplayNotification(channel: string = 'callout') {
  // storeSoundForChannel(channel, "radio_alert-standard");
  const remoteMessage = {
    data: {
      title: channel,
      body: 'test message',
      channel,
    },
  };
  displayNotification(remoteMessage);
}

async function mutationSuccessNotification(title: string, body: string) {
  const remoteMessage = {
    data: {
      title,
      body,
      channel: 'sent',
    },
  };
  return displayNotification(remoteMessage);
}

export async function calloutResponseSuccessNotification(response: string) {
  return mutationSuccessNotification(
    'Responded to callout',
    `Responded ${response}`,
  );
}

export async function messageSuccessNotification(message: string) {
  return mutationSuccessNotification(
    'Successfully sent message',
    `Sent: ${message}`,
  );
}

export function restoreNotificationDefaults() {
  storeSoundForChannel('callout', 'yucatan_6_times');
  storeCriticalForChannel('callout', true);
  storeSoundForChannel('callout-resolved', 'trumpets_1_time');
  storeCriticalForChannel('callout-resolved', true);
  storeSoundForChannel('log', 'sweet_1_time');
  storeCriticalForChannel('log', true);
  storeSoundForChannel('callout-response-no', 'sweet_1_time');
  storeCriticalForChannel('callout-response-no', true);
  storeSoundForChannel('callout-response-yes', 'sweet_1_time');
  storeCriticalForChannel('callout-response-yes', true);
  storeSoundForChannel('announcement', 'sweet_1_time');
  storeCriticalForChannel('announcement', true);
  storeSoundForChannel('sent', 'uprising');
  storeCriticalForChannel('sent', false);
  storeCriticalAlertsVolume(1.0);
}

function checkNotificationDefaults() {
  if (
    (getSoundForChannel('callout') === undefined)
    || (getSoundForChannel('callout-resolved') === undefined)
    || (getSoundForChannel('log') === undefined)
    || (getSoundForChannel('announcement') === undefined)
  ) {
    restoreNotificationDefaults();
  }
  // These were added later, check separately:
  if (
    (getSoundForChannel('callout-response-no') === undefined)
    || (getSoundForChannel('callout-response-yes') === undefined)
  ) {
    // Copy from log - keeps same behavior as before update.
    const sound = getSoundForChannel('log');
    const critical = getCriticalForChannel('log');
    storeSoundForChannel('callout-response-no', sound);
    storeCriticalForChannel('callout-response-no', critical);
    storeSoundForChannel('callout-response-yes', sound);
    storeCriticalForChannel('callout-response-yes', critical);
  }
  // These were added even later, check separately:
  if (getSoundForChannel('sent') === undefined) {
    storeSoundForChannel('sent', 'uprising');
    storeCriticalForChannel('sent', false);
  }
}

function prefetch(api: Api, notification) {
  const url = notification.data?.url;
  const id = notification.data?.id;
  console.log('prefetch', api, api?.server());
  if (url) {
    if (url === 'view-callout') {
      prefetchCalloutQuery(queryClient, api, id);
      prefetchCalloutLogQuery(queryClient, api, id);
      prefetchCalloutListQuery(queryClient, api, activeTabStatusQuery);
    }
    else if (url === 'chat') {
      prefetchChatLogQuery(queryClient, api);
    }
  }
}

function doRedirect(notification) {
  const url = notification.data?.url;
  if (url) {
    console.log('redirect', url);
    if (url === 'view-callout') {
      router.push({
        pathname: 'view-callout',
        params: { id: notification.data?.id, type: notification.data?.type },
      });
      msarEventEmitter.emit('refreshCallout', {});
    }
    else {
      router.push({ pathname: url });
    }
  }
  return null;
}

export function setupPushNotificationsBackground() {
  console.log('setupPushNotificationsBackground');
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
    if (Platform.OS !== 'ios') { // iOS handled in Notification Service Extenstion
      displayNotification(remoteMessage);
    }

    const creds = await getCredentials();
    const server = await getServer();
    if (creds.token && server) {
      const api = new Api(server, creds.token);
      prefetch(api, remoteMessage);
    }
  });
}

async function doInitialRedirect() {
  const initialNotification = await notifee.getInitialNotification();

  if (initialNotification) {
    console.log('Notification caused application to open', initialNotification.notification);
    console.log('Press action used to open the app', initialNotification.pressAction);
    doRedirect(initialNotification.notification);
  }
}

export function usePushNotificationsOuter() {
  const notifeeOnEvent = async ({ type, detail }) => {
    const { notification } = detail;
    switch (type) {
      case EventType.DISMISSED:
        console.log('User dismissed notification', notification);
        break;
      case EventType.PRESS:
        console.log('User pressed notification', notification);
        doRedirect(notification);
        break;
    }
  };

  useEffect(() => {
    console.log('usePushNotifications useEffect');
    function clearBadgeCount() {
      if (Platform.OS === 'ios') {
        notifee.setBadgeCount(0).then(() => console.log('Badge count removed'));
        storeBadgeCount(0); // Shared state with NSE.
      }
    }

    function onAppStateChange(status: AppStateStatus) {
      console.log('push onAppStateChange', status);
      if (status === 'active') { // app restored to foreground
        clearBadgeCount();
      }
    }

    const onNotificationOpenedAppUnsubscribe
      = messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log('onNotificationOpenedApp', remoteMessage);
        doRedirect(remoteMessage);
      });

    const notifeeOnForegroundUnsubscribe
      = notifee.onForegroundEvent(notifeeOnEvent);
    notifee.onBackgroundEvent(notifeeOnEvent);

    const appStateSubscription = AppState.addEventListener('change', onAppStateChange);

    if (Platform.OS === 'android') {
      setupChannels();
    }

    return () => {
      onNotificationOpenedAppUnsubscribe();
      notifeeOnForegroundUnsubscribe();
      appStateSubscription.remove();
    };
  }, []);
}

export function usePushNotificationsInner() {
  const { token, api } = useAuth();
  const signedIn = !!token;

  useEffect(() => {
    if (signedIn) {
      doInitialRedirect();
    }
  }, [signedIn]);

  useEffect(() => {
    console.log('inner layout useEffect', signedIn);
    if (signedIn) {
      registerForPushNotificationsAsync(api);
      checkNotificationDefaults();
    }
  }, [signedIn, api]);

  useEffect(() => {
    const onMessageUnsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        console.log('onMessage', remoteMessage);
        // Display for iOS too: NSE does not run for foreground notifications.
        displayNotification(remoteMessage);
        prefetch(api, remoteMessage);
      },
    );

    return () => {
      onMessageUnsubscribe();
    };
  }, [api]);
}
