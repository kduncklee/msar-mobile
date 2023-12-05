import { StyleSheet, View, Text, Image } from 'react-native';
import colors from '../../styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { opResponse } from '../../types/operationalPeriod';
import { userToString } from '../../types/user';

type PersonnelFieldProps = {
    opResponse: opResponse
}

const PersonnelField = ({ opResponse }: PersonnelFieldProps) => {

    const onPhonePress = () => {
        console.log("phone pressed");
    }

    return (
        <View style={styles.container}>
            {!!opResponse.member.mobile_phone &&
                <TouchableOpacity style={styles.button} activeOpacity={0.5} onPress={() => onPhonePress}>
                    <Text style={styles.valueText}>{userToString(opResponse.member)}</Text>
                    <Image source={require('../../assets/icons/phone.png')} style={styles.iconImage} />
                </TouchableOpacity>
            }
            {!opResponse.member.mobile_phone &&
                <Text style={[styles.valueText, { color: colors.primaryText }]}>{userToString(opResponse.member)}</Text>
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
