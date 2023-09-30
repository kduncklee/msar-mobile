import React, { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { calloutSummary } from '../../types/calloutSummary';
import { calloutType, responseType } from '../../types/enums';
import InformationTray from '../fields/InformationTray';
import PersonnelField from '../fields/PersonnelField';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import { textForResponseType, colorForResponseType, textForType } from '../../types/calloutSummary';
import { personnel } from '../../types/personnel';

type CalloutPersonnelTabProps = {
    summary: calloutSummary
}

const personnelList: personnel[] = [
    {
        first_name: "Bob",
        last_name: "Jones",
        phone: "310-555-1212",
        response: responseType.TEN19
    },
    {
        first_name: "Fred",
        last_name: "Smith",
        phone: "310-555-1212",
        response: responseType.TEN19
    },
    {
        first_name: "James",
        last_name: "Turner",
        phone: "310-555-1212",
        response: responseType.TEN8,
    },
    {
        first_name: "George",
        last_name: "Hunt",
        phone: "310-555-1212",
        response: responseType.TEN8,
    },
    {
        first_name: "Michael",
        last_name: "Knight",
        phone: "310-555-1212",
        response: responseType.TEN7,
    },
    {
        first_name: "Pete",
        last_name: "Wilson",
        phone: "310-555-1212",
        response: responseType.TEN7,
    },

]

const CalloutPersonnelTab = ({ summary }: CalloutPersonnelTabProps) => {

    const filterByTen19: personnel[] = personnelList.filter((person) => {
        return person.response === responseType.TEN19;
    });

    const filterByTen8: personnel[] = personnelList.filter((person) => {
        return person.response === responseType.TEN8;
    });

    const filterByTen7: personnel[] = personnelList.filter((person) => {
        return person.response === responseType.TEN7;
    });

    return (
        <>
            <InformationTray
                title={'10-19'}
                titleBarColor={colors.secondaryYellow}
                titleTextColor={colors.black}
                count={filterByTen19.length}>
                <View style={{ marginTop: 8 }} />
                {
                    filterByTen19.map((person: personnel, index: number) => {

                        const addDiv: boolean = (index < filterByTen19.length - 1);

                        return (
                            <>
                                <PersonnelField key={index} personnel={person} />
                                {addDiv &&
                                    <View style={elements.informationDiv} />
                                }
                            </>
                        )
                    })
                }
            </InformationTray>
            <InformationTray
                title={'10-8'}
                titleBarColor={colors.green}
                titleTextColor={colors.primaryText}
                count={filterByTen8.length}>
                <View style={{ marginTop: 8 }} />
                {
                    filterByTen8.map((person: personnel, index: number) => {

                        const addDiv: boolean = (index < filterByTen8.length - 1);

                        return (
                            <>
                                <PersonnelField key={index} personnel={person} />
                                {addDiv &&
                                    <View style={elements.informationDiv} />
                                }
                            </>
                        )
                    })
                }
            </InformationTray>
            <InformationTray
                title={'10-7'}
                titleBarColor={colors.red}
                titleTextColor={colors.primaryText}
                count={filterByTen7.length}>
                <View style={{ marginTop: 8 }} />
                {
                    filterByTen7.map((person: personnel, index: number) => {

                        const addDiv: boolean = (index < filterByTen7.length - 1);

                        return (
                            <>
                                <PersonnelField key={index} personnel={person} />
                                {addDiv &&
                                    <View style={elements.informationDiv} />
                                }
                            </>
                        )
                    })
                }
            </InformationTray>
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

export default CalloutPersonnelTab;