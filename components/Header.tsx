import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { getTimeString } from '../utility/dateHelper';

type HeaderProps = {
    title: string;
    backButton?: boolean;
    timestamp?: Date;
}

const Header = ({title, backButton = false, timestamp = null}: HeaderProps) => {

    return (
        <View style={styles.container}>
            {backButton && 
                <TouchableOpacity activeOpacity={0.2} style={styles.backContainer} onPress={() => router.back()}>
                        <Image source={require('assets/icons/back.png')} style={styles.backImage}></Image>
                </TouchableOpacity>
            }
            <Text style={[styles.title,{paddingHorizontal: backButton ? 10 : 20}]}>
                {title}
            </Text>
            {timestamp != null && <View style={[elements.capsule, {marginRight: 20}]}>
                <Text style={elements.smallYellowText}>{getTimeString(timestamp)}</Text>
            </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        flexDirection: "row",
    },
    title: {
        flex: 1,
        fontSize: 30,
        fontWeight: "500",
        color: colors.primaryText,
    },
    backContainer: {
        width: 30,
        height: 30,
        marginLeft: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    backImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    }
});

export default Header;