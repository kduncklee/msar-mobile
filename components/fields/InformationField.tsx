import React, { useState, } from 'react';
import { StyleSheet, View, Text, Image, ImageRequireSource } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler';

type InformationFieldProps = {
    title?: string,
    value: string,
    valueColor?: string,
    icon?: ImageRequireSource,
    onIconPress?: () => void
}

const InformationField = ({ title, value, valueColor, icon, onIconPress }: InformationFieldProps) => {

    const textColor = valueColor ? valueColor : colors.secondaryYellow;

    return (
        <View style={styles.container}>
            {title &&
                <Text style={styles.titleText}>{title}</Text>
            }
            <View style={styles.valueContainer}>
                {onIconPress &&
                    <TouchableOpacity activeOpacity={0.5} onPress={onIconPress}>
                        {icon &&
                            <Image source={icon} style={styles.iconImage} />
                        }
                    </TouchableOpacity>
                }
                <Text style={[styles.valueText, {color: textColor}]}>{value}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    titleText: {
        fontSize: 14,
        fontWeight: "300",
        color: colors.lightText
    },
    valueContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    valueText: {
        fontSize: 16,
        textAlign: "right",
        fontWeight: "400",
        color: colors.secondaryYellow
    },
    iconButton: {
        height: 40,
        width: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    iconImage: {
        resizeMode: "contain",
        width: 30,
        height: 30
    }
});

export default InformationField;
