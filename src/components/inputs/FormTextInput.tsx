import React from 'react';
import type { ReturnKeyType, TextInputProps } from 'react-native';
import { Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';
import colors from '@styles/colors';
import type { ReactFormApi } from '@tanstack/react-form';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { DeepKeyValueName } from '@/utility/reactForm';
import type { IconName } from '@/utility/icon';

interface FormTextInputProps<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
> extends TextInputProps {
  form: ReactFormApi<TFormData, any>;
  name: TName;
  title?: string;
  icon?: IconName;
  placeholder?: string;
  rightButton?: IconName;
  returnKey?: ReturnKeyType;
  onSubmit?: () => void;
  onRightPress?: (value: any) => void;
};

function FormTextInput<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
>({ form, name, title, placeholder, icon, rightButton, onRightPress, returnKey, onSubmit, ...inputProps }: FormTextInputProps<TFormData, TName>) {
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
    <form.Field<any, any, any>
      name={name}
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
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
            {field.state.meta.errors.length
              ? (
                  <Text style={elements.smallYellowText}>{field.state.meta.errors.join(', ')}</Text>
                )
              : null}
          </View>
        );
      }}
    />
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
