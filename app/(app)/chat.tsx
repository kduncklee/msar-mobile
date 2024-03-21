import { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, View, KeyboardAvoidingView } from 'react-native';
import Toast from 'react-native-root-toast';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Header from '../../components/Header';
import colors from '../../styles/colors';
import { elements } from '../../styles/elements';
import CalloutLogTab from '../../components/callouts/CalloutLogTab';
import LogInput from '../../components/callouts/LogInput';
import { apiPostChatLog, useChatLogInfiniteQuery } from '../../remote/api';

const Page = () => {

    const [logMessageText, setLogMessageText] = useState('');
    const queryClient = useQueryClient();
    const chatLogMutation = useMutation({
      mutationFn: apiPostChatLog,
      retry: 3,
    });

    useEffect(() => {
        if (Platform.OS === 'ios') {
            StatusBar.setBarStyle('light-content');
        } else if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(colors.primaryBg);
        }
    }, []);

    const refreshChat = () => {
        queryClient.invalidateQueries({ queryKey: ['chat'] });
    }

    const onLogMessageTextChanged = (text: string) => {
        setLogMessageText(text);
    }

    const submitLogMessage = async () => {
        const logMessage: string = logMessageText;
        setLogMessageText('');
        chatLogMutation.mutate(logMessage, {
          onSuccess: (data, error, variables, context) => {
            refreshChat();
          },
          onError: (error, variables, context) => {
            Toast.show(`Unable to send message: ${error.message}`, {
              duration: Toast.durations.LONG,
            });
          },
        });
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
                            <CalloutLogTab id={0} useInfiniteQueryFn={() => useChatLogInfiniteQuery()} />
                            <LogInput
                                    onTextChange={onLogMessageTextChanged}
                                    text={logMessageText}
                                    onSendPress={submitLogMessage}
                                    onPhotoPress={() => console.log('photo')} />
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
