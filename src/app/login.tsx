import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { router } from 'expo-router';
import FormTextInput from '@components/inputs/FormTextInput';
import SmallButton from '@components/inputs/SmallButton';
import ActivityModal from '@components/modals/ActivityModal';
import { useForm } from '@tanstack/react-form';
import { zodValidator } from '@tanstack/zod-form-adapter';
import { z } from 'zod';
import useAuth from '@/hooks/useAuth';
import { server_choices } from '@/remote/api';
import FormDropdownSelector from '@/components/inputs/FormDropdownSelector';

function Page() {
  const [topMargin, setTopMargin] = useState(0);
  const scrollViewRef = useRef(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const { login } = useAuth();

  const baseSchema = z.object({
    username: z.string().min(1, 'Username is required.'),
    password: z.string().min(1, 'Password is required.'),
  });

  const schema = z.union([
    z.object({
      server: z.literal(''),
      custom_server: z.string().startsWith('http', 'Must start with http or https').url('Malformed URL'),
    }),
    z.object({ server: z.string().min(1) }),
  ]).and(baseSchema);

  const form = useForm({
    defaultValues: {
      username: '',
      password: '',
      server: server_choices[0].value,
      custom_server: '',
    },
    validatorAdapter: zodValidator(),
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      setShowSpinner(true);
      const server = value.server || value.custom_server;
      const errorString = await login(value.username, value.password, server);
      setShowSpinner(false);
      if (errorString) {
        Alert.alert('Problem logging in', errorString, [
          { text: 'OK' },
        ]);
      }
      else {
        router.replace('/');
      }
    },
  });
  const use_custom_server = !form.useStore(state => state.values.server);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('dark-content');
      setTopMargin(0);
    }
    else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primaryBg);
      StatusBar.setBarStyle('light-content');
      setTopMargin(StatusBar.currentHeight + 20);
    }

    const _keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        if (scrollViewRef && scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      },
    );
  }, []);

  return (
    <>
      <Image source={require('@assets/background.png')} style={styles.backgroundImage} />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.contentContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // Adjust the offset as needed
        >
          <ScrollView
            style={styles.scrollView}
            ref={scrollViewRef}
          >
            <Image source={require('@assets/msar_logo.png')} style={[styles.logoImage, { marginTop: topMargin }]} />
            <View style={[elements.tray, { padding: 20, margin: 20 }]}>
              <FormDropdownSelector
                form={form}
                name="server"
                title="Team"
                placeholder="Select a team"
                options={server_choices}
              />
              {use_custom_server && (
                <FormTextInput
                  form={form}
                  name="custom_server"
                  title="Custom Server"
                />
              )}
              <FormTextInput
                form={form}
                name="username"
                title="Username"
                icon={require('@assets/icons/user.png')}
              />
              <FormTextInput
                form={form}
                name="password"
                title="Password"
                icon={require('@assets/icons/lock.png')}
                secureTextEntry
                autoCorrect={false}
                autoCapitalize="none"
              />
              <View style={styles.buttonTray}>
                <SmallButton
                  title="Login"
                  backgroundColor={colors.yellow}
                  textColor={colors.black}
                  onPress={form.handleSubmit}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {showSpinner
      && <ActivityModal message="Logging in..." />}
    </>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: colors.clear,
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 10,
  },
  logoImage: {
    margin: 20,
    alignSelf: 'center',
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  buttonTray: {
    marginTop: 20,
    width: 120,
    alignSelf: 'flex-end',
  },
});

export default Page;
