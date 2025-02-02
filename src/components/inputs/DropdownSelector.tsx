import React from 'react';
import type { ImageRequireSource } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { elements } from '@styles/elements';
import colors from '@styles/colors';

export interface DropdownSelectorCommonProps {
  title?: string;
  options: any[];
  placeholder: string;
  rightButton?: ImageRequireSource;
  onRightPress?: (value: any) => void;
};

interface DropdownSelectorProps extends DropdownSelectorCommonProps {
  selectedValue: any;
  onSelect: (values: any) => void;
};

function DropdownSelector({ title, options, placeholder, selectedValue, rightButton, onRightPress, onSelect }: DropdownSelectorProps) {
  return (
    <View style={styles.container}>
      {!!title
      && <Text style={elements.fieldTitle}>{title}</Text>}
      <View style={elements.inputContainer}>
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={elements.fieldPlaceholder}
          selectedTextStyle={elements.fieldText}
          iconStyle={styles.iconStyle}
          data={options}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          value={selectedValue}
          containerStyle={{ overflow: 'hidden', borderRadius: 8, borderColor: colors.grayText, borderWidth: 1, backgroundColor: colors.secondaryBg }}
          itemContainerStyle={{ backgroundColor: colors.primaryBg }}
          activeColor={colors.selectionBg}
          itemTextStyle={{ color: colors.primaryText }}
          onChange={onSelect}
          testID={title}
        />
        {onRightPress
        && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onRightPress}
          >
            {rightButton
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
