import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, Image, View, KeyboardAvoidingView, Keyboard } from 'react-native';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router } from 'expo-router';
import FormTextInput from '../components/inputs/FormTextInput';
import SmallButton from '../components/inputs/SmallButton';
import { apiGetToken } from '../remote/api';
import { loginResponse } from '../remote/responses';

const Page = () => {

    const scrollViewRef = useRef(null);
    const [username, setUsername] = useState('R07');
    const [password, setPassword] = useState('L!u0fN*V^rcPe1hX')

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('dark-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                if (scrollViewRef) {
                    scrollViewRef.current.scrollToEnd({ animated: true })
                }
            }
        );

    }, []);

    const usernameChanged = (text: string) => {
        setUsername(text);
    }

    const passwordChanged = (text: string) => {
        setPassword(text);
    }

    const login = async () => {

        const response: loginResponse = await apiGetToken(username,password);
        if (response.non_field_errors) {
            let errorString: string = response.non_field_errors.join('\n');
            alert('Problem logging in: \n' + errorString);
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
                        <Image source={require('../assets/msar_logo.png')} style={styles.logoImage} />
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
                                placeholder={'Password'} />
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