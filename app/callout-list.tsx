import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import Header from '../components/Header';
import CalloutCell from '../components/callouts/CalloutCell';
import { calloutSummary, calloutSummaryFromResponse } from '../types/calloutSummary';
import colors from '../styles/colors';
import TabSelector from '../components/TabSelector/TabSelector';
import { elements } from '../styles/elements';
import { router } from 'expo-router';
import { apiGetCallouts } from '../remote/api';
import ActivityModal from '../components/modals/ActivityModal';
import { tabItem } from '../types/tabItem';
import '../storage/global';
import msarEventEmitter from '../utility/msarEventEmitter';

const Page = () => {

    const [showSpinner, setShowSpinner] = useState(false);
    const [activeCalloutList, setActiveCalloutList] = useState<calloutSummary[]>([]);
    const [archiveCount, setArchiveCount] = useState(null);

    const tabs: tabItem[] = [
        {
            title: "Active"
        },
        {
            title: "Archived",
            badge: archiveCount,
            badgeColor: colors.red
        }
    ]

    var status: string = "active";


    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }
        
        msarEventEmitter.on('refreshCallout',refreshReceived);
        loadCallouts();
        
        return () => {
            msarEventEmitter.off('refreshData',refreshReceived);
        }
    }, []);

    const refreshReceived = data => {
        loadCallouts();
    }

    const loadCallouts = async () => {
        setShowSpinner(true);
        const response: any = await apiGetCallouts(status);
        if (response.results) {
            const callouts: calloutSummary[] = [];
            response.results.forEach((result: any) => {
                // Perform operations on each result item here
                callouts.push(calloutSummaryFromResponse(result));
            });
            setActiveCalloutList(callouts);
            setShowSpinner(false);
        }
        //console.log(response);
    }

    const tabChanged = (index: number) => {

        status = "active&status=resolved";
        if (index === 1) {
            status = "archived";
        }

        loadCallouts();
    }

    const createCallout = () => {
        router.push({ pathname: 'edit-callout', params: {} })
    }

    const viewCallout = (calloutSummary: calloutSummary) => {
        router.push({ pathname: 'view-callout', params: { id: calloutSummary.id, title: calloutSummary.title } })
    }

    const settingsPressed = () => {
        router.push('/settings');
        console.log("settings");
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Header title="Callouts" rightButton={true} onRightPressed={() => settingsPressed()}/>
                <TabSelector tabs={tabs} onTabChange={tabChanged} />
                <View style={styles.contentContainer}>
                    <ScrollView style={styles.scrollView}>
                        {
                            activeCalloutList.map((summary: calloutSummary, index: number) => {

                                return (<CalloutCell key={summary.id} summary={summary} onPress={viewCallout} />)
                            })
                        }
                        <View style={{ height: 100 }} />
                    </ScrollView>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[elements.capsuleButton, styles.createCalloutButton]}
                        onPress={() => createCallout()}>
                        <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>Create Callout</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
            {showSpinner &&
                <ActivityModal message={"Loading Callouts..."} />
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
    createCalloutButton: {
        margin: 20,
        height: 60,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    }
})

export default Page;