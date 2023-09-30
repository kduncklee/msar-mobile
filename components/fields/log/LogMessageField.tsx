import React, { useState, } from 'react';
import { StyleSheet, View, Text, Image, ImageRequireSource } from 'react-native';
import { elements } from '../../../styles/elements';
import colors from '../../../styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { personnel, personnelToString } from '../../../types/personnel';
import { responseType } from '../../../types/enums';
import { colorForResponseType, textForResponseType } from '../../../types/calloutSummary';
import { message } from '../../../types/message';
import { getTimeString } from '../../../utility/dateHelper';

type LogMessageFieldProps = {
    message: message,
    timestamp: Date
}

const LogMessageField = ({ message, timestamp }: LogMessageFieldProps) => {

    return (
        <View style={[elements.tray,styles.container]}>
            <Text style={[styles.messageAuthor]}>
                {personnelToString(message.author)}
            </Text>
            <Text style={[styles.messageText]}>
                {message.message}
            </Text>
            <Text style={[styles.messageTimestamp]}>
                {getTimeString(timestamp)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginVertical: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: "auto",
        marginLeft: 20,
        maxWidth: "80%"
    },
    messageText: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "left",
        color: colors.primaryText
    },

    messageAuthor: {
        marginVertical: 8,
        fontSize: 12,
        fontWeight: "400",
        textAlign: "left",
        color: colors.grayText
    },
    messageTimestamp: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: "400",
        textAlign: "right",
        color: colors.grayText
    }
});

export default LogMessageField;
