import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Platform, StatusBar, BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { getConditionalTimeString } from '../utility/dateHelper';

type HeaderProps = {
    title: string,
    backButton?: boolean,
    onBackPressed?: () => void,
    rightButton?: boolean,
    onRightPressed?: () => void,
    timestamp?: Date
}

const Header = ({ title, backButton = false, onBackPressed, rightButton = false, timestamp = null }: HeaderProps) => {

    const [headerMargin, setHeaderMargin] = useState(0);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            setHeaderMargin(0);
        } else if (Platform.OS === 'android') {
            setHeaderMargin(StatusBar.currentHeight);
        }
    }, []);

    useFocusEffect(() => {

        //console.log('added back handler: ' + pathname)
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);

        return () => {
            //console.log('removed back handler: ' + pathname);
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
        }
    });

    const handleBackButton = () => {
        // Prevent default behavior of the back button
        return !backButton;
    };

    const backPressed = () => {
        if (onBackPressed) {
            onBackPressed();
        } else {
            router.back();
        }
    }

    const settingsPressed = () => {
        router.push('/settings');
        console.log("settings");
    }

    return (
        <View style={[styles.container, { marginTop: headerMargin }]}>
            {backButton &&
                <TouchableOpacity activeOpacity={0.2} style={styles.backContainer} onPress={() => backPressed()}>
                    <Image source={require('assets/icons/back.png')} style={styles.backImage} />
                </TouchableOpacity>
            }
            <Text style={[styles.title, { paddingHorizontal: backButton ? 10 : 20 }]}
                numberOfLines={1}>
                {title}
            </Text>
            {timestamp != null && <View style={[elements.capsule, { marginRight: 20 }]}>
                <Text style={elements.smallYellowText}>{getConditionalTimeString(timestamp)}</Text>
            </View>
            }
            {rightButton &&
                <TouchableOpacity activeOpacity={0.2} style={styles.rightContainer} onPress={() => settingsPressed()}>
                    <Image source={require('assets/icons/settings.png')} style={styles.rightImage} />
                </TouchableOpacity>
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
    rightContainer: {
        width: 30,
        height: 30,
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    backImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    rightImage: {
        width: 40,
        height: 40,
        resizeMode: 'contain',
    }
});

export default Header;
