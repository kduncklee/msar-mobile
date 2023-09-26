import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ImageRequireSource } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'

type SmallButtonProps = {
    title?: string,
    icon?: ImageRequireSource,
    backgroundColor: string,
    textColor?: string
    onPress: () => void
}

const SmallButton = ({ title, icon, backgroundColor, textColor, onPress}: SmallButtonProps) => {

    return (
        
            <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
                <View style={[styles.container, {backgroundColor: backgroundColor}]}>
                {icon &&
                    <Image source={icon} style={[elements.buttonIcon]} />
                }
                {title &&
                    <Text style={[elements.fieldText, {color: textColor, paddingVertical: 8, paddingRight: 12, fontWeight: "400"}]}>{title}</Text>
                }
                </View>
            </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 0,
        alignContent: "center",
        alignItems: "center",
        borderRadius: 4
    },
    button: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center"
    }

});

export default SmallButton;