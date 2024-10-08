import React from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { elements } from '@styles/elements';
import colors from '@styles/colors';
import type { ReactFormApi } from '@tanstack/react-form';
import type { DeepKeyValueName } from '@/utility/reactForm';

interface FormTextAreaProps<
// eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
> extends TextInputProps {
  form: ReactFormApi<TFormData, any>;
  name: TName;
  title?: string;
  placeholder: string;
  value?: string;
  height: number;
};

function FormTextArea<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, string>,
>({ form, name, title, placeholder, value, height, ...inputProps }: FormTextAreaProps<TFormData, TName>) {
  return (
    <form.Field<any, any, any>
      name={name}
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
        return (
          <View style={styles.container}>
            {!!title
            && <Text style={elements.fieldTitle}>{title}</Text>}
            <View style={[elements.inputContainer, { height }]}>
              <TextInput
                style={[elements.fieldText, { flex: 1, padding: 8, backgroundColor: '#ff000000' }]}
                onChangeText={field.handleChange}
                value={field.state.value}
                multiline
                placeholder={placeholder}
                placeholderTextColor={colors.grayText}
                {...inputProps}
              />
            </View>
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
});

export default FormTextArea;
