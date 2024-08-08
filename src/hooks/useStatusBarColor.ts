import { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import colors from '@/styles/colors';

export default function useStatusBarColor(): void {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    }
    else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primaryBg);
    }
  }, []);
}
