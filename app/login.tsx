import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, Image, View, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router } from 'expo-router';
import FormTextInput from '../components/inputs/FormTextInput';
import SmallButton from '../components/inputs/SmallButton';
import { apiGetToken, apiValidateToken } from '../remote/api';
import { loginResponse } from '../remote/responses';
import { getCredentials, storeCredentials, clearCredentials, getServer, storeServer, clearServer } from '../storage/storage';
import ActivityModal from '../components/modals/ActivityModal';
import "../storage/global";


const Page = () => {

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

    }, []);

    const tokenCheck = async () => {
        const creds = await getCredentials();
        if (!creds.token || !creds.username) {
            return;
        }
        const server = await getServer();

        if (server) {
            setUsername(`_${server}_${creds.username}`);
        } else {
            setUsername(creds.username);
        }
        setPassword("");
        setShowSpinner(true);

        // Skipping api call to enable offline mode
        /*
        console.log("apiValidateToken");
        const response = await apiValidateToken();
        if (response.valid_token == true) {
            global.currentCredentials = await getCredentials();
            router.push('/');
        } else {
            await clearCredentials();
            setUsername('');
            setPassword('');
        }
        */
        global.currentCredentials = await getCredentials();
        router.push('/');

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

        let server = undefined;
        let server_username = username;
        const match = username.match(/_([^_]+)_(.+)/);
        if (match) {
            server = match[1];
            server_username = match[2];
            console.log(server, server_username);
            await storeServer(server);
        } else {
            console.log('clear server', server_username);
            await clearServer();
        }
        console.log("apiGetToken");
        const response: loginResponse = await apiGetToken(server_username, password);
        setShowSpinner(false);
        if (response.non_field_errors) {
            let errorString: string = response.non_field_errors.join('\n');
            Alert.alert('Problem logging in', errorString, [
                { text: 'OK' },
            ]);
            return
        }

        if (response.token) {
            await storeCredentials(server_username, response.token);
            global.currentCredentials = await getCredentials();
            router.push('/');
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
                                secure={true}
                                autoCorrect={false}
                                autoCapitalize={'none'} />
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
