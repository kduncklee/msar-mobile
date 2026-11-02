import type { TextInputProps } from 'react-native';
import type { IconName } from '@/utility/icon';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import React from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  title?: string;
  icon?: IconName;
  placeholder?: string;
  rightButton?: IconName;
  onRightPress?: () => void;
  onSubmit?: () => void;
}

export function CustomTextInput({
  title,
  placeholder,
  icon,
  rightButton,
  onRightPress,
  onSubmit,
  style,
  ...inputProps
}: CustomTextInputProps) {
  const handleDone = () => {
    Keyboard.dismiss();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <View style={styles.container}>
      {!!title && <Text style={elements.fieldTitle}>{title}</Text>}
      <View style={[elements.inputContainer, { height: 50 }]}>
        {!!icon && (
          <View style={elements.fieldIcon}>
            <MaterialCommunityIcons name={icon} size={22} color="white" />
          </View>
        )}
        <TextInput
          style={[elements.fieldText, { flex: 1, padding: 8 }, style]}
          returnKeyType="done"
          onSubmitEditing={handleDone}
          placeholder={placeholder ?? title}
          placeholderTextColor={colors.grayText}
          autoCorrect
          autoCapitalize="sentences"
          {...inputProps}
        />
        {!!onRightPress && !!rightButton && (
          <TouchableOpacity activeOpacity={0.8} onPress={onRightPress}>
            <View style={elements.fieldIcon}>
              <MaterialCommunityIcons name={rightButton} size={22} color="white" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
    flexDirection: 'column',
  },
});
