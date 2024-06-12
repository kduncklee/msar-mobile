import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, KeyboardAvoidingView } from 'react-native';
import Toast from 'react-native-root-toast';
import * as Sentry from "@sentry/react-native";
import { useQueryClient, useMutation, useMutationState } from "@tanstack/react-query";
import Header from '../../components/Header';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import { useLocalSearchParams } from 'expo-router';
import { calloutStatus, responseType } from '../../types/enums';
import { textForResponseType } from '../../types/calloutSummary';
import TabSelector from '../../components/TabSelector/TabSelector';
import CalloutInformationTab from '../../components/callouts/CalloutInformationTab';
import CalloutLogTab from '../../components/callouts/CalloutLogTab';
import CalloutPersonnelTab from '../../components/callouts/CalloutPersonnelTab';
import { tabItem } from '../../types/tabItem';
import LogInput from '../../components/callouts/LogInput';
import { callout, calloutResponseBadge } from '../../types/callout';
import { useCalloutQuery, apiRespondToCallout, useCalloutLogInfiniteQuery, useCalloutLogMutation } from '../../remote/api';
import msarEventEmitter from '../../utility/msarEventEmitter';
import CalloutRespondModal from '../../components/modals/CalloutRespondModal';


const Page = () => {

    const { id, title, type } = useLocalSearchParams<{ id: string, title: string, type?: string }>();
    const [headerTitle, setHeaderTitle] = useState(title);
    const scrollViewRef = useRef(null);

    const [modalVisible, setModalVisible] = useState(false);
    let defaultTab: number = 0;
    if (type != null) {
        if (type === 'log') {
            defaultTab = 1;
        }
    }
    const [currentTab, setCurrentTab] = useState(defaultTab);
    const [logBadge, setLogBadge] = useState(null);
    const [personnelBadge, setPersonnelBadge] = useState(null);
    const [calloutTimestamp, setCalloutTimestamp] = useState<Date>(null);
    const [logMessageText, setLogMessageText] = useState('');
    const [isActive, setIsActive] = useState(false);

    const idInt: number = parseInt(id);

    const queryClient = useQueryClient()
    const calloutQuery = useCalloutQuery(id);

    const calloutResponseKey = ["calloutResponse", idInt];
    const calloutResponseMutation = useMutation({
      mutationFn: ({ idInt, text }) => apiRespondToCallout(idInt, text),
      mutationKey: calloutResponseKey,
      onSuccess: (result, variables, context) => {
        msarEventEmitter.emit("refreshCallout", { id: idInt });
      },
      onError: (error, variables, context) => {
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
        select: (mutation) => mutation.state.variables,
      });

    const calloutLogMutation = useCalloutLogMutation(idInt);

    const callout = calloutQuery.data;

    console.log('view-callout modalVisible =', modalVisible);

    const respondButtonText = (calloutResponseMutationState.length ?
        ("Sending response " + calloutResponseMutationState[0].text) :
        (callout.my_response ? "Responded " + callout.my_response : "Respond"));

    const tabs: tabItem[] = [
        {
            title: "Information"
        },
        {
            title: "Log",
            badge: logBadge,
            badgeColor: colors.red
        },
        {
            title: "Personnel",
            badge: personnelBadge,
            badgeColor: colors.green
        }
    ]

    useEffect(() => {

        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }

        msarEventEmitter.on('refreshCallout', refreshReceived);

        return () => {
            msarEventEmitter.off('refreshCallout', refreshReceived);
        }

    }, []);

    useEffect(() => {
        if (callout) {
            setHeaderTitle(callout.title);
            setPersonnelBadge(calloutResponseBadge(callout));
            setLogBadge(callout.log_count);
            setCalloutTimestamp(callout.created_at);

            if (callout.status === calloutStatus.ACTIVE) {
                setIsActive(true);
            } else {
                setIsActive(false);
            }
        }
    }, [callout]);

    const refreshCallout = () => {
        console.log('refreshCallout');
        queryClient.invalidateQueries({ queryKey: ['calloutInfo'] });
        queryClient.invalidateQueries({ queryKey: ['calloutLog'] });
    }

    const refreshReceived = data => {
        refreshCallout();
    }


    const tabChanged = (index: number) => {
        setCurrentTab(index);
        refreshCallout();
    }

    const responseSelected = (response: responseType) => {
        console.log(textForResponseType(response));
        submitCalloutResponse(textForResponseType(response));
        setModalVisible(false);
    }

    const submitCalloutResponse = async (responseString: string) => {
        const idInt: number = parseInt(id);
        calloutResponseMutation.mutate(
          {
            idInt: idInt,
            text: responseString,
          }
        );
    }

    const onLogMessageTextChanged = (text: string) => {
        setLogMessageText(text);
    }

    const submitLogMessage = async () => {
        const idInt: number = parseInt(id);
        calloutLogMutation.mutate({message: logMessageText});
        setLogMessageText('');
    }


    return (
        <>
            <SafeAreaView style={styles.container}>
                <Header title={headerTitle} backButton={true} timestamp={calloutTimestamp} />
                {!!callout &&
                    <>
                        <TabSelector tabs={tabs} selected={currentTab} onTabChange={tabChanged} />
                        <KeyboardAvoidingView
                                style={styles.contentContainer}
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Adjust the offset as needed
                            >
                        <View style={styles.contentContainer}>
                            {currentTab === 0 &&
                                <ScrollView ref={scrollViewRef}
                                        style={styles.scrollView}>
                                    <CalloutInformationTab
                                        callout={callout} />
                                </ScrollView>
                            }
                            {currentTab === 1 &&
                                <CalloutLogTab
                                  id={idInt}
                                  useInfiniteQueryFn={() => useCalloutLogInfiniteQuery(id)}
                                />
                            }
                            {currentTab === 2 &&
                                <ScrollView ref={scrollViewRef}
                                        style={styles.scrollView}>
                                    <CalloutPersonnelTab
                             callout={callout} />
                                </ScrollView>
                            }
                            {currentTab === 0 && isActive &&
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[elements.capsuleButton, styles.respondCalloutButton]}
                                    onPress={() => setModalVisible(true)}>
                                    <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>{ respondButtonText }</Text>
                                </TouchableOpacity>
                            }
                            {currentTab === 1 &&
                                <LogInput
                                    onTextChange={onLogMessageTextChanged}
                                    text={logMessageText}
                                    onSendPress={submitLogMessage}
                                    onPhotoPress={() => console.log('photo')} />
                            }
                        </View>
                        </KeyboardAvoidingView>
                    </>
                }
            </SafeAreaView>
            <CalloutRespondModal 
                modalVisible={modalVisible}
                onSelect={responseSelected}
                onCancel={() => setModalVisible(false)} />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryBg
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
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    },
})

export default Page;
