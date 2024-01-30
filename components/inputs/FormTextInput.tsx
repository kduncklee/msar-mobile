import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageRequireSource, Image, TouchableOpacity, Keyboard, ReturnKeyType } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'

type FormTextInputProps = {
    title?: string,
    icon?: ImageRequireSource
    placeholder: string,
    value?: string,
    error?: any,
    rightButton?: ImageRequireSource,
    secure?: boolean,
    returnKey?: ReturnKeyType,
    autoCorrect?: boolean,
    onSubmit?: () => void,
    onRightPress?: (value: any) => void,
    onBlur?: (e: any) => void,
    onChange: (text: string) => void
}

const FormTextInput = ({ title, placeholder, value, error, icon, rightButton, onRightPress, onBlur, onChange, secure=false, returnKey, onSubmit, autoCorrect=true }: FormTextInputProps) => {

    const handleDoneButtonPress = () => {
        Keyboard.dismiss();
        if (onSubmit != null) {
            onSubmit();
        }
    };

    var returnKeyType: ReturnKeyType = 'done'
    if (returnKey != null) {
        returnKeyType = returnKey
    }

    return (
        <View style={styles.container}>
            {!!title &&
                <Text style={elements.fieldTitle}>{title}</Text>
            }
            {!!error?.message &&
                    <Text style={elements.smallYellowText}>{ error.message }</Text>}
            <View style={[elements.inputContainer, { height: 50 }]}>
                {!!icon &&
                    <Image source={icon} style={elements.fieldImage} />
                }
                <TextInput
                    style={[elements.fieldText, { flex: 1, padding: 8 }]}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={handleDoneButtonPress}
                    placeholder={placeholder}
                    placeholderTextColor={colors.grayText}
                    secureTextEntry={secure}
                    autoCorrect={autoCorrect} />
                {onRightPress &&
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={onRightPress}>
                        {rightButton &&
                            <Image source={rightButton} style={elements.fieldImage} />
                        }
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        flexDirection: "column"
    }
});

export default FormTextInput;
