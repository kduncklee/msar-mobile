import type { IDropdownRef } from '@carlos3g/element-dropdown';
import type { ImageRequireSource } from 'react-native';
import { Dropdown } from '@carlos3g/element-dropdown';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import React, { useRef } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { emptyComponent } from '@/components/inputs/DropdownCommon';

export interface DropdownSelectorCommonProps {
  title?: string;
  options: any[];
  placeholder: string;
  search?: boolean;
  addItemText?: string;
  rightButton?: ImageRequireSource;
  onRightPress?: (value: any) => void;
};

interface DropdownSelectorProps extends DropdownSelectorCommonProps {
  selectedValue: any;
  onSelect: (values: any) => void;
};

function DropdownSelector({ title, options, placeholder, search, addItemText, selectedValue, rightButton, onRightPress, onSelect }: DropdownSelectorProps) {
  const ref = useRef<IDropdownRef>(null);
  return (
    <View style={styles.container}>
      {!!title
        && <Text style={elements.fieldTitle}>{title}</Text>}
      <View style={elements.inputContainer}>
        <Dropdown
          ref={ref as React.RefObject<IDropdownRef>}
          style={[styles.dropdown]}
          placeholderStyle={elements.fieldPlaceholder}
          selectedTextStyle={elements.fieldText}
          iconStyle={styles.iconStyle}
          data={options}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={selectedValue?.toString()}
          containerStyle={{ overflow: 'hidden', borderRadius: 8, borderColor: colors.grayText, borderWidth: 1, backgroundColor: colors.secondaryBg }}
          itemContainerStyle={{ backgroundColor: colors.primaryBg }}
          activeColor={colors.selectionBg}
          itemTextStyle={{ color: colors.primaryText }}
          onChange={onSelect}
          testID={title}
          search={search}
          renderEmpty={emptyComponent(addItemText, ref, (s: string) => onSelect({ value: s }))}
        />
        {!!onRightPress
          && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onRightPress}
            >
              {!!rightButton
                && <Image source={rightButton} style={elements.fieldImage} />}
            </TouchableOpacity>
          )}
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
    height: 40,
    paddingHorizontal: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
});

export default DropdownSelector;
