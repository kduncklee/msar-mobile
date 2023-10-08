import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, Touchable } from 'react-native';
import Header from '../components/Header';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router, useLocalSearchParams } from 'expo-router';
import { calloutType, responseType } from '../types/enums';
import { calloutSummary, colorForResponseType, textForResponseType, textForType } from '../types/calloutSummary';
import TabSelector from '../components/TabSelector/TabSelector';
import InformationTray from '../components/fields/InformationTray';
import InformationField from '../components/fields/InformationField';
import TextAreaField from '../components/fields/TextAreaField';
import LocationField from '../components/fields/LocationField';
import CalloutRespond from '../components/callouts/CalloutRespond';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring, Easing } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CalloutInformationTab from '../components/callouts/CalloutInformationTab';
import CalloutLogTab from '../components/callouts/CalloutLogTab';
import CalloutPersonnelTab from '../components/callouts/CalloutPersonnelTab';
import { tabItem } from '../types/tabItem';
import LogInput from '../components/callouts/LogInput';

const Page = () => {

    const params = useLocalSearchParams();
    const safeAreaInsets = useSafeAreaInsets();
    var calloutId: number = null;

    const translateY = useSharedValue(600);
    const opacity = useSharedValue(0);

    const [modalVisible, setModalVisible] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    const [logMessageText, setLogMessageText] = useState('');

    const tabs: tabItem[] = [
        {
            title: "Information"
        },
        {
            title: "Log",
            badge: 64,
            badgeColor: colors.red
        },
        {
            title: "Personnel",
            badge: 4,
            badgeColor: colors.green
        }
    ]

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }
    }, []);

    let summary: calloutSummary = {
        id: 1,
        subject: "Missing Hiker",
        type: calloutType.SEARCH,
        responder_count: 3,
        timestamp: new Date(),
        location: {
            coordinates: {
                latitude: "34.09454155005811",
                longitude: "-118.94362251701045"
            }
        },
        log_count: 12,
        my_response: responseType.TEN8
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

        cancelRespondModal();
    }

    const onLogMessageTextChanged = (text: string) => {
        setLogMessageText(text);
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
                <Header title={summary.subject} backButton={true} timestamp={new Date()} />
                <TabSelector tabs={tabs} onTabChange={tabChanged} />
                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollView}>
                        {currentTab === 0 &&
                            <CalloutInformationTab
                                summary={summary} />
                        }
                        {currentTab === 1 &&
                            <CalloutLogTab
                                summary={summary} />
                        }
                        {currentTab === 2 &&
                            <CalloutPersonnelTab
                                summary={summary} />
                        }
                    </ScrollView>
                    {currentTab === 0 &&
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={[elements.capsuleButton, styles.respondCalloutButton]}
                            onPress={() => respondToCallout()}>
                            <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>Respond</Text>
                        </TouchableOpacity>
                    }
                    {currentTab === 1 &&
                        <LogInput
                            onTextChange={onLogMessageTextChanged}
                            text={logMessageText}
                            onSendPress={ () => console.log('send')}
                            onPhotoPress={ () => console.log('photo')} />
                    }
                </View>
            </SafeAreaView>
            <Animated.View style={[styles.respondTray, trayAnimatedStyle]}>
                <View style={{ flex: 1}} />
                <CalloutRespond onCancel={cancelRespondModal} onSelect={responseSelected} />
            </Animated.View>
            {modalVisible &&
                <Animated.View style={[styles.modalBackground, modalAnimatedStyle]}>
                    <TouchableOpacity onPress={cancelRespondModal} style={{ flex: 1 }} />
                </Animated.View>
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