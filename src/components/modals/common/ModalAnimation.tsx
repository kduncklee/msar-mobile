import React, { useEffect } from 'react';
import {
  BackHandler,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '@styles/colors';

interface ModalAnimationProps {
  children: React.ReactElement;
  modalVisible: boolean;
  tray?: boolean;
  onCancel: () => void;
}

const TRANSLATE_Y_START = 1200;
const ANIMATION_DURATION = 500;

function ModalAnimation({
  children,
  modalVisible,
  tray = false,
  onCancel,
}: ModalAnimationProps) {
  const translateY = useSharedValue(TRANSLATE_Y_START);
  const opacity = useSharedValue(0);
  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (modalVisible) {
          onCancel();
        }
        return modalVisible;
      },
    );
    return () => backHandler.remove();
  }, [modalVisible, onCancel]);

  useEffect(() => {
    if (modalVisible) {
      showModal();
    }
    else {
      hideModal();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalVisible]);

  const showModal = () => {
    console.log('showModal');
    translateY.value = withSpring(0 - safeAreaInsets.bottom, {
      damping: 20,
      stiffness: 100,
    });
    opacity.value = withTiming(0.8, { duration: ANIMATION_DURATION });
  };

  const hideModal = () => {
    console.log('hideModal');
    translateY.value = withTiming(TRANSLATE_Y_START, { duration: ANIMATION_DURATION });
    opacity.value = withTiming(0, { duration: ANIMATION_DURATION });
  };

  const trayAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <>
      {tray
        ? (
            <Animated.View style={[styles.tray, trayAnimatedStyle]}>
              {children}
            </Animated.View>
          )
        : children}
      {!!modalVisible && (
        <Animated.View style={[styles.modalBackground, modalAnimatedStyle]}>
          <TouchableOpacity onPress={onCancel} style={{ flex: 1 }} />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  tray: {
    zIndex: 100,
    margin: 0,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
  },
});

export default ModalAnimation;
