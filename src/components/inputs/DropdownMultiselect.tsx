import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { elements } from '@styles/elements';
import colors from '@styles/colors';
import type { LabelValue } from '@/utility/reactForm';

export interface DropdownMultiselectCommonProps<
  TOption extends LabelValue,
> {
  title?: string;
  options: TOption[];
  placeholder: string;
};

interface DropdownMultiselectProps<
  TOption extends LabelValue,
> extends DropdownMultiselectCommonProps<TOption> {
  selectedValues?: string[];
  onSelect: (values: any) => void;
};

function DropdownMultiselect<
  TOption extends LabelValue,
>({ title, options, placeholder, selectedValues, onSelect }: DropdownMultiselectProps<TOption>) {
  return (
    <View style={styles.container}>
      {!!title
      && <Text style={elements.fieldTitle}>{title}</Text>}
      <View style={[elements.inputContainer, { flexDirection: 'column', paddingHorizontal: 8 }]}>
        <MultiSelect
          style={[styles.dropdown]}
          placeholderStyle={elements.fieldPlaceholder}
          selectedTextStyle={elements.fieldText}
          iconStyle={styles.iconStyle}
          data={options}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={selectedValues}
          containerStyle={{ overflow: 'hidden', borderRadius: 8, borderColor: colors.grayText, borderWidth: 1, backgroundColor: colors.secondaryBg }}
          itemContainerStyle={{ backgroundColor: colors.primaryBg }}
          activeColor={colors.selectionBg}
          itemTextStyle={{ color: colors.primaryText }}
          selectedStyle={styles.selectedStyle}
          onChange={(item) => {
            onSelect(item);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexDirection: 'column',
  },
  dropdown: {
    flex: 1,
    height: 'auto',
    paddingHorizontal: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  selectedStyle: {
    borderRadius: 16,
  },
});

export default DropdownMultiselect;
