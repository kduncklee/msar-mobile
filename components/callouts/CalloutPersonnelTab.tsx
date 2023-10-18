import React, { StyleSheet } from 'react-native';
import { View, Text } from 'react-native';
import { calloutSummary } from '../../types/calloutSummary';
import { calloutType, responseType } from '../../types/enums';
import InformationTray from '../fields/InformationTray';
import PersonnelField from '../fields/PersonnelField';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import { textForResponseType, colorForResponseType, textForType } from '../../types/calloutSummary';
import { opResponse } from '../../types/operationalPeriod';
import { callout } from '../../types/callout';

type CalloutPersonnelTabProps = {
    callout: callout
}



const CalloutPersonnelTab = ({ callout }: CalloutPersonnelTabProps) => {

    var responses: opResponse[] = [];
    if (callout.operational_periods[0]) {
        responses = callout.operational_periods[0].responses;
    }

    const filterByTen19: opResponse[] = responses.filter((opResponse) => {
        return opResponse.response === responseType.TEN19;
    });

    const filterByTen8: opResponse[] = responses.filter((opResponse) => {
        return opResponse.response === responseType.TEN8;
    });

    const filterByTen7: opResponse[] = responses.filter((opResponse) => {
        return opResponse.response === responseType.TEN7;
    });

    return (
        <>
            {filterByTen19.length == 0 && filterByTen8.length == 0 && filterByTen7.length == 0 &&
                <Text style={[elements.mediumText, { margin: 20, textAlign: "center", color: colors.grayText }]}>No Responses</Text>
            }
            {filterByTen19.length > 0 &&
                <InformationTray
                    title={'10-19'}
                    titleBarColor={colors.secondaryYellow}
                    titleTextColor={colors.black}
                    count={filterByTen19.length}>
                    <View style={{ marginTop: 8 }} />
                    {
                        filterByTen19.map((opResponse: opResponse, index: number) => {

                            const addDiv: boolean = (index < filterByTen19.length - 1);

                            return (
                                <>
                                    <PersonnelField key={index} opResponse={opResponse} />
                                    {addDiv &&
                                        <View style={elements.informationDiv} />
                                    }
                                </>
                            )
                        })
                    }
                    <View style={{ marginBottom: 8 }} />
                </InformationTray>
            }
            {filterByTen8.length > 0 &&
                <InformationTray
                    title={'10-8'}
                    titleBarColor={colors.green}
                    titleTextColor={colors.primaryText}
                    count={filterByTen8.length}>
                    <View style={{ marginTop: 8 }} />
                    {
                        filterByTen8.map((opResponse: opResponse, index: number) => {

                            const addDiv: boolean = (index < filterByTen8.length - 1);

                            return (
                                <>
                                    <PersonnelField key={index} opResponse={opResponse} />
                                    {addDiv &&
                                        <View style={elements.informationDiv} />
                                    }
                                </>
                            )
                        })
                    }
                    <View style={{ marginBottom: 8 }} />
                </InformationTray>
            }
            {filterByTen7.length > 0 &&
                <InformationTray
                    title={'10-7'}
                    titleBarColor={colors.red}
                    titleTextColor={colors.primaryText}
                    count={filterByTen7.length}>
                    <View style={{ marginTop: 8 }} />
                    {
                        filterByTen7.map((opResponse: opResponse, index: number) => {

                            const addDiv: boolean = (index < filterByTen7.length - 1);

                            return (
                                <>
                                    <PersonnelField key={index} opResponse={opResponse} />
                                    {addDiv &&
                                        <View style={elements.informationDiv} />
                                    }
                                </>
                            )
                        })
                    }
                    <View style={{ marginBottom: 8 }} />
                </InformationTray>
            }
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