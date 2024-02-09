import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import * as Sentry from "@sentry/react-native";
import * as Notifications from 'expo-notifications';
import { apiRemoveDeviceId, apiSetDeviceId } from '../remote/api';
import { getCriticalAlertsVolume, getCriticalForChannel, getSoundForChannel, storeCriticalAlertsVolume, storeCriticalForChannel, storeSoundForChannel } from '../storage/storage';

export const availableSounds = [
  { label: 'System Default', value: 'default' },
  { label: 'Distortion - Short', value: 'distortion_1_time' },
  { label: 'Distortion - Long', value: 'distortion_3_times' },
  { label: 'Radio - Short', value: 'radio_1_time' },
  { label: 'Radio - Long', value: 'radio_4_times' },
  { label: 'Sweet - Short', value: 'sweet_1_time' },
  { label: 'Sweet - Long', value: 'sweet_6_times' },
  { label: 'Trumpets - Short', value: 'trumpets_1_time' },
  { label: 'Trumpets - Long', value: 'trumpets_4_times' },
  { label: 'Yucatan - Short', value: 'yucatan_1_time' },
  { label: 'Yucatan - Long', value: 'yucatan_6_times' },
];

const vibrationForChannel = {
  "callout": "long",
  "callout-resolved": "medium",
  "log": "short",
  "announcement": "short",
}

async function checkApplicationPermission() {
  const settings = await notifee.requestPermission({
    criticalAlert: true,
    sound: true,
    announcement: true,
  });

  if (settings.authorizationStatus) {
    console.log('User has notification permissions enabled');
  } else {
    const message = 'Notifications disabled. Check your settings.';
    console.log(message);
    Sentry.captureMessage(message)
    alert(message);
  }
}

export const getToken = async () => {
  return messaging().getToken();
}

export const sendPushToken = async (token: string) => {
  const response: any = await apiSetDeviceId(token, true);
}

export const removePushToken = async () => {
  let token = await getToken();
  if (token != null) {
    const response: any = await apiRemoveDeviceId(token);
  }
}

export const registerForPushNotificationsAsync = async () => {
  checkApplicationPermission();

  // While this sometimes generates a warning that it is not required, leave
  // it here. In some cases, the device was not registered and getToken failed
  // below.
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
       await messaging().registerDeviceForRemoteMessages();
  }

  const token = await getToken();
  console.log("registered", token);
  await sendPushToken(token);
}

const setupChannels = async () => {
  const importance = Notifications.AndroidImportance.MAX;
  const groupId = 'main';
  const vibrations = {
    'short': [0, 250, 250, 250, 250],
    'medium': [0, 500, 500, 500, 500, 500, 500],
    'long': [0, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600],
  };

  Notifications.setNotificationChannelGroupAsync(groupId, {name:'main'});

  for (const soundEnum of availableSounds) {
    const sound = soundEnum.value;
    Object.entries(vibrations).forEach(([vibration, pattern]) => {
      const channel = `${sound}-${vibration}`;
      Notifications.setNotificationChannelAsync(channel, {
        name: channel,
        groupId,
        importance,
        sound: sound + '.mp3',
        vibrationPattern: pattern,
      });

      Notifications.setNotificationChannelAsync(channel + '-alarm', {
        name: channel + ' - Alarm',
        importance,
        groupId,
        sound: sound + '.mp3',
        vibrationPattern: pattern,
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
        },
      });
    });
  }
}


const displayNotification = async (remoteMessage) => {
  const channel: string = remoteMessage.data?.channel ?? 'default';
  const critical = await getCriticalForChannel(channel);
  const ios_critical = critical ? {
    critical: true,
    criticalVolume: await getCriticalAlertsVolume(),
  } : {};
  const sound = await getSoundForChannel(channel) ?? 'default';
  const vibration = vibrationForChannel[channel] ?? "short";
  const android_channel = `${sound}-${vibration}` + (critical ? '-alarm' : '');
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
      sound: sound + '.mp3',
      interruptionLevel: 'timeSensitive',
      ...(ios_critical)
    }
  });
}

export const testDisplayNotification = async (channel:string = "callout") => {
  //storeSoundForChannel(channel, "radio_alert-standard");
  const remoteMessage = {
    data: {
      title: channel,
      body: 'test message',
      channel,
      //critical: false
    }
  }
  displayNotification(remoteMessage);
}

export const restoreNotificationDefaults = async () => {
  storeSoundForChannel('callout', 'yucatan_6_times');
  storeCriticalForChannel('callout', true);
  storeSoundForChannel('callout-resolved', 'trumpets_1_time');
  storeCriticalForChannel('callout-resolved', true);
  storeSoundForChannel('log', 'sweet_1_time');
  storeCriticalForChannel('log', true);
  storeSoundForChannel('announcement', 'sweet_1_time');
  storeCriticalForChannel('announcement', true);
  storeCriticalAlertsVolume(1.0);
}

export const checkNotificationDefaults = async () => {
  if (
    (await getSoundForChannel("callout")) == null ||
    (await getSoundForChannel("callout-resolved")) == null ||
    (await getSoundForChannel("log")) == null ||
    (await getSoundForChannel("announcement")) == null
  ) {
    restoreNotificationDefaults();
  }
}

export const setupPushNotifications = (onReceive) => {
  console.log('setupPush');
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
    displayNotification(remoteMessage);
    onReceive(remoteMessage);
  });
}



export const usePushNotifications = (onPress, onReceive) => {
  const notifeeOnEvent = async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    switch (type) {
      case EventType.DISMISSED:
        console.log("User dismissed notification", notification);
        break;
      case EventType.PRESS:
        console.log("User pressed notification", notification);
        await onPress(notification);
        break;
    }
  };

  async function bootstrap() {
    const initialNotification = await notifee.getInitialNotification();
  
    if (initialNotification) {
      console.log('Notification caused application to open', initialNotification.notification);
      console.log('Press action used to open the app', initialNotification.pressAction);
      await onPress(initialNotification.notification);
    }
  }

  useEffect(() => {
    const onMessageUnsubscribe = messaging().onMessage(
      async (remoteMessage) => {
        console.log("onMessage", remoteMessage);
        displayNotification(remoteMessage);
        onReceive(remoteMessage);
      }
    );

    const onNotificationOpenedAppUnsubscribe =
      messaging().onNotificationOpenedApp(async (remoteMessage) => {
        console.log("onNotificationOpenedApp", remoteMessage);
        await onPress(remoteMessage);
      });

    const notifeeOnForegroundUnsubscribe =
      notifee.onForegroundEvent(notifeeOnEvent);
    notifee.onBackgroundEvent(notifeeOnEvent);

    bootstrap();

    if (Platform.OS === "android") {
      setupChannels();
    }

    return () => {
      onMessageUnsubscribe();
      onNotificationOpenedAppUnsubscribe();
      notifeeOnForegroundUnsubscribe();
    };
  }, []);
};
