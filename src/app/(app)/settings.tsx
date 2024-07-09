import { useEffect, useState } from 'react';
import * as Application from 'expo-application';
import { router } from 'expo-router';
import { Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { clearCredentials, clearServer, getCredentials, getServer } from '@storage/storage';
import { getCriticalAlertsVolume, storage, storeCriticalAlertsVolume } from '@storage/mmkv';
import '@storage/global';
import FormCheckbox from '@components/inputs/FormCheckbox';
import * as PushNotifications from '@utility/pushNotifications';
import NotificationSettings from '@components/NotificationSettings';
import FormSlider from '@components/inputs/FormSlider';
import HorrizontalLine from '@components/HorrizontalLine';
import Header from '@components/Header';

function Page() {
  const [username, setUsername] = useState('Loading...');
  const [server, setServer] = useState('Loading...');
  const [notificationLoading, setNotificationLoading] = useState('Loading...');
  const [pushEnabled, setPushEnabled] = useState(null);
  const [criticalAlertsVolume, setCriticalAlertsVolume] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadCredentials();
    PushNotifications.checkPushToken().then(
      setPushEnabled,
      () => setNotificationLoading('Unable to connect'),
    );
    setCriticalAlertsVolume(getCriticalAlertsVolume());
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
    }
    else {
      setServer('Production');
    }
  };

  const onPushToggle = async () => {
    const pushStatus = !pushEnabled;

    await PushNotifications.sendPushToken(pushStatus);

    setPushEnabled(pushStatus);
  };

  const onCriticalAlertSlidingComplete = async (value: number) => {
    setCriticalAlertsVolume(value);
    storeCriticalAlertsVolume(value);
    console.log(value);
  };

  const onRestoreNotificationDefaultsPress = async () => {
    PushNotifications.restoreNotificationDefaults();
    router.replace('/');
  };

  const onSignOutPress = async () => {
    await PushNotifications.removePushToken();
    await clearCredentials();
    await clearServer();
    global.currentCredentials = null;
    queryClient.invalidateQueries();
    queryClient.clear();
    storage.clearAll();
    router.replace('/');
  };

  const notifications = (
    <>
      <FormCheckbox
        title="Notifications"
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
          {Platform.OS === 'ios' && (
            <FormSlider
              title="Critical Alert Volume"
              value={criticalAlertsVolume}
              onChange={onCriticalAlertSlidingComplete}
            />
          )}
          <NotificationSettings title="New Callout" channel="callout" />
          <NotificationSettings
            title="Callout 10-22"
            channel="callout-resolved"
          />
          <NotificationSettings
            title="Updates for a Callout"
            channel="log" // callout-log
          />
          <NotificationSettings
            title="Callout Responses: 10-7"
            channel="callout-response-no"
          />
          <NotificationSettings
            title="Callout Responses: 10-8 & 10-19"
            channel="callout-response-yes"
          />
          <NotificationSettings
            title="Announcements"
            channel="announcement"
          />
        </>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" backButton />
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
        <HorrizontalLine />
        {(pushEnabled == null)
          ? (<Text style={elements.mediumText}>{notificationLoading}</Text>)
          : notifications}
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
    backgroundColor: colors.secondaryBg,
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 0,
    paddingHorizontal: 20,
    backgroundColor: colors.secondaryBg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: '500',
    color: colors.primaryText,
  },
  closeContainer: {
    marginRight: 0,
  },
  userContainer: {
    marginTop: 10,
    flexDirection: 'row',
  },
  userText: {
    color: colors.yellow,
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
  },
  bottomContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flex: 1,
    padding: 20,
  },
  signOutButton: {
    marginBottom: 50,
  },
  signOutText: {
    color: colors.yellow,
    textAlign: 'center',
  },

});

export default Page;