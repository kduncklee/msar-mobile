import { View, StyleSheet } from 'react-native';
import { textForCalloutStatus } from '../../types/calloutSummary';
import InformationTray from '../fields/InformationTray';
import InformationField from '../fields/InformationField';
import TextAreaField from '../fields/TextAreaField';
import LocationField from '../fields/LocationField';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import { textForResponseType, colorForResponseType, textForType } from '../../types/calloutSummary';
import { getFullTimeString } from '../../utility/dateHelper';
import { makePhoneCall } from '../../utility/phone';
import { callout } from '../../types/callout';
import { router } from 'expo-router';
import { calloutStatus } from '../../types/enums';

type CalloutInformationTabProps = {
    callout: callout
}

const CalloutInformationTab = ({ callout }: CalloutInformationTabProps) => {

    const showEdit: boolean = (callout.status === calloutStatus.ARCHIVED) ? false : true;

    const editDetailsPressed = () => {
        console.log('edit details');
        router.push({ pathname: 'edit-callout', params: { id: callout.id.toString() } })
    }


    return (
        <>
            <InformationTray
                title={'Details'}
                titleBarColor={colors.red}
                editButton={showEdit}
                onEditPress={editDetailsPressed}>
                <View style={{ marginTop: 8 }} />
                {!!callout.created_at &&
                    <InformationField
                        title={'Time of Dispatch'}
                        value={getFullTimeString(callout.created_at)} />
                }
                <View style={elements.informationDiv} />
                <InformationField
                    title={'Type'}
                    value={textForType(callout.operation_type)} />
                <View style={elements.informationDiv} />
                {!!callout.subject &&
                    <InformationField
                        title={'Subject'}
                        value={callout.subject} />
                }
                {!!callout.subject_contact &&
                    <InformationField
                        value={callout.subject_contact}
                        icon={require('../../assets/icons/phone_yellow.png')}
                        onIconPress={() => makePhoneCall(callout.subject_contact)} />
                }
                {(!!callout.subject || !!callout.subject_contact) &&
                    <View style={elements.informationDiv} />
                }
                {!!callout.informant &&
                    <InformationField
                        title={'Informant'}
                        value={callout.informant} />
                }
                {!!callout.informant_contact &&
                    <InformationField
                        value={callout.informant_contact}
                        icon={require('../../assets/icons/phone_yellow.png')}
                        onIconPress={() => makePhoneCall(callout.informant_contact)} />
                }
                {(!!callout.informant || !!callout.informant_contact) &&
                    <View style={elements.informationDiv} />
                }
                {!!callout.radio_channel &&
                    <InformationField
                        title={'Tactical Talkgroup'}
                        value={callout.radio_channel} />
                }
                {!!callout.additional_radio_channels?.length &&
                    <InformationField
                        title={'Other Radio Channels'}
                        value={callout.additional_radio_channels.join(', ')} />
                }
                {!!callout.notifications_made?.length &&
                    <InformationField
                        title={'Notifications Made'}
                        value={callout.notifications_made.join(', ')} />
                }
                <View style={elements.informationDiv} />
                {!!callout.handling_unit &&
                    <InformationField
                        title={'Handling Unit / Tag #'}
                        value={callout.handling_unit} />
                }
                <View style={elements.informationDiv} />
                {!!callout.description &&
                    <TextAreaField
                        title={'Circumstances'}
                        value={callout.description}
                    />
                }
                <View style={{ height: 10 }} />
            </InformationTray>
            {!!callout.location &&
                <InformationTray
                    title={'Location'}
                    titleBarColor={colors.blue}
                    editButton={showEdit}
                    onEditPress={editDetailsPressed}>
                    <LocationField location={callout.location} />
                </InformationTray>
            }
            <InformationTray
                title={'Additional Information'}
                titleBarColor={colors.secondaryYellow}
                titleTextColor={colors.black}
                editButton={showEdit}
                onEditPress={editDetailsPressed}>
                <View style={{ marginTop: 8 }} />
                <InformationField
                    title={'Status'}
                    value={textForCalloutStatus(callout.status)} />
                <View style={elements.informationDiv} />
                {!!callout.my_response &&
                    <>
                        <InformationField
                            title={'My Response'}
                            value={textForResponseType(callout.my_response)}
                            valueColor={colorForResponseType(callout.my_response)} />

                        <View style={elements.informationDiv} />
                    </>
                }
                {!!callout.created_by &&
                    <InformationField
                        title={'Callout Created by'}
                        value={callout.created_by.full_name} />
                }
                <View style={{ height: 10 }} />
            </InformationTray>

            <View style={{ height: 100 }} />
        </>
    );
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

export default CalloutInformationTab;
