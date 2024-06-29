import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import Header from '@components/Header';
import colors from '@styles/colors';
import CalloutLogTab from '@components/callouts/CalloutLogTab';
import LogInput from '@components/callouts/LogInput';
import { useChatLogInfiniteQuery, useChatLogMutation } from '@remote/api';

function Page() {
  const [logMessageText, setLogMessageText] = useState('');
  const chatLogMutation = useChatLogMutation();

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    }
    else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primaryBg);
    }
  }, []);

  const onLogMessageTextChanged = (text: string) => {
    setLogMessageText(text);
  };

  const submitLogMessage = async () => {
    const logMessage: string = logMessageText;
    chatLogMutation.mutate({ message: logMessage });
    setLogMessageText('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Announcements" backButton rightButton />
      <KeyboardAvoidingView
        style={styles.contentContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
      >
        <View style={styles.contentContainer}>
          <CalloutLogTab id={0} useInfiniteQueryFn={useChatLogInfiniteQuery} />
          <LogInput
            onTextChange={onLogMessageTextChanged}
            text={logMessageText}
            onSendPress={submitLogMessage}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 10,
  },
});

export default Page;
