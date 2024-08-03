import messaging from '@react-native-firebase/messaging';
import type { Api } from '@/remote/api';

export async function getToken() {
  return messaging().getToken();
}

export async function sendPushToken(api: Api, active: boolean = true) {
  const token = await getToken();
  await api.apiSetDeviceId(token, active);
}

export async function checkPushToken(api: Api): Promise<boolean> {
  return getToken().then(token => api.apiIsDeviceIdActive(token));
}

export async function removePushToken(api: Api) {
  const token = await getToken();
  if (token != null) {
    return api.apiRemoveDeviceId(token);
  }
}
