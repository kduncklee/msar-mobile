import { Linking } from 'react-native';

export function makePhoneCall(phoneNumber: string) {
  const phoneNumberWithPrefix = `tel:${phoneNumber}`;
  Linking.openURL(phoneNumberWithPrefix).catch(err => console.error('An error occurred with phone URL ', err));
}
