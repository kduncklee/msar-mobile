import type { Api } from '@/remote/api';
import messaging from '@react-native-firebase/messaging';

async function getPushToken() {
  try {
    return await messaging().getToken();
  }
  catch (error: any) {
    console.log('[PUSH TOKEN] Firebase token unavailable:', error?.message ?? error);
    if (__DEV__) {
      return 'dev-dummy-push-token-12345';
    }
    return '';
  }
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
