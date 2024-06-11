import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Autolink, LatLngMatcher } from 'react-native-autolink';
import { elements } from '../../../styles/elements';
import colors from '../../../styles/colors'
import { getConditionalTimeString } from '../../../utility/dateHelper';
import { isUserSelf, user, userToString } from '../../../types/user';
import { logStatusType } from 'types/enums';
import { useCalloutLogMutation, useChatLogMutation } from 'remote/api';

type LogMessageFieldProps = {
    id: string,
    callout_id: number,
    member: user,
    message: string,
    status: string,
    timestamp: Date
}

const LogMessageField = ({ id, callout_id, member, message, status, timestamp }: LogMessageFieldProps) => {

    const logMutation = callout_id ? useCalloutLogMutation(callout_id) : useChatLogMutation();

    const isSelf: boolean = isUserSelf(member);
    const isError = status == logStatusType.ERROR;
    const isPublished = !status;

    const retrySending = async () => {
        logMutation.mutate({id, message});
    }

    const contents = (
        <>
            {!isSelf &&
                <Text style={[styles.messageAuthor]}>
                    {userToString(member)}
                </Text>
            }
            <Autolink style={[styles.messageText,{
                "textAlign": isSelf ? "right" : "left"
            }]}
            selectable={true}
            email phone matchers={[LatLngMatcher]}
            text={message}
            />
            <Text
                selectable={true}
                style={[styles.messageTimestamp,{
                "textAlign": isSelf ? "right" : "left",
                "color": isSelf ? colors.lightText : colors.grayText
            }]}>
                {isPublished ? getConditionalTimeString(timestamp) : status}
            </Text>
        </>
    );

    return (
        <View style={[elements.tray,
        isSelf ? styles.selfContainer : styles.container,
        {
            "backgroundColor": isPublished ?
                (isSelf ? colors.darkBlue : colors.secondaryBg) :
                (isError ? colors.red : colors.secondaryYellow)
        }
        ]}>
            {isError ?
                <TouchableOpacity onPress={retrySending}>
                    {contents}
                </TouchableOpacity> :
                contents
            }
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        marginVertical: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: "auto",
        marginLeft: 20,
        maxWidth: "80%"
    },
    selfContainer: {
        marginVertical: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginRight: 20,
        marginLeft: "auto",
        maxWidth: "80%"
    },
    messageText: {
        fontSize: 16,
        fontWeight: "400",
        color: colors.primaryText
    },

    messageAuthor: {
        marginVertical: 8,
        fontSize: 14,
        fontWeight: "400",
        textAlign: "left",
        color: colors.grayText
    },
    messageTimestamp: {
        marginTop: 8,
        fontSize: 12,
        fontWeight: "400",
        color: colors.grayText
    }
});

export default LogMessageField;
