import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'

type DropdownSelectorProps = {
    title?: string,
    options: any[],
    placeholder: string,
    onSelect: (values: any) => void
}

const DropdownSelector = ({ title, options, placeholder, onSelect }: DropdownSelectorProps) => {

    const [value, setValue] = useState(null);

    return (
        <View style={styles.container}>
            {title &&
                <Text style={elements.fieldTitle}>{title}</Text>
            }
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
                    value={value}
                    containerStyle={{ overflow: "hidden", borderRadius: 8, borderColor: colors.grayText, borderWidth: 1, backgroundColor: colors.secondaryBg }}
                    itemContainerStyle={{ backgroundColor: colors.primaryBg }}
                    activeColor={colors.secondaryBg}
                    itemTextStyle={{ color: colors.primaryText }}
                    onChange={item => {
                        setValue(item.value);
                        onSelect(item);
                    }} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flexDirection: "column"
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