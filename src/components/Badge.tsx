import type {
  StyleProp,
  ViewStyle,
} from 'react-native';

import colors from '@styles/colors';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.red,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10,
    minWidth: 20,
  },
  text: {
    paddingVertical: 2,
    paddingHorizontal: 4,
    color: '#fff',
    fontFamily: '.HelveticaNeueInterface-MediumP4',
    backgroundColor: 'transparent',
    fontSize: 14,
    textAlign: 'center', // for android
    textAlignVertical: 'center', // for android
  },
});

interface BadgeProps {
  style: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

function Badge({ style, children }: BadgeProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

export default Badge;
