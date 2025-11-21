import CalloutLogTab from '@components/callouts/CalloutLogTab';
import LogInput from '@components/callouts/LogInput';
import Header from '@components/Header';
import colors from '@styles/colors';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import KeyboardAvoidingCustomView from '@/components/KeyboardAvoidingCustomView';
import useStatusBarColor from '@/hooks/useStatusBarColor';
import { useChatLogMutation } from '@/remote/mutation';
import { useChatLogInfiniteQuery } from '@/remote/query';

function Page() {
  const [logMessageText, setLogMessageText] = useState('');
  const chatLogMutation = useChatLogMutation();
  useStatusBarColor();

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
      <Header title="Messages" backButton />
      <KeyboardAvoidingCustomView>
        <View style={styles.contentContainer}>
          <CalloutLogTab id={0} useInfiniteQueryFn={useChatLogInfiniteQuery} />
          <LogInput
            onTextChange={onLogMessageTextChanged}
            text={logMessageText}
            onSendPress={submitLogMessage}
          />
        </View>
      </KeyboardAvoidingCustomView>
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
