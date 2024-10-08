import React from 'react';
import type { ImageRequireSource, ReturnKeyType, TextInputProps } from 'react-native';
import { Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';
import colors from '@styles/colors';
import type { ReactFormApi } from '@tanstack/react-form';
import type { DeepKeyValueName } from '@/utility/reactForm';

interface FormTextInputProps<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
> extends TextInputProps {
  form: ReactFormApi<TFormData, any>;
  name: TName;
  title?: string;
  icon?: ImageRequireSource;
  placeholder?: string;
  rightButton?: ImageRequireSource;
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
              {!!icon
              && <Image source={icon} style={elements.fieldImage} />}
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
                  && <Image source={rightButton} style={elements.fieldImage} testID={`${title}-button`} />}
                </TouchableOpacity>
              )}
            </View>
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
