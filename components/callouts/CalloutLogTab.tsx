import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, FlatList } from 'react-native';
import { useQueryClient, useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { stringToResponseType } from '../../types/enums';
import colors from '../../styles/colors';
import { logType } from '../../types/enums';
import { logEntriesFromInfiniteQueryData, logEntry, logEntryFromRespsonse } from '../../types/logEntry';
import LogResponseField from '../fields/log/LogResponseField';
import LogMessageField from '../fields/log/LogMessageField';
import LogSystemField from '../fields/log/LogUpdateField';
import TextAreaField from '../fields/TextAreaField';
import { storeLastRead } from 'storage/mmkv';


type CalloutLogTabProps = {
    id: number,
    useInfiniteQueryFn: any
}

const CalloutLogTab = ({id, useInfiniteQueryFn}: CalloutLogTabProps) => {
    const queryClient = useQueryClient()

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isLoading,
        isFetching,
        isFetchingNextPage,
        refetch,
        status,
    } = useInfiniteQueryFn();

    const logList: logEntry[] = logEntriesFromInfiniteQueryData(data);

    useEffect(() => {
        if (!isLoading && logList) {
            if (logList?.length) {
                storeLastRead(id, logList[0].id);
            } else {
                storeLastRead(id, 0);  // User looked at the empty log.
            }
        }
    }, [logList]);

    if (isLoading) {
        return (<TextAreaField value={'Loading...'} />);
    }

    const refreshList = () => {
        console.log('refresh');
        refetch();
    }

    const getMore = () => {
        console.log('more');
        if(!isFetching && hasNextPage) {
            fetchNextPage();
        }
    };

    return (
        <FlatList
                data={logList}
                renderItem={({item}) => {
                    switch (item.type) {
                        case logType.RESPONSE:
                            return (<LogResponseField key={item.id} member={item.member} response={stringToResponseType(item.update)} timestamp={item.created_at} />);
                        case logType.SYSTEM:
                            return (<LogSystemField key={item.id} member={item.member} update={item.update} timestamp={item.created_at} />);
                        case logType.MESSAGE:
                            return (<LogMessageField key={item.id} member={item.member}
                                message={item.message} timestamp={item.created_at}
                                status={item.status} id={item.id} callout_id={id} />);
                    }
                }}
                inverted
                onStartReached={() => console.log('start')}
                onEndReached={() => getMore() }
                onRefresh={() => refreshList() }
                refreshing={isFetching && !isFetchingNextPage}
                removeClippedSubviews={false}  // needed for text selection
        />
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
