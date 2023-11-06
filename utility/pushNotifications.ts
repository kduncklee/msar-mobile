import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { apiSetDeviceId } from '../remote/api';

class PushNotifications {
    private pushToken: string = null;

    async registerForPushNotificationsAsync() {
        let token;
      
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
      
        if (Device.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
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

}

const pushNotifications = new PushNotifications();
export default pushNotifications;