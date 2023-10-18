import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responseType } from '../../types/enums';
import colors from '../../styles/colors';
import { logType } from '../../types/enums';
import { logEntry } from '../../types/logEntry';
import LogResponseField from '../fields/log/LogResponseField';
import { personnel } from '../../types/personnel';
import LogSelfMessageField from '../fields/log/LogSelfMessageField';
import { message } from '../../types/message';
import LogMessageField from '../fields/log/LogMessageField';
import { callout } from '../../types/callout';
import { apiGetCalloutLog } from '../../remote/api';

type CalloutLogTabProps = {
    callout: callout
}

const CalloutLogTab = ({ callout }: CalloutLogTabProps) => {

    useEffect(() => {
        getCalloutLog();
    },[]);


    const logList: logEntry[] = [
        {
            type: logType.RESPONSE,
            data: {
                first_name: "Bob",
                last_name: "Jones",
                phone: "310-555-1212",
                response: responseType.TEN19
            },
            timestamp: new Date()
        },
        {
            type: logType.MESSAGE_SELF,
            data: {
                author: {
                    first_name: "Bob",
                    last_name: "Jones",
                    phone: "310-555-1212",
                    response: responseType.TEN19
                },
                message: "I found him. assessing the situation. Will report back. also other stuff and things and even morex"
            },
            timestamp: new Date()
        },
        {
            type: logType.MESSAGE,
            data: {
                author: {
                    first_name: "Bob",
                    last_name: "Jones",
                    phone: "310-555-1212",
                    response: responseType.TEN8
                },
                message: "Ok. Standing by."
            },
            timestamp: new Date()
        }
    ];

    const getCalloutLog = async () => {
        const response = await apiGetCalloutLog(callout.id);

    }


    return (
        <>
            {
                logList.map((object: any, index: number) => {
                    switch (object.type) {
                        case logType.RESPONSE:
                            return (<LogResponseField key={index} personnel={object.data as personnel} timestamp={object.timestamp} />);
                        case logType.MESSAGE_SELF:
                            return (<LogSelfMessageField key={index} message={object.data as message} timestamp={object.timestamp} />);
                        case logType.MESSAGE:
                            return (<LogMessageField key={index} message={object.data} timestamp={object.timestamp} />);
                        default:
                            return (<Text key={index}>no</Text>);
                    }
                })
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

export default CalloutLogTab;