import { useEffect, useState } from 'react';
import { Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import SnoozeModal from 'components/modals/SnoozeModal';
import { getSnoozeExpires, storeSnoozeExpires, useLastRead } from 'storage/mmkv';
import { useCalloutListQuery, useChatLogInfiniteQuery } from 'remote/api';
import { logEntriesFromInfiniteQueryData } from 'types/logEntry';
import { activeTabStatusQuery } from 'types/calloutSummary';
import Badge from 'components/Badge';

// Warning: this limits at PAGE_SIZE. We should never have that many active.
function useNumberActiveCallouts(): number {
  // Use the active&resolved query because it acts like a prefetch.
  const query = useCalloutListQuery(activeTabStatusQuery);
  if (query.data) {
    return query.data.filter(x => x.status === 'active').length;
  }
  return 0;
}

function useChatUnread(): boolean {
  const { data } = useChatLogInfiniteQuery();
  const logList = logEntriesFromInfiniteQueryData(data);
  const lastId = logList ? logList[0]?.id : 0;
  const [lastLogRead, _setLastLogRead] = useLastRead(0);
  const hasUnread = (lastLogRead === undefined) || (lastLogRead < lastId);
  return hasUnread;
}

interface Items {
  key?: string;
  text: string;
  url?: string;
  onPress?: () => unknown;
  badge?: string | number;
}

function Page() {
  const [topMargin, setTopMargin] = useState(0);
  const [snoozeModalVisible, setSnoozeModalVisible] = useState(false);
  const [snoozeExpireTime, setSnoozeExpireTime] = useState(0);
  const [snoozeTitle, setSnoozeTitle] = useState('Snooze');
  const chatHasUnread = useChatUnread();
  const numberActiveCallouts = useNumberActiveCallouts();

  const items: Items[] = [
    { text: 'Callouts', url: '/callout-list', badge: numberActiveCallouts },
    { text: 'Announcements', url: '/chat', badge: chatHasUnread && '!' },
    { text: 'Roster', url: '/roster' },
    { text: 'Settings', url: '/settings' },
    { key: 'snooze', text: snoozeTitle, onPress: () => setSnoozeModalVisible(true) },
  ];

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
      setTopMargin(0);
    }
    else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primaryBg);
      StatusBar.setBarStyle('light-content');
      setTopMargin(StatusBar.currentHeight + 20);
    }
  }, []);

  useEffect(() => {
    setSnoozeExpireTime(getSnoozeExpires());
  }, []);

  useEffect(() => {
    const updateSnooze = () => {
      const snoozeRemaining = snoozeExpireTime - new Date().getTime();
      const snoozing = snoozeRemaining > 0;
      const title = snoozing
        ? (`Snoozing until ${new Date(snoozeExpireTime).toLocaleTimeString()}`)
        : 'Snooze';
      setSnoozeTitle(title);
      return snoozeRemaining;
    };

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
  };

  return (
    <>
      <Image source={require('@assets/background.png')} style={styles.backgroundImage} />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Image source={require('@assets/msar_logo.png')} style={[styles.logoImage, { marginTop: topMargin }]} />
          {items.map(item => (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={item.onPress ? item.onPress : () => router.push(item.url)}
              testID={item.text}
              key={item.text}
            >
              <View style={[elements.tray, styles.contentTray]}>
                <Text style={styles.buttonText}>{item.text}</Text>
                {!!item.badge && <Badge style={styles.badge}>{item.badge}</Badge>}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      <SnoozeModal
        modalVisible={snoozeModalVisible}
        onSelect={snoozeSelected}
        onCancel={() => setSnoozeModalVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -5,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: colors.clear,
  },
  contentContainer: {
    flex: 1,
  },
  contentTray: {
    flexDirection: 'row',
    height: 100,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: 'hidden',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 24,
    fontWeight: '500',
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
    alignSelf: 'center',
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  buttonTray: {
    marginTop: 20,
    width: 120,
    alignSelf: 'flex-end',
  },
  badge: {
    position: 'absolute',
    right: 5,
  },
});

export default Page;
