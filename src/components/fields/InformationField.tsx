import React from 'react';
import type { ImageRequireSource } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '@styles/colors';

interface InformationFieldProps {
  title?: string;
  value: string;
  valueColor?: string;
  icon?: ImageRequireSource;
  onIconPress?: () => void;
  secondaryIcon?: ImageRequireSource;
  onSecondaryIconPress?: () => void;
};

function InformationField({ title, value, valueColor, icon, onIconPress, secondaryIcon, onSecondaryIconPress }: InformationFieldProps) {
  const textColor = valueColor || colors.secondaryYellow;

  return (
    <View style={styles.container}>
      {!!title
      && <Text style={styles.titleText}>{title}</Text>}
      <View style={styles.valueContainer}>
        {onSecondaryIconPress
        && (
          <TouchableOpacity activeOpacity={0.5} onPress={onSecondaryIconPress} style={styles.button}>
            {secondaryIcon
            && <Image source={secondaryIcon} style={styles.iconImage} />}
          </TouchableOpacity>
        )}
        {onIconPress
        && (
          <TouchableOpacity activeOpacity={0.5} onPress={onIconPress} style={styles.button}>
            {icon
            && <Image source={icon} style={styles.iconImage} />}
            <Text style={[styles.valueText, { color: textColor }]}>{value}</Text>
          </TouchableOpacity>
        )}
        {!onIconPress
        && (
          <Text
            style={[styles.valueText, { color: textColor }]}
            selectable
          >
            {value}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  titleText: {
    fontSize: 14,
    fontWeight: '300',
    color: colors.lightText,
  },
  valueContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  valueText: {
    fontSize: 16,
    textAlign: 'right',
    fontWeight: '400',
    color: colors.secondaryYellow,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
});

export default InformationField;
