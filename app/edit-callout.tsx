import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import Header from '../components/Header';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import { calloutType } from '../types/enums';
import DropdownSelector from '../components/inputs/DropdownSelector';
import FormTextInput from '../components/inputs/FormTextInput';
import FormTextArea from '../components/inputs/FormTextArea';
import FormCheckbox from '../components/inputs/FormCheckbox';
import DropdownMultiselect from '../components/inputs/DropdownMultiselect';
import "../storage/global"

const Page = () => {


    const [ten22, setTen22] = useState(false);
    const [locationText, setLocationText] = useState('');

    const { callout } = useLocalSearchParams();
    const { location } = useGlobalSearchParams();
    var calloutId: number = null;
    var headerTitle: string = "Create Callout";

    let callOutTypeSelect = [
        { label: "Search", enum: calloutType.SEARCH, value: '0' },
        { label: "Rescue", enum: calloutType.RESCUE, value: '1' },
        { label: "Information Only", enum: calloutType.INFORMATION, value: '2' }
    ]

    let radioFrequencySelect = [
        { label: "LHS Metro", value: '0' },
        { label: "Malibu Metro", value: '1' },
        { label: "L-Tac", value: '2' },
        { label: "MRA MAL", value: '3' }
    ]

    let notificationSelect = [
        { label: "LAHS Desk", value: '0'},
        { label: "Fire", value: '1'},
        { label: "State Parks", value: '2'},
        { label: "NPS", value: '3'},
        { label: "MRCA", value: '4'},
        { label: "CHP", value: '5'},
        { label: "Drone Requested", value: '6'}
    ]

    if (callout && typeof callout === 'string') {
        //console.log(callout);
        calloutId = parseInt(callout, 10);
        headerTitle = "Update Callout";
    }

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }
        global.currentRoute = "edit-callout";
        global.selectedLocation = null;

    }, []);

    useEffect(() => {
        if (location) {
            router.back();
            setLocationText(`${location}`);
        }
    }, [location]);

    const createCalloutPressed = () => {

        if (ten22) {
            Alert.alert('Confirm 10-22', "Are you sure you want to mark this callout 10-22?", [
                {
                    text: 'Yes',
                    onPress: () => createCallout(),
                    style: "destructive"
                },
                {
                    text: 'No',
                    style: "cancel"
                }
            ]);
        } else {
            createCallout();
        }
    }

    const createCallout = () => {
        console.log('create call out');

    }

    const calloutTypeSelected = (item: any) => {
        console.log(item.enum);
    }

    const locationChanged = (text: string) => {
        setLocationText(text);
    }

    const locationButtonPressed = () => {
        router.push({ pathname: 'edit-location', params: { locationDescription: locationText, location: '' } });
    }

    const subjectChanged = (text: string) => {
        console.log(text);
    }

    const informantChanged = (text: string) => {
        console.log(text);
    }

    const informantContactChanged = (text: string) => {
        console.log(text);
    }

    const subjectContactChanged = (text: string) => {
        console.log(text);
    }

    const radioFreqSelected = (item: any) => {
        console.log(item.label);
    }

    const notificationsSelected = (item: any) => {
        console.log(item);
    }

    const on1022Toggle = (checked: boolean) => {
        setTen22(checked);
        if (!checked) {
            //clear 10-22 reason
        }
    }

    const ten22NoteChanged = (text: string) => {
        console.log(text);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={headerTitle} backButton={true} timestamp={new Date()} />
            <KeyboardAvoidingView
                style={styles.contentContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Adjust the offset as needed
            >
                <ScrollView style={styles.scrollView}>
                    <DropdownSelector
                        title={'Callout Type'}
                        options={callOutTypeSelect}
                        placeholder={'Select type'}
                        onSelect={calloutTypeSelected} />
                    <FormTextInput
                        title={'Location'}
                        rightButton={require('../assets/icons/map.png')}
                        onRightPress={locationButtonPressed}
                        onChange={locationChanged}
                        placeholder='Location'
                        value={locationText} />
                    <FormTextInput
                        title={'Subject'}
                        onChange={subjectChanged}
                        placeholder='Subject' />
                    <FormTextInput
                        icon={require('../assets/icons/phone.png')}
                        onChange={subjectContactChanged}
                        placeholder='Subject Contact' />
                    <FormTextInput
                        title={'Informant'}
                        onChange={informantChanged}
                        placeholder='Informant' />
                    <FormTextInput
                        icon={require('../assets/icons/phone.png')}
                        onChange={informantContactChanged}
                        placeholder='Informant Contact' />
                    <FormTextArea
                        title={'Circumstances'}
                        height={100}
                        onChange={informantContactChanged}
                        placeholder='Circumstances' />
                    <DropdownSelector
                        title={'Tactical Talkgroup'}
                        options={radioFrequencySelect}
                        placeholder={'Select Frequency'}
                        onSelect={radioFreqSelected} />
                    <DropdownMultiselect
                        title={'Notifications Made'}
                        options={notificationSelect}
                        placeholder={'Select Notifications'}
                        onSelect={notificationsSelected} />
                    <FormCheckbox
                        title={'10-22'}
                        checked={ten22}
                        onToggle={on1022Toggle} />
                    {ten22 &&
                        <FormTextArea
                            height={100}
                            onChange={informantContactChanged}
                            placeholder='10-22 Notes' />
                    }
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={[elements.capsuleButton, styles.submitCalloutButton]}
                        onPress={() => createCalloutPressed()}>
                        <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>{headerTitle}</Text>
                    </TouchableOpacity>
                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingTop: 0,
        paddingHorizontal: 20
    },
    submitCalloutButton: {
        marginVertical: 20,
        height: 60,
        left: 0,
        right: 0,
    }
});

export default Page;