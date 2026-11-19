import { useEffect } from 'react';
import { StatusBar } from 'react-native';

export default function useStatusBarColor(): void {
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);
}
