import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { stringToResponseType } from '../../types/enums';
import colors from '../../styles/colors';
import { logType } from '../../types/enums';
import { logEntry } from '../../types/logEntry';
import LogResponseField from '../fields/log/LogResponseField';
import LogMessageField from '../fields/log/LogMessageField';
import { callout } from '../../types/callout';
import { apiGetCalloutLog } from '../../remote/api';
import LogSystemField from '../fields/log/LogUpdateField';
import msarEventEmitter from '../../utility/msarEventEmitter';
import * as Notifications from 'expo-notifications';

type CalloutLogTabProps = {
    callout: callout
}

const CalloutLogTab = ({ callout }: CalloutLogTabProps) => {

    const [logList, setLogList] = useState<logEntry[]>([]);
    const notificationListener = useRef<Notifications.Subscription>();

    useEffect(() => {

        msarEventEmitter.on('refreshLog', refreshReceived);

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            //setNotification(notification);
            if (notification?.request?.content?.data?.type === 'log' &&
                notification.request.content.data?.id === callout?.id) {
                console.log('update log!!!')
                getCalloutLog();
            }

        });

        getCalloutLog();

        return () => {
            msarEventEmitter.off('refreshLog', refreshReceived);
        }

    }, []);

    useEffect(() => {
        if (logList.length > 0) {
            msarEventEmitter.emit('logLoaded', {});
        }
    }, [logList]);


    const refreshReceived = data => {
        getCalloutLog();
    }

    const getCalloutLog = async () => {
        const response = await apiGetCalloutLog(callout.id);
        setLogList(response.results);
    }



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