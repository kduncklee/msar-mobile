import React, { useState, } from 'react';
import { StyleSheet, View, Text, Image, ImageRequireSource } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'

type TextAreaFieldProps = {
    title?: string,
    value: string,
    valueColor?: string
}

const TextAreaField = ({ title, value, valueColor }: TextAreaFieldProps) => {

    const textColor = valueColor ? valueColor : colors.primaryText;

    return (
        <View style={styles.container}>
            {!!title &&
                <Text style={styles.titleText}>{title}</Text>
            }
            <View style={styles.valueContainer}>
                <Text
                    style={[styles.valueText, {color: textColor}]}
                    selectable={true}
                >{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    titleText: {
        fontSize: 14,
        fontWeight: "300",
        color: colors.lightText,
        marginBottom: 8
    },
    valueContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8
       
    },
    valueText: {
        fontSize: 16,
        fontWeight: "300",
        color: colors.primaryText
    }
});

export default TextAreaField;
