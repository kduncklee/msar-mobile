import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, Image, View, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router } from 'expo-router';
import FormTextInput from '../components/inputs/FormTextInput';
import SmallButton from '../components/inputs/SmallButton';
import { apiGetToken, apiValidateToken } from '../remote/api';
import { loginResponse } from '../remote/responses';
import { getCredentials, storeCredentials, clearCredentials } from '../storage/storage';
import ActivityModal from '../components/modals/ActivityModal';
import "../storage/global";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

const Page = () => {
    //R07 / L!u0fN*V^rcPe1hX

    const [topMargin, setTopMargin] = useState(0);
    const scrollViewRef = useRef(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('dark-content');
            setTopMargin(0);
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
            StatusBar.setBarStyle('light-content');
            setTopMargin(StatusBar.currentHeight + 20);
        }


        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                if (scrollViewRef && scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true })
                }
            }
        );

        tokenCheck();
        //validateToken();

    }, []);

    const tokenCheck = async () => {
        const creds = await getCredentials();
        if (!creds.token || !creds.username) {
            return;
        }

        setUsername(creds.username);
        setPassword("PASSWORD");
        setShowSpinner(true);

        const response = await apiValidateToken();
        if (response.valid_token == true) {
            router.push('callout-list');
        } else {
            await clearCredentials();
            setUsername('');
            setPassword('');
        }

        setShowSpinner(false);

    }


    const usernameChanged = (text: string) => {
        setUsername(text);
    }

    const passwordChanged = (text: string) => {
        setPassword(text);
    }

    const login = async () => {
        setShowSpinner(true);

        const response: loginResponse = await apiGetToken(username, password);
        setShowSpinner(false);
        if (response.non_field_errors) {
            let errorString: string = response.non_field_errors.join('\n');
            Alert.alert('Problem logging in', errorString, [
                { text: 'OK' },
            ]);
            return
        }

        if (response.token) {
            await storeCredentials(username, response.token);
            global.currentCredentials = await getCredentials();
            router.push('callout-list');
        }


    }

    return (
        <>
            <Image source={require('../assets/background.png')} style={styles.backgroundImage} />
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={styles.contentContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Adjust the offset as needed
                >
                    <ScrollView
                        style={styles.scrollView}
                        ref={scrollViewRef}>
                        <Image source={require('../assets/msar_logo.png')} style={[styles.logoImage, { marginTop: topMargin }]} />
                        <View style={[elements.tray, { padding: 20, margin: 20 }]}>
                            <FormTextInput
                                title={'Username'}
                                icon={require('../assets/icons/user.png')}
                                value={username}
                                onChange={usernameChanged}
                                placeholder={'Username'} />
                            <FormTextInput
                                title={'Password'}
                                icon={require('../assets/icons/lock.png')}
                                value={password}
                                onChange={passwordChanged}
                                placeholder={'Password'}
                                secure={true} />
                            <View style={styles.buttonTray}>
                                <SmallButton
                                    title={'Login'}
                                    backgroundColor={colors.yellow}
                                    textColor={colors.black}
                                    onPress={() => login()} />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
            {showSpinner &&
                <ActivityModal message={"Logging in..."} />
            }
        </>
    )
}

const styles = StyleSheet.create({
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 1,
        resizeMode: "cover"
    },
    container: {
        flex: 1,
        backgroundColor: colors.clear,
        zIndex: 2
    },
    contentContainer: {
        flex: 1,
    },
    scrollView: {
        marginTop: 0,
        flex: 1,
        paddingTop: 10,
    },
    logoImage: {
        margin: 20,
        alignSelf: "center",
        width: 300,
        height: 300,
        resizeMode: "contain"
    },
    buttonTray: {
        marginTop: 20,
        width: 120,
        alignSelf: "flex-end"
    }
})

export default Page;
