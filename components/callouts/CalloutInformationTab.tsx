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

type CalloutInformationTabProps = {
    summary: calloutSummary
}

const CalloutInformationTab = ({ summary }: CalloutInformationTabProps) => {

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
                    icon={require('../../assets/icons/phone_yellow.png')}
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
                <View style={{ height: 10 }} />
            </InformationTray>
            <InformationTray
                title={'Location'}
                titleBarColor={colors.blue}
                editButton={true}
                onEditPress={editDetailsPressed}>
                <LocationField location={summary.location} />
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