import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View } from 'react-native';
import Header from '../components/Header';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router, useLocalSearchParams } from 'expo-router';

const Page = () => {
    const params = useLocalSearchParams();
    var calloutId: number = null;
    var headerTitle: string = "Create Callout";

    if (params.calloutId && typeof params.calloutId === 'string') {
        calloutId = parseInt(params.calloutId, 10);
        headerTitle = "Update Callout";
    }

    const createCallout = () => {

    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={headerTitle} backButton={true} timestamp={new Date()} />
            <View style={styles.contentContainer}>
        <ScrollView style={styles.scrollView}>
            <View style={{height: 100}} />
        </ScrollView>
        <TouchableOpacity
            activeOpacity={0.8}
            style={[elements.capsuleButton, styles.submitCalloutButton]}
            onPress={() => createCallout()}>
            <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>{headerTitle}</Text>
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
    submitCalloutButton: {
        margin: 20,
        height: 60,
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0
    }
});

export default Page;