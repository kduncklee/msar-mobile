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

type LogSelfMessageFieldProps = {
    message: message,
    timestamp: Date
}

const LogSelfMessageField = ({ message, timestamp }: LogSelfMessageFieldProps) => {

    return (
        <View style={[elements.messageSelfTray,styles.container]}>
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
        marginRight: 20,
        marginLeft: "auto",
        maxWidth: "80%"
    },
    messageText: {
        fontSize: 16,
        fontWeight: "400",
        textAlign: "right",
        color: colors.primaryText
    },
    messageTimestamp: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: "400",
        textAlign: "right",
        color: colors.primaryText
    }
});

export default LogSelfMessageField;
