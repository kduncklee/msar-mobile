import { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import * as Sentry from '@sentry/react-native';
import { useMutation, useMutationState, useQueryClient } from '@tanstack/react-query';
import Header from '@components/Header';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { useLocalSearchParams } from 'expo-router';
import TabSelector from '@components/TabSelector/TabSelector';
import CalloutInformationTab from '@components/callouts/CalloutInformationTab';
import CalloutLogTab from '@components/callouts/CalloutLogTab';
import CalloutPersonnelTab from '@components/callouts/CalloutPersonnelTab';
import LogInput from '@components/callouts/LogInput';
import msarEventEmitter from '@utility/msarEventEmitter';
import CalloutRespondModal from '@components/modals/CalloutRespondModal';
import CalloutFileTab from 'components/callouts/CalloutFileTab';
import { calloutLogQueryKey, calloutQueryKey, useCalloutLogInfiniteQuery, useCalloutQuery, useCalloutResponsesAvailableMap } from '@/remote/query';
import { useCalloutLogMutation } from '@/remote/mutation';
import { calloutResponseBadge } from '@/types/callout';
import type { tabItem } from '@/types/tabItem';
import { calloutStatus } from '@/types/enums';
import { calloutResponseSuccessNotification } from '@/utility/pushNotifications';
import type { calloutResponse } from '@/types/calloutResponse';
import useAuth from '@/hooks/useAuth';

enum CalloutTabs { INFO, LOG, FILES, PERSONNEL };

function Page() {
  const { id, title, type } = useLocalSearchParams<{ id: string; title: string; type?: string }>();
  const { api } = useAuth();
  const calloutResponseMap = useCalloutResponsesAvailableMap();
  const [headerTitle, setHeaderTitle] = useState(title);
  const scrollViewRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  let defaultTab: number = CalloutTabs.INFO;
  if (type != null) {
    if (type === 'log') {
      defaultTab = CalloutTabs.LOG;
    }
  }
  const [currentTab, setCurrentTab] = useState(defaultTab);
  const [logBadge, setLogBadge] = useState(null);
  const [fileBadge, setFileBadge] = useState(null);
  const [personnelBadge, setPersonnelBadge] = useState(null);
  const [calloutTimestamp, setCalloutTimestamp] = useState<Date>(null);
  const [logMessageText, setLogMessageText] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isResolved, setIsResolved] = useState(false);
  const headerBackground = isResolved ? colors.green : colors.primaryBg;

  const idInt: number = Number.parseInt(id);

  const queryClient = useQueryClient();
  const calloutQuery = useCalloutQuery(id);

  const calloutResponseKey = ['calloutResponse', idInt];
  const calloutResponseMutation = useMutation({
    mutationFn: (variables: calloutResponse) => api.apiRespondToCallout(variables.idInt, variables.text),
    mutationKey: calloutResponseKey,
    onSuccess: (_result, variables, _context) => {
      msarEventEmitter.emit('refreshCallout', { id: idInt });
      calloutResponseSuccessNotification(variables.text);
    },
    onError: (error, _variables, _context) => {
      Sentry.captureException(error);
      Toast.show(`Unable to set status: ${error.message}`, {
        duration: Toast.durations.LONG,
      });
    },
    retry: 26, // 10 minutes (6 in first minute, then 30s each)
  });
  const calloutResponseMutationState = useMutationState({
    // this mutation key needs to match the mutation key of the given mutation (see above)
    filters: { mutationKey: calloutResponseKey, status: 'pending' },
    select: mutation => mutation.state.variables as calloutResponse,
  });

  const calloutLogMutation = useCalloutLogMutation(idInt);

  const callout = calloutQuery.data;

  console.log('view-callout modalVisible =', modalVisible);

  const respondButtonText = (calloutResponseMutationState.length
    ? (`Sending response ${calloutResponseMutationState[0].text}`)
    : (callout && callout.my_response ? `Responded ${callout.my_response}` : 'Respond'));

  const tabs: Array<tabItem> = Array.from({ length: 4 });
  tabs[CalloutTabs.INFO] = {
    title: 'Info',
  };
  tabs[CalloutTabs.LOG] = {
    title: 'Log',
    badge: logBadge,
    badgeColor: colors.red,
  };
  tabs[CalloutTabs.FILES] = {
    title: 'Files',
    badge: fileBadge,
    badgeColor: colors.red,
  };
  tabs[CalloutTabs.PERSONNEL] = {
    title: 'Personnel',
    badge: personnelBadge,
    badgeColor: colors.green,
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    }
    else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(headerBackground);
    }
    return () => {
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(colors.primaryBg);
      }
    };
  }, [headerBackground]);

  useEffect(() => {
    msarEventEmitter.on('refreshCallout', refreshReceived);

    return () => {
      msarEventEmitter.off('refreshCallout', refreshReceived);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (callout) {
      const numberOfFiles = callout.files?.length;
      setHeaderTitle(callout.title);
      setPersonnelBadge(calloutResponseBadge(callout, calloutResponseMap));
      setLogBadge(callout.log_count);
      setFileBadge(numberOfFiles || null);
      setCalloutTimestamp(callout.created_at);

      if (callout.status === calloutStatus.ACTIVE) {
        setIsActive(true);
      }
      else {
        setIsActive(false);
      }
      if (callout.status === calloutStatus.RESOLVED) {
        setIsResolved(true);
      }
      else {
        setIsResolved(false);
      }
    }
  }, [callout, calloutResponseMap]);

  const refreshCallout = () => {
    console.log('refreshCallout');
    queryClient.invalidateQueries({ queryKey: calloutQueryKey(idInt) });
    queryClient.invalidateQueries({ queryKey: calloutLogQueryKey(idInt) });
  };

  const refreshReceived = (_data) => {
    refreshCallout();
  };

  const tabChanged = (index: number) => {
    setCurrentTab(index);
    refreshCallout();
  };

  const responseSelected = (response: string) => {
    console.log('selected response', response);
    submitCalloutResponse(response);
    setModalVisible(false);
  };

  const submitCalloutResponse = async (responseString: string) => {
    const idInt: number = Number.parseInt(id);
    calloutResponseMutation.mutate(
      {
        idInt,
        text: responseString,
      },
    );
  };

  const onLogMessageTextChanged = (text: string) => {
    setLogMessageText(text);
  };

  const submitLogMessage = async () => {
    calloutLogMutation.mutate({ message: logMessageText }, {
      onSuccess: () => {
        // Additionally refresh the callout data to update badge.
        queryClient.invalidateQueries({ queryKey: calloutQueryKey(idInt) });
      },

    });
    setLogMessageText('');
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header title={headerTitle} background={headerBackground} backButton timestamp={calloutTimestamp} />
        {!!callout
        && (
          <>
            <TabSelector tabs={tabs} selected={currentTab} onTabChange={tabChanged} />
            <KeyboardAvoidingView
              style={styles.contentContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
            >
              <View style={styles.contentContainer}>
                {currentTab === CalloutTabs.INFO
                && (
                  <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                  >
                    <CalloutInformationTab
                      callout={callout}
                    />
                  </ScrollView>
                )}
                {currentTab === CalloutTabs.LOG
                && (
                  <CalloutLogTab
                    id={idInt}
                    useInfiniteQueryFn={useCalloutLogInfiniteQuery}
                  />
                )}
                {currentTab === CalloutTabs.FILES
                && <CalloutFileTab callout={callout} />}
                {currentTab === CalloutTabs.PERSONNEL
                && (
                  <ScrollView
                    ref={scrollViewRef}
                    style={styles.scrollView}
                  >
                    <CalloutPersonnelTab callout={callout} />
                  </ScrollView>
                )}
                {currentTab === CalloutTabs.INFO && isActive
                && (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={[elements.capsuleButton, styles.respondCalloutButton]}
                    onPress={() => setModalVisible(true)}
                  >
                    <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>{ respondButtonText }</Text>
                  </TouchableOpacity>
                )}
                {currentTab === CalloutTabs.LOG
                && (
                  <LogInput
                    onTextChange={onLogMessageTextChanged}
                    text={logMessageText}
                    onSendPress={submitLogMessage}
                  />
                )}
              </View>
            </KeyboardAvoidingView>
          </>
        )}
      </SafeAreaView>
      <CalloutRespondModal
        modalVisible={modalVisible}
        onSelect={responseSelected}
        onCancel={() => setModalVisible(false)}
      />
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
  respondCalloutButton: {
    margin: 20,
    height: 60,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Page;
