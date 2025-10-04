import type { TextInputProps } from 'react-native';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { useStore } from '@tanstack/react-form';
import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { useFieldContext } from '@/hooks/formContext';

interface FormTextAreaProps extends TextInputProps {
  title?: string;
  placeholder: string;
  value?: string;
  height: number;
};

function FormTextArea({ title, placeholder, value, height, ...inputProps }: FormTextAreaProps) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, state => state.meta.errors);
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
    paddingTop: 20,
  },
});

export default FormTextArea;
