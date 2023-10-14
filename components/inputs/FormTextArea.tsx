import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, ImageRequireSource, Image, TouchableOpacity } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'

type FormTextAreaProps = {
    title?: string,
    placeholder: string,
    value?: string,
    height: number,
    onChange: (text: string) => void
}

const FormTextArea = ({title, placeholder, value, height, onChange}: FormTextAreaProps) => {

    const [text, setText] = useState(value);

    const textChanged = (text: string) => {
        setText(text);
        onChange(text);
    }

    return (
        <View style={styles.container}>
            {title &&
                <Text style={elements.fieldTitle}>{title}</Text>
            }
            <View style={[elements.inputContainer, {height: height}]}>
                <TextInput
                    style={[elements.fieldText, {flex: 1, padding: 8, backgroundColor: "#ff000000"}]}
                    multiline={true}
                    onChangeText={textChanged}
                    value={text}
                    placeholder={placeholder}
                    placeholderTextColor={colors.grayText} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20
    }
});

export default FormTextArea;
