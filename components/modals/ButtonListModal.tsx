import React, { useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../styles/colors";
import { elements } from "../../styles/elements";
import LargeButton from "../inputs/LargeButton";

type ButtonListModalProps = {
  buttons: {
    title: string;
    value: any;
    backgroundColor: string;
    textColor: string;
  }[];
  title: string;
  modalVisible: boolean;
  onSelect: (value: any) => void;
  onCancel: () => void;
};

const TRANSLATE_Y_START = 1200;
const ANIMATION_DURATION = 500;

const ButtonListModal = ({
  buttons,
  title,
  modalVisible,
  onSelect,
  onCancel,
}: ButtonListModalProps) => {
  const translateY = useSharedValue(TRANSLATE_Y_START);
  const opacity = useSharedValue(0);
  const safeAreaInsets = useSafeAreaInsets();

  useEffect(() => {
    if (modalVisible) {
      showModal();
    } else {
      hideModal();
    }
  }, [modalVisible]);

  const showModal = () => {
    console.log("showModal");
    translateY.value = withSpring(0 - safeAreaInsets.bottom, {
      damping: 20,
      stiffness: 100,
    });
    opacity.value = withTiming(0.8, { duration: ANIMATION_DURATION });
  };

  const hideModal = () => {
    console.log("hideModal");
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
      <Animated.View style={[styles.respondTray, trayAnimatedStyle]}>
        <View style={{ flex: 1 }} />
        <View style={styles.container}>
          <Text style={[elements.mediumText, { margin: 8, fontWeight: "500" }]}>
            {title}
          </Text>
          <FlatList
            style={{ borderRadius: 20 }}
            data={buttons}
            renderItem={({ item }) => (
              <LargeButton
                title={item.title}
                backgroundColor={item.backgroundColor}
                textColor={item.textColor}
                onPress={() => onSelect(item.value)}
              />
            )}
            ListFooterComponent={
              <>
                <View style={{ height: 40 }} />
                <LargeButton
                  title={"Cancel"}
                  backgroundColor={colors.secondaryBg}
                  textColor={colors.grayText}
                  onPress={onCancel}
                />
              </>
            }
          />
        </View>
      </Animated.View>
      {!!modalVisible && (
        <Animated.View style={[styles.modalBackground, modalAnimatedStyle]}>
          <TouchableOpacity onPress={onCancel} style={{ flex: 1 }} />
        </Animated.View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  respondTray: {
    zIndex: 100,
    margin: 0,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.black,
  },
  container: {
    borderRadius: 20,
    borderColor: colors.grayText,
    borderWidth: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: colors.primaryBg,
  },
});

export default ButtonListModal;
