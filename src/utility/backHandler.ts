import { router } from 'expo-router';
import { useEffect } from 'react';
import { Alert, BackHandler } from 'react-native';

function showChangeAlert() {
  Alert.alert(
    'Data Changed',
    'Going back without saving will lose this change. Do you want to proceed?',
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => {
          router.back();
        },
      },
    ],
    { cancelable: false },
  );
}

export function handleBackPressed(pendingChanges: boolean): boolean {
  if (pendingChanges) {
    showChangeAlert();
    return true;
  }
  else {
    router.back();
  }
  return true; // Handled here, don't pass back to system.
}

export function useBackHandler(pendingChanges: boolean) {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => handleBackPressed(pendingChanges),
    );
    return () => backHandler.remove();
  }, [pendingChanges]);
}
