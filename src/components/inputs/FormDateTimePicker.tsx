import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';
import type { ReactFormApi } from '@tanstack/react-form';
import type { DateTimePickerProps } from 'react-native-modal-datetime-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { fromDateId } from '@marceloterreiro/flash-calendar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { DeepKeyValueName } from '@/utility/reactForm';
import { getFullDateTimeString, getTimeString } from '@/utility/dateHelper';

interface FormDateTimePickerProps<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, Date>,
> extends Omit<DateTimePickerProps, 'onCancel' | 'onConfirm'> {
  form: ReactFormApi<TFormData, any>;
  name: TName;
  title?: string;
  dateId: string;
  mode: 'time' | 'date' | 'datetime';
};

function FormDateTimePicker<
  // eslint-disable-next-line ts/no-unnecessary-type-constraint
  TFormData extends unknown,
  TName extends DeepKeyValueName<TFormData, Date>,
>({ form, name, title, dateId, mode, ...inputProps }: FormDateTimePickerProps<TFormData, TName>) {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  return (
    <form.Field<any, any, any>
      name={name}
      // eslint-disable-next-line react/no-children-prop
      children={(field) => {
        const date: Date = field.state.value;
        let display = 'UNSET';
        if (date) {
          display = (mode === 'time') ? getTimeString(date) : getFullDateTimeString(date);
        }

        return (
          <View style={styles.container}>
            {!!title
            && <Text style={elements.fieldTitle} testID={`${title}-label`}>{title}</Text>}
            <View style={[elements.inputContainer, { height: 50 }]}>
              <TextInput
                style={[elements.fieldText, { flex: 1, padding: 8 }]}
                value={display}
                editable={false}
              />
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={showDatePicker}
              >
                <View style={elements.fieldIcon}><MaterialCommunityIcons name="clock-outline" size={22} color="white" /></View>
              </TouchableOpacity>

            </View>
            {field.state.meta.errors.length
              ? (
                  <Text style={elements.smallYellowText}>{field.state.meta.errors.join(', ')}</Text>
                )
              : null}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode={mode}
              date={date ?? fromDateId(dateId)}
              onConfirm={(date) => {
                console.log('DateTimePickerModal', name, getTimeString(date));
                field.handleChange(date);
                hideDatePicker();
              }}
              onCancel={hideDatePicker}
              {...inputProps}
            />
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

export default FormDateTimePicker;
