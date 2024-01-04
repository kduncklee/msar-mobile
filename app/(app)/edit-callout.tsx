import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, KeyboardAvoidingView, Alert } from 'react-native';
import Header from '../../components/Header';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';
import { calloutStatus, calloutType, stringToCalloutType } from '../../types/enums';
import DropdownSelector from '../../components/inputs/DropdownSelector';
import FormTextInput from '../../components/inputs/FormTextInput';
import FormTextArea from '../../components/inputs/FormTextArea';
import FormCheckbox from '../../components/inputs/FormCheckbox';
import DropdownMultiselect from '../../components/inputs/DropdownMultiselect';
import ActivityModal from '../../components/modals/ActivityModal';
import "../../storage/global"
import { callout } from '../../types/callout';
import { apiCreateCallout, apiUpdateCallout, apiGetCallout } from '../../remote/api';
import * as notificationListHelper from "../../utility/notificationListHelper"
import { location, locationToString } from '../../types/location';
import msarEventEmitter from '../../utility/msarEventEmitter';

const Page = () => {

    const { id } = useLocalSearchParams<{ id: string }>();
    const [showSpinner, setShowSpinner] = useState(false);
    const [spinnerMessage, setSpinnerMessage] = useState('');
    const [title, setTitle] = useState<string>(null);
    const [operationType, setOperationType] = useState<calloutType>(null);
    const [subject, setSubject] = useState<string>(null);
    const [subjectContact, setSubjectContact] = useState<string>(null);
    const [informant, setInformant] = useState<string>(null);
    const [informantContact, setInformantContact] = useState<string>(null);
    const [radioFrequency, setRadioFrequency] = useState<string>(null);
    const [circumstances, setCircumstances] = useState<string>(null);
    const [notificationsMade, setNotificationsMade] = useState<string[]>([]);
    const [ten22, setTen22] = useState(false);
    const [archived, setArchived] = useState(false);
    const [resolutionNotes, setResolutionNotes] = useState<string>(null);
    const [locationText, setLocationText] = useState('');
    const [locationDescText, setLocationDescText] = useState('');
    const [handlingUnit, setHandlingUnit] = useState<string>(null);
    const [existingData, setExistingData] = useState<callout>(null);
    const { location } = useGlobalSearchParams();
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

    if (id && typeof id === 'string') {
        headerTitle = "Update Callout";
    }

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }

        global.selectedLocation = null;

        if (id) {
            getCallout();
        }

    }, []);

    useEffect(() => {
        if (location) {
            router.back();
            setLocationText(`${location}`);
        }
    }, [location]);

    useEffect(() => {
        if (existingData) {
            populateFields();
        }
    }, [existingData]);

    const getCallout = async () => {

        const idInt: number = parseInt(id);
        setSpinnerMessage('Loading Callout...');
        setShowSpinner(true);
        const response = await apiGetCallout(idInt);
        console.log(response);
        setShowSpinner(false);
        //if it's a callout
        setExistingData(response);
        //else
        //show error
    }

    const populateFields = () => {

        setTitle(existingData.title);
        setOperationType(stringToCalloutType(existingData.operation_type));
        setLocationText(locationToString(existingData.location));
        setLocationDescText(existingData.location.text);
        global.selectedLocation = existingData.location;
        setSubject(existingData.subject);
        setSubjectContact(existingData.subject_contact);
        setInformant(existingData.informant);
        setInformantContact(existingData.informant_contact);
        setCircumstances(existingData.description);
        setRadioFrequency(existingData.radio_channel);
        setNotificationsMade(existingData.notifications_made);
        setHandlingUnit(existingData.handling_unit);
        if (existingData.status === calloutStatus.RESOLVED) {
            setTen22(true);
        }
        setResolutionNotes(existingData.resolution);

    }

    const createCalloutPressed = () => {

        var shouldShowConfirmation: boolean = false;
        var confirmationMessage = "Are you sure you want to mark this callout 10-22?"
        if (!existingData) {
            shouldShowConfirmation = ten22;
        } else {
            if (existingData.status === calloutStatus.RESOLVED && ten22 === false) {
                shouldShowConfirmation = true;
                confirmationMessage = "Are you sure you want to mark this callout Active?"
            } else if (existingData.status === calloutStatus.ACTIVE && ten22) {
                shouldShowConfirmation = true;
            }
        }

        if (shouldShowConfirmation) {
            Alert.alert('Confirm Status', confirmationMessage, [
                {
                    text: 'Yes',
                    onPress: () => {
                        if (!existingData) {
                            createCallout();
                        } else {
                            updateCallout();
                        }
                    },
                    style: "destructive"
                },
                {
                    text: 'No',
                    style: "cancel"
                }
            ]);
        } else {
            if (!existingData) {
                createCallout();
            } else {
                updateCallout();
            }
        }
    }

    const generateCallout = (): callout => {

        var locationObject: location = {
            text: locationText
        }
        if (global.selectedLocation) {
            locationObject = global.selectedLocation;
        }

        if (locationDescText) {
            locationObject.text = locationDescText;
        }

        //console.log("Location: " + JSON.stringify(locationObject));

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
            location: locationObject,
            handling_unit: handlingUnit
        }

        if (archived) {
            callout.status = calloutStatus.ARCHIVED;
        }

        //console.log("generated Callout: " + JSON.stringify(callout));

        return callout;
    }

    const createCallout = async () => {
        if (!validateFields()) {
            return;
        }

        setSpinnerMessage("Creating Callout...");
        setShowSpinner(true);
        const response: any = await apiCreateCallout(generateCallout());
        setShowSpinner(false);
        if (typeof response.id === 'number' && typeof response.title === 'string') {
            msarEventEmitter.emit('refreshCallout',{});
            router.replace({ pathname: 'view-callout', params: { id: response.id.toString(), title: response.title } })
        }

        console.log(response);

    }

    const updateCallout = async () => {
        if (!validateFields()) {
            return;
        }

        const idInt: number = parseInt(id);

        setSpinnerMessage("Updating Callout...");
        setShowSpinner(true);
        const response: any = await apiUpdateCallout(idInt, generateCallout());
        setShowSpinner(false);
        if (typeof response.id === 'number' && typeof response.title === 'string') {
            msarEventEmitter.emit('refreshCallout',{id: idInt});
            router.back();
        }

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

    const locationDescChanged = (text: string) => {
        setLocationDescText(text);
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

        setNotificationsMade(notificationListHelper.indicesToLabels(items));
    }

    const on1022Toggle = (checked: boolean) => {
        setTen22(checked);
        if (!checked) {
            setResolutionNotes('');
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
                            selectedValue={`${callOutTypeSelect.findIndex(item => item.enum === operationType)}`}
                            onSelect={calloutTypeSelected} />
                        <FormTextInput
                            title={'Location'}
                            rightButton={require('../../assets/icons/map.png')}
                            onRightPress={locationButtonPressed}
                            onChange={locationChanged}
                            placeholder='Location'
                            value={locationText} />
                        <FormTextInput
                            onChange={locationDescChanged}
                            placeholder='Location Description'
                            value={locationDescText} />
                        <FormTextInput
                            title={'Subject'}
                            onChange={subjectChanged}
                            placeholder='Subject'
                            value={subject} />
                        <FormTextInput
                            icon={require('../../assets/icons/phone.png')}
                            onChange={subjectContactChanged}
                            placeholder='Subject Contact'
                            value={subjectContact} />
                        <FormTextInput
                            title={'Informant'}
                            onChange={informantChanged}
                            placeholder='Informant'
                            value={informant} />
                        <FormTextInput
                            icon={require('../../assets/icons/phone.png')}
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
                            selectedValue={`${radioFrequencySelect.findIndex(item => item.label === radioFrequency)}`}
                            onSelect={radioFreqSelected} />
                        <DropdownMultiselect
                            title={'Notifications Made'}
                            options={notificationListHelper.list}
                            placeholder={'Select Notifications'}
                            selectedValues={notificationListHelper.labelsToIndices(notificationsMade)}
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
                        {ten22 &&
                            <FormCheckbox
                            title={'Archive'}
                            checked={archived}
                            onToggle={() => setArchived(true)} />
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
