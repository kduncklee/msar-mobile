import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, ScrollView, TouchableOpacity, Text, View, KeyboardAvoidingView } from 'react-native';
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Header from '../../components/Header';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import CalloutLogTab from '../../components/callouts/CalloutLogTab';
import LogInput from '../../components/callouts/LogInput';
import { apiGetChatLog, apiPostChatLog } from '../../remote/api';

const useChatQuery = () => {
    return useQuery({
        queryKey: ['chat'],
        queryFn: () => apiGetChatLog()
    })
}

const Page = () => {

    const scrollViewRef = useRef(null);
    const [logMessageText, setLogMessageText] = useState('');
    const queryClient = useQueryClient()
    const chatQuery = useChatQuery();
    const logList = chatQuery.data?.results;

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }
    }, []);

    const refreshChat = () => {
        queryClient.invalidateQueries("chat");
    }

    const onLogMessageTextChanged = (text: string) => {
        setLogMessageText(text);
    }

    const submitLogMessage = async () => {
        const logMessage: string = logMessageText;
        setLogMessageText('');
        const response = await apiPostChatLog(logMessage);
        refreshChat();
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <Header title={"Announcements"} backButton={true} rightButton={true} />
                        <KeyboardAvoidingView
                                style={styles.contentContainer}
                                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Adjust the offset as needed
                            >
                        <View style={styles.contentContainer}>
                            {!!logList && <>
                                <ScrollView ref={scrollViewRef}
                                    style={styles.scrollView}
                                    onContentSizeChange={() =>
                                        {scrollViewRef.current?.scrollToEnd()}}>
                                    <CalloutLogTab  logList={logList} />
                                </ScrollView>
                                <LogInput
                                    onTextChange={onLogMessageTextChanged}
                                    text={logMessageText}
                                    onSendPress={submitLogMessage}
                                    onPhotoPress={() => console.log('photo')} />
                            </>}
                        </View>
                        </KeyboardAvoidingView>
            </SafeAreaView>
        </>
    )
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
    }
})

export default Page;
