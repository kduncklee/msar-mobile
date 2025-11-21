import type { IconName } from '@/utility/icon';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { getConditionalTimeString } from '@utility/dateHelper';
import { router, useFocusEffect } from 'expo-router';
import React from 'react';
import { BackHandler, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  background?: any;
  backButton?: boolean;
  onBackPressed?: () => void;
  rightButtonIcon?: IconName;
  onRightPressed?: () => void;
  timestamp?: Date;
};

function Header({ title, background, backButton = false, onBackPressed, rightButtonIcon, onRightPressed, timestamp = undefined }: HeaderProps) {
  useFocusEffect(() => {
    // console.log('added back handler: ' + pathname)
    // eslint-disable-next-line react-web-api/no-leaked-event-listener
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => backHandler.remove();
  });

  const handleBackButton = () => {
    // Prevent default behavior of the back button
    return !backButton;
  };

  const backPressed = () => {
    if (onBackPressed) {
      onBackPressed();
    }
    else {
      router.back();
    }
  };

  const viewStyle = background ? { backgroundColor: background } : {};

  return (
    <View style={[styles.container, viewStyle]}>
      {backButton
        && (
          <TouchableOpacity activeOpacity={0.2} style={styles.backContainer} onPress={() => backPressed()}>
            <Image source={require('@assets/icons/back.png')} style={styles.backImage} testID="backButton" />
          </TouchableOpacity>
        )}
      <Text
        style={[styles.title, { paddingHorizontal: backButton ? 10 : 20 }]}
        numberOfLines={1}
        testID="header-title"
      >
        {title}
      </Text>
      {timestamp != null && (
        <View style={[elements.capsule, { marginRight: 20 }]}>
          <Text style={elements.smallYellowText} testID="header-timestamp">{getConditionalTimeString(timestamp)}</Text>
        </View>
      )}
      {rightButtonIcon
        && (
          <TouchableOpacity activeOpacity={0.2} style={styles.rightContainer} onPress={onRightPressed}>
            <View style={elements.fieldIcon}><MaterialCommunityIcons name={rightButtonIcon} size={22} color="white" /></View>
          </TouchableOpacity>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: '500',
    color: colors.primaryText,
  },
  backContainer: {
    width: 30,
    height: 30,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    height: 30,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default Header;
