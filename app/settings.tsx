import { useEffect, useState } from "react";
import { Link, router } from "expo-router"
import { StyleSheet, View, Text, Platform } from "react-native";
import colors from "../styles/colors";
import { elements } from "../styles/elements";
import { clearCredentials, getCredentials } from "../storage/storage";
import InformationField from "../components/fields/InformationField";
import FormCheckbox from "../components/inputs/FormCheckbox";
import { TouchableOpacity } from "react-native-gesture-handler";
import pushNotifications from "../utility/pushNotifications";


const Page = () => {

    const [username, setUsername] = useState('Loading...');
    const [pushEnabled, setPushEnabled] = useState(false);

    const topMargin: number = Platform.OS === 'ios' ? 0 : 20;



    useEffect(() => {

        loadCredentials();
        checkPushNotifications();
    }, []);

    const loadCredentials = async () => {
        const credentials = await getCredentials();
        if (credentials.username != null) {
            setUsername(credentials.username);
        }
        console.log(credentials);
    }

    const checkPushNotifications = async () => {
        let token = await pushNotifications.getToken();
        if (token != null) {
            setPushEnabled(true);
        }
    }

    const onPushToggle = () => {
        setPushEnabled(!pushEnabled);
    }

    const onSignOutPress = async () => {
        
        await pushNotifications.removePushToken();
        await clearCredentials();
        router.replace('/');
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, { marginTop: topMargin }]}>
                <Text style={[styles.title]}>Settings</Text>
                <Link style={styles.closeContainer} href='../'>
                    <Text style={[elements.mediumText, { color: colors.yellow }]}>
                        Close
                    </Text>
                </Link>
            </View>
            <View style={{ marginTop: 20 }} />
            <View style={styles.userContainer}>
                <Text style={elements.mediumText}>Username</Text>
                <Text style={[elements.mediumText, styles.userText]}>{username}</Text>
            </View>
            <FormCheckbox
                title={'Notifications'}
                checked={pushEnabled}
                onToggle={onPushToggle} />
            <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.signOutButton} activeOpacity={0.5} onPress={onSignOutPress}>
                <Text style={[elements.mediumText, styles.signOutText]}>Sign Out</Text>
            </TouchableOpacity>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: colors.secondaryBg
    },
    header: {
        flexDirection: "row",
        alignItems: "center"
    },
    title: {
        flex: 1,
        fontSize: 30,
        fontWeight: "500",
        color: colors.primaryText,
    },
    closeContainer: {
        marginRight: 0
    },
    userContainer: {
        flexDirection: "row"
    },
    userText: {
        color: colors.yellow,
        fontWeight: "800",
        flex: 1,
        textAlign: "right"
    },
    bottomContainer: {
        flex: 1,
        justifyContent: "flex-end"
    },
    signOutButton: {
        marginBottom: 50
    },
    signOutText: {
        color: colors.yellow,
        textAlign: "center",
    }

});

export default Page;