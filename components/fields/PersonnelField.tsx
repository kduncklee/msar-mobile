import React, { useState, } from 'react';
import { StyleSheet, View, Text, Image, ImageRequireSource } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { personnel, personnelToString } from '../../types/personnel';

type PersonnelFieldProps = {
    personnel: personnel
}

const PersonnelField = ({ personnel }: PersonnelFieldProps) => {

    const onPhonePress = () => {
        console.log("phone pressed");
    }

    return (
        <View style={styles.container}>
            {personnel.phone &&
                <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => onPhonePress}>
                    <Text style={styles.valueText}>{personnelToString(personnel)}</Text>
                    <Image source={require('../../assets/icons/phone.png')} style={styles.iconImage} />
                </TouchableOpacity>
            }
            {!personnel.phone &&
                <Text style={[styles.valueText, { color: colors.primaryText }]}>{personnelToString(personnel)}</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    },
    valueText: {
        flex: 1,
        fontSize: 16,
        fontWeight: "400",
        color: colors.primaryText
    },
    iconImage: {
        resizeMode: "contain",
        width: 30,
        height: 30,
    }
});

export default PersonnelField;
