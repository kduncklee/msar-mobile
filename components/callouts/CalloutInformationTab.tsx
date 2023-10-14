import React, { StyleSheet } from 'react-native';
import { View } from 'react-native';
import { calloutSummary } from '../../types/calloutSummary';
import { calloutType, responseType } from '../../types/enums';
import InformationTray from '../fields/InformationTray';
import InformationField from '../fields/InformationField';
import TextAreaField from '../fields/TextAreaField';
import LocationField from '../fields/LocationField';
import CalloutRespond from '../callouts/CalloutRespond';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import { textForResponseType, colorForResponseType, textForType } from '../../types/calloutSummary';
import { getFullTimeString } from '../../utility/dateHelper';
import { callout } from '../../types/callout';
import { stringToCalloutType, stringToResponseType } from '../../types/enums';

type CalloutInformationTabProps = {
    callout: callout
}

const CalloutInformationTab = ({ callout }: CalloutInformationTabProps) => {

    const editDetailsPressed = () => {
        console.log('edit details');
    }

    return (
        <>
            <InformationTray
                title={'Details'}
                titleBarColor={colors.red}
                editButton={true}
                onEditPress={editDetailsPressed}>
                <View style={{ marginTop: 8 }} />
                {callout.created_at &&
                    <InformationField
                        title={'Time of Dispatch'}
                        value={getFullTimeString(callout.created_at)} />
                }
                <View style={elements.informationDiv} />
                <InformationField
                    title={'Type'}
                    value={textForType(callout.operation_type)} />
                <View style={elements.informationDiv} />
                {callout.subject &&
                    <InformationField
                        title={'Subject'}
                        value={callout.subject} />
                }
                {callout.subject_contact &&
                    <InformationField
                        value={callout.subject_contact}
                        icon={require('../../assets/icons/phone_yellow.png')}
                        onIconPress={() => console.log('pressed icon')} />
                }
                {(callout.subject || callout.subject_contact) &&
                    <View style={elements.informationDiv} />
                }
                {callout.informant &&
                    <InformationField
                        title={'Informant'}
                        value={callout.informant} />
                }
                {callout.informant_contact &&
                    <InformationField
                        value={callout.informant_contact}
                        icon={require('../../assets/icons/phone_yellow.png')}
                        onIconPress={() => console.log('pressed icon')} />
                }
                {(callout.informant || callout.informant_contact) &&
                    <View style={elements.informationDiv} />
                }
                {callout.radio_channel &&
                    <InformationField
                        title={'Tactical Talkgroup'}
                        value={callout.radio_channel} />
                }
                {callout.notifications_made &&
                    <InformationField
                        title={'Notifications Made'}
                        value={'LAHS Desk, Fire'} />
                }
                <View style={elements.informationDiv} />
                {callout.handling_unit &&
                    <InformationField
                        title={'Handling Unit / Tag #'}
                        value={callout.handling_unit} />
                }
                <View style={elements.informationDiv} />
                {callout.description &&
                    <TextAreaField
                        title={'Circumstances'}
                        value={callout.description}
                    />
                }
                <View style={{ height: 10 }} />
            </InformationTray>
            {callout.location &&
                <InformationTray
                    title={'Location'}
                    titleBarColor={colors.blue}
                    editButton={true}
                    onEditPress={editDetailsPressed}>
                    <LocationField location={callout.location} />
                </InformationTray>
            }
            <InformationTray
                title={'Additional Information'}
                titleBarColor={colors.secondaryYellow}
                titleTextColor={colors.black}
                editButton={true}
                onEditPress={editDetailsPressed}>
                <View style={{ marginTop: 8 }} />
                <InformationField
                    title={'Status'}
                    value={'Active'} />
                <View style={elements.informationDiv} />
                {callout.my_response &&
                    <>
                        <InformationField
                            title={'My Response'}
                            value={textForResponseType(callout.my_response)}
                            valueColor={colorForResponseType(callout.my_response)} />

                        <View style={elements.informationDiv} />
                    </>
                }
                <InformationField
                    title={'Callout Created by'}
                    value={'Michael Johnson'} />
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