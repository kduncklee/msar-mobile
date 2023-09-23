import { useState } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, KeyboardAvoidingView } from 'react-native';
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

const Page = () => {

    const params = useLocalSearchParams();
    var calloutId: number = null;

    let summary: calloutSummary = {
        id: 1,
        subject: "Missing Hiker",
        type: calloutType.SEARCH,
        responder_count: 3,
        timestamp: new Date(),
        location: "1234 Main Street",
        log_count: 12,
        my_response: responseType.TEN8
    }

    const tabChanged = (index: number) => {
        console.log(index);
    }

    const respondToCallout = () => {

    }

    const editDetailsPressed = () => {
        console.log('edit details');
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={summary.subject} backButton={true} timestamp={new Date()} />
            <TabSelector tabs={['Information', 'Log', 'Personnel']} onTabChange={tabChanged} />
            <View style={styles.contentContainer}>
                <ScrollView style={styles.scrollView}>
                    <InformationTray
                        title={'Details'}
                        titleBarColor={colors.red}
                        editButton={true}
                        onEditPress={editDetailsPressed}>
                        <View style={{ marginTop: 8 }} />
                        <InformationField
                            title={'Status'}
                            value={'Active'} />
                        <View style={elements.informationDiv} />
                        <InformationField
                            title={'My Response'}
                            value={textForResponseType(summary.my_response)}
                            valueColor={colorForResponseType(summary.my_response)} />
                        <View style={elements.informationDiv} />
                        <InformationField
                            title={'Type'}
                            value={textForType(summary.type)} />
                        <View style={elements.informationDiv} />
                        <InformationField
                            title={'Subject'}
                            value={summary.subject} />
                        <View style={elements.informationDiv} />
                        <InformationField
                            title={'Informant'}
                            value={'John Doe'} />
                        <InformationField
                            value={'310-555-1223'}
                            icon={require('../assets/icons/phone_yellow.png')}
                            onIconPress={() => console.log('pressed icon')} />
                        <View style={elements.informationDiv} />
                        <InformationField
                            title={'Radio Frequency'}
                            value={'Malibu Metro'} />
                        <View style={elements.informationDiv} />
                        <TextAreaField
                            title={'Circumstances'}
                            value={'This is a test of a multiline piece of text that is very long and will go on to more lines than just one.'}
                        />
                        <View style={{height: 10}} />
                    </InformationTray>
                    <InformationTray
                        title={'Location'}
                        titleBarColor={colors.blue}
                        editButton={true}
                        onEditPress={editDetailsPressed}>

                        </InformationTray>

                    <View style={{ height: 100 }} />
                </ScrollView>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[elements.capsuleButton, styles.createCalloutButton]}
                    onPress={() => respondToCallout()}>
                    <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>Respond</Text>
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