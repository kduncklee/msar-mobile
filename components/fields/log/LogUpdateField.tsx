import React, { useState, } from 'react';
import { StyleSheet, View, Text, Image, ImageRequireSource } from 'react-native';
import { elements } from '../../../styles/elements';
import colors from '../../../styles/colors'
import { getConditionalTimeString } from '../../../utility/dateHelper';
import { user, userToString } from '../../../types/user';

type LogSystemFieldProps = {
    member: user,
    update: string,
    timestamp: Date
}

const LogSystemField = ({ member, update, timestamp }: LogSystemFieldProps) => {

    return (
        <View style={styles.container}>
            <Text style={[styles.valueText, { color: colors.grayText }]}>
                {userToString(member)}
            </Text>
            <Text style={[elements.fieldText, { textAlign: "center" }]}>
                {update}
            </Text>
            <Text style={styles.logTimestamp}>
                {getConditionalTimeString(timestamp)}
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

export default LogSystemField;
