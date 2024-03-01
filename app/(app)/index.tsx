import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, Image, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { router } from 'expo-router';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import SnoozeModal from 'components/modals/SnoozeModal';
import { getSnoozeExpires, storeSnoozeExpires } from 'storage/storage';

const Page = () => {
    const [topMargin, setTopMargin] = useState(0);
    const [snoozeModalVisible, setSnoozeModalVisible] = useState(false);
    const [snoozeExpireTime, setSnoozeExpireTime] = useState(0);
    const [snoozeTitle, setSnoozeTitle] = useState('Snooze');

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('dark-content');
            setTopMargin(0);
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
            StatusBar.setBarStyle('light-content');
            setTopMargin(StatusBar.currentHeight + 20);
        }
    }, []);


    useEffect(() => {
        getSnoozeExpires().then(setSnoozeExpireTime);
    }, []);


    const updateSnooze = () => {
        const snoozeRemaining = snoozeExpireTime - new Date().getTime();
        const snoozing = snoozeRemaining > 0;
        const title = snoozing ? 
          ("Snoozing until " + new Date(snoozeExpireTime).toLocaleTimeString() ) :
          "Snooze";
        setSnoozeTitle(title);
        return snoozeRemaining;
    }

    useEffect(() => {
        const snoozeRemaining = updateSnooze();
        const interval = setInterval(updateSnooze, snoozeRemaining); 
        return () => clearInterval(interval); 
    }, [snoozeExpireTime]);

    const snoozeSelected = (minutes: number) => {
        console.log(minutes);
        setSnoozeModalVisible(false);
        if (0 && !minutes) {
            storeSnoozeExpires(0);
            setSnoozeExpireTime(0);
            return;
        }
        const minutesToMs = 60 * 1000;
        const currentTime = new Date().getTime();
        const expireTime = currentTime + minutes * minutesToMs;
        const expireDate = new Date(expireTime);
        storeSnoozeExpires(expireTime);
        setSnoozeExpireTime(expireTime);
        console.log(expireTime, expireDate.toLocaleTimeString());
    }

    return (
        <>
            <Image source={require('../../assets/background.png')} style={styles.backgroundImage} />
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    <Image source={require('../../assets/msar_logo.png')} style={[styles.logoImage, { marginTop: topMargin }]} />
                    <TouchableOpacity activeOpacity={0.5}
                        onPress={() => router.push('/callout-list')}>
                        <View style={[elements.tray,styles.contentTray]}>
                            <Text style={styles.buttonText}>Callouts</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}
                        onPress={() => router.push('/chat')}>
                        <View style={[elements.tray,styles.contentTray]}>
                            <Text style={styles.buttonText}>Announcements / Chat</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}
                        onPress={() => router.push('/settings')}>
                        <View style={[elements.tray,styles.contentTray]}>
                            <Text style={styles.buttonText}>Settings</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={0.5}
                        onPress={() => setSnoozeModalVisible(true)}>
                        <View style={[elements.tray,styles.contentTray]}>
                            <Text style={styles.buttonText}>{snoozeTitle}</Text>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>

            <SnoozeModal
                modalVisible={snoozeModalVisible}
                onSelect={snoozeSelected}
                onCancel={() => setSnoozeModalVisible(false)} />
        </>
    )
}


const styles = StyleSheet.create({
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: -5,
        resizeMode: "cover"
    },
    container: {
        flex: 1,
        backgroundColor: colors.clear,
    },
    contentContainer: {
        flex: 1,
    },
    contentTray: {
        flexDirection: "row",
        height: 100,
        marginHorizontal: 20,
        marginVertical: 10,
        overflow: "hidden",
        alignItems: "center"
    },
    buttonText: {
        fontSize: 24,
        fontWeight: "500",
        color: colors.primaryText,
        flex: 1,
        marginHorizontal: 20,
    },
    scrollView: {
        marginTop: 0,
        flex: 1,
        paddingTop: 10,
    },
    logoImage: {
        margin: 20,
        alignSelf: "center",
        width: 200,
        height: 200,
        resizeMode: "contain"
    },
    buttonTray: {
        marginTop: 20,
        width: 120,
        alignSelf: "flex-end"
    }
})


export default Page;
