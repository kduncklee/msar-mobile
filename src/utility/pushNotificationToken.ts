import messaging from '@react-native-firebase/messaging';
import type { Api } from '@/remote/api';

async function getPushToken() {
  return messaging().getToken();
}

export async function updatePushToken(api: Api) {
  const token = await getPushToken();
  if (token) {
    console.log('registered', token);
    api.apiUpdateDeviceId(token);
  }
  else {
    // eslint-disable-next-line no-alert
    alert('Failed to get push token');
  }
}

export async function sendPushToken(api: Api, active: boolean = true) {
  const token = await getPushToken();
  await api.apiSetDeviceId(token, active);
}

export async function checkPushToken(api: Api): Promise<boolean> {
  return getPushToken().then(token => api.apiIsDeviceIdActive(token));
}

export async function removePushToken(api: Api) {
  const token = await getPushToken();
  if (token != null) {
    return api.apiRemoveDeviceId(token);
  }
}
