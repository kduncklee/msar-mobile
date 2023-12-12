import { useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { apiRemoveDeviceId, apiSetDeviceId } from '../remote/api';

class PushNotifications {
  private pushToken: string = null;

  //iOS critical alerts: https://stackoverflow.com/questions/69358515/how-to-make-critical-alerts-in-ios-with-expo-sdk-42-managed
  async registerForPushNotificationsAsync() {

    if (!Device.isDevice) {
      return;
    }

    let token;

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      Notifications.setNotificationChannelAsync('callout', {
        name: 'New Callout',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600],
        lightColor: '#FF231F7C',
      });
      Notifications.setNotificationChannelAsync('callout-alarm', {
        name: 'New Callout - Alarm channel',
        audioAttributes: {
          usage: Notifications.AndroidAudioUsage.ALARM,
        },
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600, 200, 200, 600, 600],
        lightColor: '#FF231F7C',
      });
      Notifications.setNotificationChannelAsync('callout-resolved', {
        name: 'Callout Resolved',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 500, 500],
        lightColor: '#FF231F7C',
      });
      Notifications.setNotificationChannelAsync('log', {
        name: 'Log Updates',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
      Notifications.setNotificationChannelAsync('announcement', {
        name: 'Announcements',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        //const { status } = await Notifications.requestPermissionsAsync();
        const { status } = await Notifications.requestPermissionsAsync({
          android: {},
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
            allowAnnouncements: true,
            allowCriticalAlerts: true
          }
        });
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      console.log(Constants.expoConfig.extra.eas.projectId);
      console.log(token);
      await this.sendPushToken(token.data);
      this.pushToken = token;
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token.data;
  }

  async sendPushToken(token: string) {
    const response: any = await apiSetDeviceId(token);
  }

  async removePushToken() {
    let token = await this.getToken();
    if (token != null) {
      const response: any = await apiRemoveDeviceId(token);
    }
  }

  async getToken() {
    let token: string = null;
    if (Device.isDevice) {
      let tokenObject = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });

      if (tokenObject.data) {
        token = tokenObject.data;
      }
    }

    return token;
  }

}

const pushNotifications = new PushNotifications();
export default pushNotifications;
