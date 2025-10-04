import type { ReturnKeyType, TextInputProps } from 'react-native';
import type { IconName } from '@/utility/icon';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { useStore } from '@tanstack/react-form';
import React from 'react';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFieldContext } from '@/hooks/formContext';

interface FormTextInputProps extends TextInputProps {
  title?: string;
  icon?: IconName;
  placeholder?: string;
  rightButton?: IconName;
  returnKey?: ReturnKeyType;
  onSubmit?: () => void;
  onRightPress?: (value: any) => void;
};

function FormTextInput({ title, placeholder, icon, rightButton, onRightPress, returnKey, onSubmit, ...inputProps }: FormTextInputProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, state => state.meta.errors);

  const handleDoneButtonPress = () => {
    Keyboard.dismiss();
    if (onSubmit != null) {
      onSubmit();
    }
  };

  let returnKeyType: ReturnKeyType = 'done';
  if (returnKey != null) {
    returnKeyType = returnKey;
  }

  return (
    <View style={styles.container}>
      {!!title
        && <Text style={elements.fieldTitle} testID={`${title}-label`}>{title}</Text>}
      <View style={[elements.inputContainer, { height: 50 }]}>
        {!!icon && (
          <View style={elements.fieldIcon}><MaterialCommunityIcons name={icon} size={22} color="white" /></View>
        )}
        <TextInput
          style={[elements.fieldText, { flex: 1, padding: 8 }]}
          onChangeText={field.handleChange}
          value={field.state.value}
          returnKeyType={returnKeyType}
          onSubmitEditing={handleDoneButtonPress}
          placeholder={placeholder ?? title}
          placeholderTextColor={colors.grayText}
          autoCorrect
          autoCapitalize="sentences"
          {...inputProps}
        />
        {onRightPress
          && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onRightPress}
            >
              {rightButton
                && <View style={elements.fieldIcon}><MaterialCommunityIcons name={rightButton} size={22} color="white" testID={`${title}-button`} /></View>}
            </TouchableOpacity>
          )}
      </View>
      {errors.length
        ? (
            <Text style={elements.smallYellowText}>{errors.join(', ')}</Text>
          )
        : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column',
  },
});

export default FormTextInput;
