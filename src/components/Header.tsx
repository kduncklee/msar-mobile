import React, { useEffect, useState } from 'react';
import { BackHandler, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { getConditionalTimeString } from '@utility/dateHelper';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { IconName } from '@/utility/icon';

interface HeaderProps {
  title: string;
  zeroTopMargin?: boolean;
  background?: any;
  backButton?: boolean;
  onBackPressed?: () => void;
  rightButtonIcon?: IconName;
  onRightPressed?: () => void;
  timestamp?: Date;
};

function Header({ title, zeroTopMargin, background, backButton = false, onBackPressed, rightButtonIcon, onRightPressed, timestamp = null }: HeaderProps) {
  const [headerMargin, setHeaderMargin] = useState(0);

  useEffect(() => {
    if (zeroTopMargin || (Platform.OS === 'ios')) {
      setHeaderMargin(0);
    }
    else if (Platform.OS === 'android') {
      setHeaderMargin(StatusBar.currentHeight);
    }
  }, [zeroTopMargin]);

  useFocusEffect(() => {
    // console.log('added back handler: ' + pathname)
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    return () => {
      // console.log('removed back handler: ' + pathname);
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
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
    <View style={[styles.container, { marginTop: headerMargin }, viewStyle]}>
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
