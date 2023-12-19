import { Linking } from 'react-native';

export const makePhoneCall = (phoneNumber: string) => {
  const phoneNumberWithPrefix = `tel:${phoneNumber}`;
  Linking.openURL(phoneNumberWithPrefix).catch((err) => console.error('An error occurred with phone URL ', err));
}
