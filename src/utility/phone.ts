import { Linking } from 'react-native';

export function makePhoneCall(phoneNumber: string) {
  const phoneNumberWithPrefix = `tel:${phoneNumber}`;
  Linking.openURL(phoneNumberWithPrefix).catch(err => console.error('An error occurred with phone URL ', err));
}

export function sendText(phoneNumber: string) {
  const phoneNumberWithPrefix = `sms:${phoneNumber}`;
  Linking.openURL(phoneNumberWithPrefix).catch(err => console.error('An error occurred with sms URL ', err));
}
