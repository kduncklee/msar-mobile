import { useEffect, useState } from "react";
import * as Application from 'expo-application';
import { router } from "expo-router"
import { ScrollView, StyleSheet, View, Text, Platform, SafeAreaView, TouchableOpacity } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import colors from "../../styles/colors";
import { elements } from "../../styles/elements";
import { clearCredentials, getCredentials, getServer, clearServer, getCriticalAlertsVolume, storeCriticalAlertsVolume } from "../../storage/storage";
import "../../storage/global";
import FormCheckbox from "../../components/inputs/FormCheckbox";
import * as PushNotifications from "../../utility/pushNotifications";
import NotificationSettings from "../../components/NotificationSettings";
import FormSlider from "../../components/inputs/FormSlider";
import HorrizontalLine from "../../components/HorrizontalLine";
import Header from "../../components/Header";


const Page = () => {

    const [username, setUsername] = useState('Loading...');
    const [server, setServer] = useState('Loading...');
    const [pushEnabled, setPushEnabled] = useState(false);
    const [criticalAlertsVolume, setCriticalAlertsVolume] = useState(null);
    const queryClient = useQueryClient()


    useEffect(() => {

        loadCredentials();
        checkPushNotifications();
        loadNotificationSettings();

    }, []);

    const loadCredentials = async () => {
        const credentials = await getCredentials();
        if (credentials.username != null) {
            setUsername(credentials.username);
        }
        console.log(credentials);
        const s = await getServer();
        if (s) {
            setServer(s);
        } else {
            setServer('Production');
        }
    }

    const checkPushNotifications = async () => {
        let token = await PushNotifications.getToken();
        if (token != null) {
            setPushEnabled(true);
        }
    }

    const loadNotificationSettings = async () => {
        const volume = await getCriticalAlertsVolume();
        console.log('loaded volume', volume);
        if (volume == null) {
            setCriticalAlertsVolume(0.9);
        } else {
            setCriticalAlertsVolume(volume);
        };
    }

    const onPushToggle = async () => {
        const pushStatus = !pushEnabled;

        if (!pushStatus) {
            await PushNotifications.removePushToken();
        } else {
            let token = await PushNotifications.getToken();
            if (token != null) {
                await PushNotifications.sendPushToken(token);
            }
        }

        setPushEnabled(pushStatus);
    }

    const onCriticalAlertSlidingComplete = async (value: number) => {
        setCriticalAlertsVolume(value);
        storeCriticalAlertsVolume(value);
        console.log(value);
    }

    const onRestoreNotificationDefaultsPress = async () => {
        await PushNotifications.restoreNotificationDefaults();
        router.replace('/');
    }

    const onSignOutPress = async () => {
        
        await PushNotifications.removePushToken();
        await clearCredentials();
        await clearServer();
        global.currentCredentials = null;
        queryClient.invalidateQueries();
        router.replace('/');
    }

    return (
      <SafeAreaView style={styles.container}>
        <Header title={"Settings"} backButton={true} />
        <ScrollView style={styles.scrollView}>
          <View style={styles.userContainer}>
            <Text style={elements.mediumText}>Username</Text>
            <Text style={[elements.mediumText, styles.userText]}>
              {username}
            </Text>
          </View>
          <View style={styles.userContainer}>
            <Text style={elements.mediumText}>Server</Text>
            <Text style={[elements.mediumText, styles.userText]}>{server}</Text>
          </View>
          <View style={styles.userContainer}>
            <Text style={elements.mediumText}>Version</Text>
            <Text style={[elements.mediumText, styles.userText]}>
              {Application.nativeApplicationVersion}
            </Text>
          </View>
          <FormCheckbox
            title={"Notifications"}
            checked={pushEnabled}
            onToggle={onPushToggle}
          />
          {pushEnabled && (
            <>
              <HorrizontalLine title="Notification Sounds" />
              <TouchableOpacity
                style={styles.buttonContainer}
                activeOpacity={0.5}
                onPress={onRestoreNotificationDefaultsPress}
              >
                <Text style={[elements.mediumText, styles.signOutText]}>
                  Restore default notification sounds
                </Text>
              </TouchableOpacity>
              {Platform.OS === "ios" && (
                <FormSlider
                  title={"Critical Alert Volume"}
                  value={criticalAlertsVolume}
                  onChange={onCriticalAlertSlidingComplete}
                />
              )}
              <NotificationSettings title={"New Callout"} channel={"callout"} />
              <NotificationSettings
                title={"Callout 10-22"}
                channel={"callout-resolved"}
              />
              <NotificationSettings
                title={"Updates for a Callout"}
                channel={"log"}
              />
              <NotificationSettings
                title={"Announcements"}
                channel={"announcement"}
              />
            </>
          )}
          <HorrizontalLine />
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.signOutButton}
              activeOpacity={0.5}
              onPress={onSignOutPress}
            >
              <Text style={[elements.mediumText, styles.signOutText]}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.secondaryBg
    },
    scrollView: {
        marginTop: 0,
        flex: 1,
        paddingTop: 0,
        paddingHorizontal: 20,
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
        marginTop: 10,
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
    buttonContainer: {
        flex: 1,
        padding: 20,
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
