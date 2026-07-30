import type { IMultiSelectRef } from '@carlos3g/element-dropdown';
import type { LabelValue } from '@/utility/reactForm';
import { MultiSelect } from '@carlos3g/element-dropdown';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import React, { useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { emptyComponent } from '@/components/inputs/DropdownCommon';

export interface DropdownMultiselectCommonProps<
  TOption extends LabelValue,
> {
  title?: string;
  options: TOption[];
  placeholder: string;
  search?: boolean;
  addItemText?: string;
};

interface DropdownMultiselectProps<
  TOption extends LabelValue,
> extends DropdownMultiselectCommonProps<TOption> {
  selectedValues: string[];
  onSelect: (values: any) => void;
};

function DropdownMultiselect<
  TOption extends LabelValue,
>({ title, options, placeholder, search, addItemText, selectedValues, onSelect }: DropdownMultiselectProps<TOption>) {
  const ref = useRef<IMultiSelectRef>(null);
  return (
    <View style={styles.container}>
      {!!title
        && <Text style={elements.fieldTitle}>{title}</Text>}
      <View style={[elements.inputContainer, { flexDirection: 'column', paddingHorizontal: 8 }]}>
        <MultiSelect
          ref={ref as React.RefObject<IMultiSelectRef>}
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
          onChange={onSelect}
          search={search}
          renderEmpty={emptyComponent(addItemText, ref, (s: string) => onSelect([s, ...selectedValues]))}
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
    width: '100%',
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
