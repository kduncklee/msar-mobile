import type { DateTimePickerProps } from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { fromDateId } from '@marceloterreiro/flash-calendar';
import { elements } from '@styles/elements';
import { useStore } from '@tanstack/react-form';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useFieldContext } from '@/hooks/formContext';
import { getFullDateTimeString, getTimeString } from '@/utility/dateHelper';

interface FormDateTimePickerProps extends Omit<DateTimePickerProps, 'onCancel' | 'onConfirm'> {
  title?: string;
  dateId: string;
  mode: 'time' | 'date' | 'datetime';
};

function FormDateTimePicker({ title, dateId, mode, ...inputProps }: FormDateTimePickerProps) {
  const field = useFieldContext<Date>();
  const errors = useStore(field.store, state => state.meta.errors);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

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
      {errors.length
        ? (
            <Text style={elements.smallYellowText}>{errors.join(', ')}</Text>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'column',
  },
});

export default FormDateTimePicker;
