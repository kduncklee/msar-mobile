import { useEffect, useState } from 'react';
import { Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import Header from '@components/Header';
import CalloutCell from '@components/callouts/CalloutCell';
import colors from '@styles/colors';
import TabSelector from '@components/TabSelector/TabSelector';
import { elements } from '@styles/elements';
import { router } from 'expo-router';
import ActivityModal from '@components/modals/ActivityModal';
import msarEventEmitter from '@utility/msarEventEmitter';
import { useCalloutListQuery } from '@/remote/query';
import type { tabItem } from '@/types/tabItem';
import { activeTabStatusQuery, archivedTabStatusQuery } from '@/types/calloutSummary';
import type { calloutSummary } from '@/types/calloutSummary';

function Page() {
  const [showSpinner, _setShowSpinner] = useState(false);
  const [archiveCount, _setArchiveCount] = useState(null);
  const [status, setStatus] = useState(activeTabStatusQuery);
  const queryClient = useQueryClient();
  const query = useCalloutListQuery(status);

  const tabs: tabItem[] = [
    {
      title: 'Active',
    },
    {
      title: 'Archived',
      badge: archiveCount,
      badgeColor: colors.red,
    },
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
    msarEventEmitter.on('refreshCallout', refreshReceived);

    return () => {
      msarEventEmitter.off('refreshCallout', refreshReceived);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshReceived = (_data) => {
    console.log('Callouts refreshReceived');
    loadCallouts();
  };

  const loadCallouts = async () => {
    console.log('loadCallouts');
    queryClient.invalidateQueries({ queryKey: ['callouts'] });
  };

  const tabChanged = (index: number) => {
    if (index === 1) {
      setStatus(archivedTabStatusQuery);
    }
    else {
      setStatus(activeTabStatusQuery);
    }
  };

  const createCallout = () => {
    router.push({ pathname: 'edit-callout', params: {} });
  };

  const viewCallout = (calloutSummary: calloutSummary) => {
    router.push({ pathname: 'view-callout', params: { id: calloutSummary.id, title: calloutSummary.title } });
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header title="Callouts" backButton rightButton />
        <TabSelector tabs={tabs} onTabChange={tabChanged} />
        <View style={styles.contentContainer}>
          {query.isLoading ? (<Text>Loading...</Text>) : (null)}
          {query.isSuccess
            ? (
                <ScrollView style={styles.scrollView}>
                  {
                    query.data.map((summary: calloutSummary, _index: number) => {
                      return (<CalloutCell key={summary.id} summary={summary} onPress={viewCallout} />);
                    })
                  }
                  <View style={{ height: 100 }} />
                </ScrollView>
              )
            : (null)}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[elements.capsuleButton, styles.createCalloutButton]}
            onPress={() => createCallout()}
          >
            <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>Create Callout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showSpinner
      && <ActivityModal message="Loading Callouts..." />}
    </>
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
  createCalloutButton: {
    margin: 20,
    height: 60,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Page;
