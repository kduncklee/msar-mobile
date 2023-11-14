import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import Header from '../components/Header';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { useLocalSearchParams } from 'expo-router';
import { calloutStatus, responseType } from '../types/enums';
import { textForResponseType } from '../types/calloutSummary';
import TabSelector from '../components/TabSelector/TabSelector';
import CalloutRespond from '../components/callouts/CalloutRespond';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalloutInformationTab from '../components/callouts/CalloutInformationTab';
import CalloutLogTab from '../components/callouts/CalloutLogTab';
import CalloutPersonnelTab from '../components/callouts/CalloutPersonnelTab';
import { tabItem } from '../types/tabItem';
import LogInput from '../components/callouts/LogInput';
import { callout, calloutResponseBadge } from '../types/callout';
import { apiGetCallout, apiPostCalloutLog, apiRespondToCallout } from '../remote/api';
import ActivityModal from '../components/modals/ActivityModal';
import msarEventEmitter from '../utility/msarEventEmitter';

const Page = () => {

    const { id, title, type } = useLocalSearchParams<{ id: string, title: string, type?: string }>();
    const [headerTitle, setHeaderTitle] = useState(title);
    const safeAreaInsets = useSafeAreaInsets();
    const scrollViewRef = useRef(null);

    const translateY = useSharedValue(600);
    const opacity = useSharedValue(0);

    const [modalVisible, setModalVisible] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState('');
    let defaultTab: number = 0;
    if (type != null) {
        if ( type === 'log') {
            defaultTab = 1;
        }
    }
    const [currentTab, setCurrentTab] = useState(defaultTab);
    const [callout, setCallout] = useState<callout>(null);
    const [logBadge, setLogBadge] = useState(null);
    const [personnelBadge, setPersonnelBadge] = useState(null);
    const [calloutTimestamp, setCalloutTimestamp] = useState<Date>(null);

    const [logMessageText, setLogMessageText] = useState('');
    const [isActive, setIsActive] = useState(false);

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
        msarEventEmitter.on('logLoaded', logLoaded);

        getCallout();

        return () => {
            msarEventEmitter.off('refreshCallout', refreshReceived);
            msarEventEmitter.off('logLoaded', logLoaded);
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

    const refreshReceived = data => {
        getCallout();
    }

    const logLoaded = data => {
        if (currentTab === 1) {
            setTimeout(scrollToBottom, 500);
        }
    }

    const scrollToBottom = () => {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }

    const getCallout = async () => {
        console.log(id);
        const idInt: number = parseInt(id);
        setSpinnerMessage("Loading Callout...");
        setShowSpinner(true);
        const response = await apiGetCallout(idInt);
        //console.log(JSON.stringify(response));
        setShowSpinner(false);
        //if it's a callout
        setCallout(response);
        //else
        //show error
    }

    const tabChanged = (index: number) => {
        setCurrentTab(index);
    }

    const respondToCallout = () => {
        translateY.value = withSpring(0 - safeAreaInsets.bottom, { damping: 20, stiffness: 100 });
        opacity.value = withTiming(0.8, { duration: 500 });
        setModalVisible(true);
    }

    const cancelRespondModal = () => {
        setModalVisible(false);
        translateY.value = withTiming(600, {
            duration: 500, // Adjust the duration as needed
        });
        opacity.value = withTiming(0, { duration: 500 });
    }

    const responseSelected = (response: responseType) => {
        console.log(textForResponseType(response));
        submitCalloutResponse(textForResponseType(response));
        cancelRespondModal();
    }

    const submitCalloutResponse = async (responseString: string) => {

        const idInt: number = parseInt(id);
        setSpinnerMessage("Submitting Response...");
        setShowSpinner(true);
        const response = await apiRespondToCallout(idInt, responseString);
        setShowSpinner(false);
        msarEventEmitter.emit('refreshCallout', { id: idInt });
    }

    const onLogMessageTextChanged = (text: string) => {
        setLogMessageText(text);
    }

    const submitLogMessage = async () => {
        const idInt: number = parseInt(id);
        const logMessage: string = logMessageText;
        setLogMessageText('');
        setShowSpinner(true);
        const response = await apiPostCalloutLog(idInt, logMessage);
        setShowSpinner(false);

        msarEventEmitter.emit('refreshCallout', { id: idInt });
        msarEventEmitter.emit('refreshLog', { id: idInt });
    }

    const trayAnimatedStyle = useAnimatedStyle(() => {

        return {
            transform: [{ translateY: translateY.value }],
        };
    });

    const modalAnimatedStyle = useAnimatedStyle(() => {

        return {
            opacity: opacity.value
        };
    });


    return (
        <>
            <SafeAreaView style={styles.container}>
                <Header title={headerTitle} backButton={true} timestamp={calloutTimestamp} />
                {callout &&
                    <>
                        <TabSelector tabs={tabs} selected={currentTab} onTabChange={tabChanged} />
                        <View style={styles.contentContainer}>
                            <ScrollView ref={scrollViewRef} style={styles.scrollView}>
                                {currentTab === 0 &&
                                    <CalloutInformationTab
                                        callout={callout} />
                                }
                                {currentTab === 1 &&
                                    <CalloutLogTab
                                        callout={callout} />
                                }
                                {currentTab === 2 &&
                                    <CalloutPersonnelTab
                                        callout={callout} />
                                }
                            </ScrollView>
                            {currentTab === 0 && isActive &&
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={[elements.capsuleButton, styles.respondCalloutButton]}
                                    onPress={() => respondToCallout()}>
                                    <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>Respond</Text>
                                </TouchableOpacity>
                            }
                            {currentTab === 1 && isActive &&
                                <LogInput
                                    onTextChange={onLogMessageTextChanged}
                                    text={logMessageText}
                                    onSendPress={submitLogMessage}
                                    onPhotoPress={() => console.log('photo')} />
                            }
                        </View>
                    </>
                }
            </SafeAreaView>
            <Animated.View style={[styles.respondTray, trayAnimatedStyle]}>
                <View style={{ flex: 1 }} />
                <CalloutRespond onCancel={cancelRespondModal} onSelect={responseSelected} />
            </Animated.View>
            {modalVisible &&
                <Animated.View style={[styles.modalBackground, modalAnimatedStyle]}>
                    <TouchableOpacity onPress={cancelRespondModal} style={{ flex: 1 }} />
                </Animated.View>
            }
            {showSpinner &&
                <ActivityModal message={spinnerMessage} />
            }
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
    respondTray: {
        zIndex: 100,
        margin: 0,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    },
    modalBackground: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.black
    }
})

export default Page;