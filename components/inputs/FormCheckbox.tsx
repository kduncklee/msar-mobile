import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'

type FormCheckboxProps = {
    title: string,
    checked: boolean,
    onToggle: (checked: boolean) => void
}

const FormCheckbox = ({ title, checked, onToggle }: FormCheckboxProps) => {

    //const [checkStatus, setChecked] = useState(false);

    const onCheckToggle = () => {
        
        onToggle(!checked);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                activeOpacity={0.5}
                style={[elements.inputContainer, { width: 40, height: 40, justifyContent: "center", alignItems: "center" }]}
                onPress={onCheckToggle}>
                {checked &&
                    <Image source={require('../../assets/icons/check.png')} style={elements.fieldImage} />
                }
            </TouchableOpacity>
            <Text style={[elements.mediumText,{marginLeft: 10, fontWeight: "600"}]}>{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        flexDirection: "row",
        alignContent: "center",
        alignItems: "center"
    }
});

export default FormCheckbox;