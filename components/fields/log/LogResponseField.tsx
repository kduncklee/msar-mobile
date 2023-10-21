import React, { useState, } from 'react';
import { StyleSheet, View, Text, Image, ImageRequireSource } from 'react-native';
import { elements } from '../../../styles/elements';
import colors from '../../../styles/colors'
import { responseType } from '../../../types/enums';
import { colorForResponseType, textForResponseType } from '../../../types/calloutSummary';
import { getTimeString } from '../../../utility/dateHelper';
import { user, userToString } from '../../../types/user';

type LogResponseFieldProps = {
    member: user,
    response: responseType,
    timestamp: Date
}

const LogResponseField = ({ member, response, timestamp }: LogResponseFieldProps) => {

    return (
        <View style={styles.container}>
            <Text style={[styles.valueText,{color: colorForResponseType(response)}]}>
                {userToString(member)}{' responded '}{textForResponseType(response)}
            </Text>
            <Text style={styles.logTimestamp}>
                {getTimeString(timestamp)}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginVertical: 8
    },
    
    valueText: {
        
        fontSize: 18,
        fontWeight: "400",
        fontStyle: "italic",
        textAlign: "center",
        color: colors.primaryText
    },
    logTimestamp: {
        
        marginTop: 8,
        fontSize: 12,
        fontWeight: "400",
        textAlign: "center",
        color: colors.grayText
    }
});

export default LogResponseField;
