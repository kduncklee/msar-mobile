import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import Header from '@components/Header';
import colors from '@styles/colors';
import { useQueryClient } from '@tanstack/react-query';
import { memberListQueryKey, useMemberListQuery } from '@/remote/query';
import UserCell from '@/components/UserCell';
import type { MenuDropdownItem } from '@/components/MenuDropdown';
import MenuDropdown from '@/components/MenuDropdown';

function Page() {
  const [sortName, setSortName] = useState('Name');
  const [sortKey, setSortKey] = useState('last_name');
  const [reversed, setReversed] = useState(false);
  const queryClient = useQueryClient();
  const query = useMemberListQuery();
  const sorted = query.data
    ? [...query.data].filter(item => item.is_current).sort((a, b) => {
        return a[sortKey] < b[sortKey] ? -1 : 1;
      })
    : [];
  if (reversed) {
    sorted.reverse();
  }

  const sortMenuItems = [
    { name: 'Name', sortKey: 'last_name' },
    { name: 'Status', sortKey: 'status_order' },
    { name: 'R number', sortKey: 'username' },
  ].map((item) => {
    return {
      name: item.name,
      onSelect: () => {
        setSortKey(item.sortKey);
        setSortName(item.name);
      },
    };
  });

  const orderMenuItems: MenuDropdownItem[] = [
    { name: 'Ascending', onSelect: () => { setReversed(false); } },
    { name: 'Descending', onSelect: () => { setReversed(true); } },
  ];

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    }
    else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primaryBg);
    }
  }, []);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: memberListQueryKey });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Roster" backButton />
      <View style={styles.menuBar}>
        <Text style={styles.menuTitle}>Sort by: </Text>
        <MenuDropdown items={sortMenuItems}>
          <Text style={styles.menuTitle}>{sortName}</Text>
        </MenuDropdown>
        <MenuDropdown items={orderMenuItems}>
          <Text style={styles.menuTitle}>{reversed ? ' ▽ ' : ' △ '}</Text>
        </MenuDropdown>
      </View>
      <View style={styles.contentContainer}>
        {query.isLoading ? (<Text>Loading...</Text>) : null}
        {query.isSuccess
          ? (
              <ScrollView style={styles.scrollView}>
                {
                  sorted.map((user, _index) => {
                    return (<UserCell key={user.id} user={user} />);
                  })
                }
                <View style={{ height: 100 }} />
              </ScrollView>
            )
          : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 10,
  },
  menuBar: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.primaryText,
  },
});

export default Page;
