import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { stringToResponseType } from '../../types/enums';
import colors from '../../styles/colors';
import { logType } from '../../types/enums';
import { logEntry } from '../../types/logEntry';
import LogResponseField from '../fields/log/LogResponseField';
import LogMessageField from '../fields/log/LogMessageField';
import { callout } from '../../types/callout';
import LogSystemField from '../fields/log/LogUpdateField';
import msarEventEmitter from '../../utility/msarEventEmitter';
import * as Notifications from 'expo-notifications';

type CalloutLogTabProps = {
    callout: callout,
    logList: logEntry[]
}

const CalloutLogTab = ({ callout, logList }: CalloutLogTabProps) => {

    return (
        <>
            {
                logList.map((entry: logEntry, index: number) => {
                    switch (entry.type) {
                        case logType.RESPONSE:
                            return (<LogResponseField key={entry.id} member={entry.member} response={stringToResponseType(entry.update)} timestamp={entry.created_at} />);
                        case logType.SYSTEM:
                            return (<LogSystemField key={entry.id} member={entry.member} update={entry.update} timestamp={entry.created_at} />);
                        case logType.MESSAGE:
                            return (<LogMessageField key={entry.id} member={entry.member} message={entry.message} timestamp={entry.created_at} />);
                    }
                })
            }
            <View style={{ marginTop: 60 }} />
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

export default CalloutLogTab;
