import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'
import { responseType } from '../../types/enums';
import LargeButton from '../inputs/LargeButton';

type CalloutRespondProps = {
    onSelect: (response: responseType) => void,
    onCancel: () => void
}

const CalloutRespond = ({onSelect, onCancel}: CalloutRespondProps) => {

    const callOutResponse = (response: responseType) => {
        onSelect(response);
    }

    return (
        <View style={styles.container}>
            <Text style={[elements.mediumText, {margin: 8, fontWeight: "500"}]}>Respond</Text>
            <LargeButton
                title={'10-19'}
                backgroundColor={colors.secondaryYellow}
                textColor={colors.black}
                onPress={() => callOutResponse(responseType.TEN19)} />
                <LargeButton
                title={'10-8'}
                backgroundColor={colors.green}
                textColor={colors.primaryText}
                onPress={() => callOutResponse(responseType.TEN8)} />
                <LargeButton
                title={'10-7'}
                backgroundColor={colors.red}
                textColor={colors.primaryText}
                onPress={() => callOutResponse(responseType.TEN7)} />
                <View style={{height: 40}} />
                <LargeButton
                title={'Cancel'}
                backgroundColor={colors.secondaryBg}
                textColor={colors.grayText}
                onPress={onCancel} />

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        borderRadius: 20,
        borderColor: colors.grayText,
        borderWidth: 2,
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: colors.primaryBg
    },
});

export default CalloutRespond;