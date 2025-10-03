import type { ReactFormApi } from '@tanstack/react-form';
import type { TextInputProps } from 'react-native';
import type { DeepKeyValueName } from '@/utility/reactForm';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

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
    paddingTop: 20,
  },
});

export default FormTextArea;
