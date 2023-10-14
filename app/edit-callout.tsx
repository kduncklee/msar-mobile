import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import Header from '../components/Header';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import { calloutStatus, calloutType } from '../types/enums';
import DropdownSelector from '../components/inputs/DropdownSelector';
import FormTextInput from '../components/inputs/FormTextInput';
import FormTextArea from '../components/inputs/FormTextArea';
import FormCheckbox from '../components/inputs/FormCheckbox';
import DropdownMultiselect from '../components/inputs/DropdownMultiselect';
import ActivityModal from '../components/modals/ActivityModal';
import "../storage/global"
import { callout } from '../types/callout';
import { apiCreateCallout } from '../remote/api';

const Page = () => {

    const [showSpinner, setShowSpinner] = useState(false);
    const [title, setTitle] = useState<string>(null);
    const [operationType,setOperationType] = useState<calloutType>(null);
    const [subject, setSubject] = useState<string>(null);
    const [subjectContact, setSubjectContact] = useState<string>(null);
    const [informant, setInformant] = useState<string>(null);
    const [informantContact, setInformantContact] = useState<string>(null);
    const [radioFrequency, setRadioFrequency] = useState<string>(null);
    const [circumstances, setCircumstances] = useState<string>(null);
    const [notificationsMade, setNotificationsMade] = useState<string[]>([]);
    const [ten22, setTen22] = useState(false);
    const [resolutionNotes, setResolutionNotes] = useState<string>(null);
    const [locationText, setLocationText] = useState('');
    const [handlingUnit, setHandlingUnit] = useState<string>(null);

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

    const createCallout = async () => {
        console.log('create call out');
        if (!validateFields()) {
            return;
        }

        const callout: callout = {
            title: title,
            operation_type: operationType,
            description: circumstances,
            subject: subject,
            subject_contact: subjectContact,
            informant: informant,
            informant_contact: informantContact,
            radio_channel: radioFrequency,
            status: ten22 ? calloutStatus.RESOLVED : calloutStatus.ACTIVE,
            notifications_made: notificationsMade,
            resolution: resolutionNotes,
            location: global.selectedLocation,
            handling_unit: handlingUnit
        }

        console.log(callout);
        setShowSpinner(true);
        const response: any = await apiCreateCallout(callout);
        setShowSpinner(false);
        console.log(response);

    }

    const validateFields = (): boolean => {
        return true;
    }

    const titleChanged = (text: string) => {
        setTitle(text);
    }

    const calloutTypeSelected = (item: any) => {
        const opType = item.enum as calloutType;
        setOperationType(opType);
    }

    const locationChanged = (text: string) => {
        setLocationText(text);
    }

    const locationButtonPressed = () => {
        router.push({ pathname: 'edit-location', params: { locationDescription: locationText, location: '' } });
    }

    const subjectChanged = (text: string) => {
        setSubject(text);
    }

    const subjectContactChanged = (text: string) => {
        setSubjectContact(text);
    }

    const informantChanged = (text: string) => {
        setInformant(text);
    }

    const informantContactChanged = (text: string) => {
        setInformantContact(text);
    }

    const circumstancesChanged = (text: string) => {
        setCircumstances(text);
    }

    const radioFreqSelected = (item: any) => {
        setRadioFrequency(item.label);
    }

    const notificationsSelected = (items: string[]) => {

        const selectedLabels: string[] = [];

        items.forEach((value: string) => {
            const foundItem = notificationSelect.find(item => item.value === value);
            if (foundItem) {
                selectedLabels.push(foundItem.label);
            }
        });


        setNotificationsMade(selectedLabels);
    }

    const on1022Toggle = (checked: boolean) => {
        setTen22(checked);
        if (!checked) {
            //clear 10-22 reason
        }
    }

    const resolutionChanged = (text: string) => {
        setResolutionNotes(text);
    }

    const handlingUnitChanged = (text: string) => {
        setHandlingUnit(text);
    }

    return (
        <>
        <SafeAreaView style={styles.container}>
            <Header title={headerTitle} backButton={true} timestamp={new Date()} />
            <KeyboardAvoidingView
                style={styles.contentContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Adjust the offset as needed
            >
                <ScrollView style={styles.scrollView}>
                <FormTextInput
                        title={'Title'}
                        onChange={titleChanged}
                        placeholder='Title'
                        value={title} />
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
                        placeholder='Subject'
                        value={subject} />
                    <FormTextInput
                        icon={require('../assets/icons/phone.png')}
                        onChange={subjectContactChanged}
                        placeholder='Subject Contact'
                        value={subjectContact} />
                    <FormTextInput
                        title={'Informant'}
                        onChange={informantChanged}
                        placeholder='Informant'
                        value={informant} />
                    <FormTextInput
                        icon={require('../assets/icons/phone.png')}
                        onChange={informantContactChanged}
                        placeholder='Informant Contact'
                        value={informantContact} />
                    <FormTextArea
                        title={'Circumstances'}
                        height={100}
                        onChange={circumstancesChanged}
                        placeholder='Circumstances'
                        value={circumstances} />
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
                    <FormTextInput
                        title={'Handling Unit / Tag #'}
                        onChange={handlingUnitChanged}
                        placeholder='Handling Unit / Tag #'
                        value={handlingUnit} />
                    <FormCheckbox
                        title={'10-22'}
                        checked={ten22}
                        onToggle={on1022Toggle} />
                    {ten22 &&
                        <FormTextArea
                            height={100}
                            onChange={resolutionChanged}
                            placeholder='Resolution Notes'
                            value={resolutionNotes} />
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
        {showSpinner &&
            <ActivityModal message={"Creating Callout..."} />
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