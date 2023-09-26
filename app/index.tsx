import { useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import Header from '../components/Header';
import CalloutCell from '../components/callouts/CalloutCell';
import { calloutSummary } from '../types/calloutSummary';
import { calloutType, responseType } from '../types/enums';
import colors from '../styles/colors';
import TabSelector from '../components/TabSelector/TabSelector';
import { elements } from '../styles/elements';
import { router } from 'expo-router';

const Page = () => {

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
            description: "1234 Main Street"
        },
        log_count: 12,
        my_response: responseType.TEN8
    }


    const tabChanged = (index: number) => {
        console.log(index);
    }

    const createCallout = () => {
        router.push({ pathname: 'edit-callout', params: {} })
    }

    const viewCallout = (calloutSummary: calloutSummary) => {
        router.push({ pathname: 'view-callout', params: { callout: calloutSummary.id } })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Callouts" />
            <TabSelector tabs={['Active', 'Archived']} onTabChange={tabChanged} />
            <View style={styles.contentContainer}>
                <ScrollView style={styles.scrollView}>
                    <CalloutCell summary={summary} onPress={viewCallout} />
                    <CalloutCell summary={summary} onPress={viewCallout} />
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