import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TextInput } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler';

type LogInputProps = {
    text: string,
    onTextChange: (text: string) => void,
    onSendPress: () => void,
    onPhotoPress: () => void
}

const LogInput = ({text, onSendPress, onPhotoPress, onTextChange}: LogInputProps) => {

    const [messageText,setMessageText] = useState('');

    const messageTextChanged = (text: string) => {
        setMessageText(text);
        onTextChange(text);
    }
    return (
        <View style={styles.container}>
            <TextInput
                defaultValue={text}
                multiline={true}
                onChangeText={messageTextChanged}
                style={styles.messageText}
                placeholder={'Message...'}
                placeholderTextColor={colors.grayText}/>
            <TouchableOpacity activeOpacity={0.5} style={[styles.button,{backgroundColor: colors.blue}]} onPress={onSendPress}>
                <Image source={require('../../assets/icons/send_white.png')} style={styles.buttonImage} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "auto",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        paddingHorizontal: 20,
        marginBottom: 10
    },
    messageText: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        flex: 1,
        color: colors.lightText,
        backgroundColor: colors.secondaryBg,
        marginBottom: 4
    },
    button: {
        marginLeft: 8,
        height: 36,
        width: 36,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonImage: {
        resizeMode: "contain",
        height: 30,
        width: 30
    }
});

export default LogInput;