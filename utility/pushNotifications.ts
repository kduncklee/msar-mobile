import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import * as Sentry from "@sentry/react-native";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { apiRemoveDeviceId, apiSetDeviceId } from '../remote/api';
import { getCriticalAlertsEnabled } from '../storage/storage';



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

export const sendPushToken = async (token: string, critical?: boolean) => {
  const response: any = await apiSetDeviceId(token, critical);
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
  const standardPattern = [250, 250, 250, 250];
  const resolvedPattern = [5000, 500, 500, 500];
  const calloutPattern = [200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600];
  const importance = AndroidImportance.DEFAULT;
  const sound = 'default';

  await notifee.createChannels([
    {
      id: "default",
      name: "default",
      vibrationPattern: standardPattern,
      sound,
      importance,
    },
    {
      id: "callout",
      name: "New Callout",
      vibrationPattern: calloutPattern,
      sound,
      importance,
    },
    {
      id: "callout-critical",
      name: "New Callout - critical",
      bypassDnd: true,  // Doesn't seem to work
      vibrationPattern: calloutPattern,
      sound,
      importance,
    },
    {
      id: "callout-resolved",
      name: "Callout Resolved",
      vibrationPattern: resolvedPattern,
      sound,
      importance,
    },
    {
      id: "log",
      name: "Log Updates",
      vibrationPattern: standardPattern,
      sound,
      importance,
    },
    {
      id: "announcement",
      name: "Announcements",
      vibrationPattern: standardPattern,
      sound,
      importance,
    },
  ]);
  
  // Notifee can't set the alarm channel. Use this instead.
  Notifications.setNotificationChannelAsync('callout-alarm2', {
    name: 'New Callout - Critical Alarm',
    audioAttributes: {
      usage: Notifications.AndroidAudioUsage.ALARM,
    },
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600],
  });
}


const displayNotification = async (remoteMessage) => {
  const critical = !!remoteMessage.data?.critical && await getCriticalAlertsEnabled();
  const ios_critical = critical ? {
    critical: true,
    criticalVolume: 1.0,
  } : {};
  var channel: string;
  if (remoteMessage.data?.channel) {
    channel = remoteMessage.data?.channel + (critical ? '-alarm2' : '');
  } else {
    channel = 'default';
  }
  console.log('display', remoteMessage.data?.body, critical, ios_critical, channel);
  notifee.displayNotification({
    title: remoteMessage.data?.title,
    body: remoteMessage.data?.body,
    data: remoteMessage.data,
    android: {
      channelId: channel,
      pressAction: { id: 'default' },
      sound: 'default',
    },
    ios: {
      sound: 'default',
      ...(ios_critical)
    }
  });
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

    setupChannels();

    return () => {
      onMessageUnsubscribe();
      onNotificationOpenedAppUnsubscribe();
      notifeeOnForegroundUnsubscribe();
    };
  }, []);
};
