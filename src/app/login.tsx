import SmallButton from '@components/inputs/SmallButton';
import ActivityModal from '@components/modals/ActivityModal';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { useStore } from '@tanstack/react-form';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Keyboard, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { z } from 'zod';
import KeyboardAvoidingCustomView from '@/components/KeyboardAvoidingCustomView';
import { useAppForm } from '@/hooks/form';
import useAuth from '@/hooks/useAuth';
import { logo_for_server, server_choices } from '@/remote/api';

function Page() {
  const scrollViewRef = useRef(null);
  const [showSpinner, setShowSpinner] = useState(false);
  const { login } = useAuth();
  let topMargin = 0;

  const baseSchema = z.object({
    username: z.string().min(1, 'Username is required.'),
    password: z.string().min(1, 'Password is required.'),
  });

  const schema = z.union([
    z.object({
      server: z.literal(''),
      custom_server: z.string().startsWith('http', 'Must start with http or https').url('Malformed URL'),
    }),
    z.object({ server: z.string().min(1), custom_server: z.string() }),
  ]).and(baseSchema);

  const form = useAppForm({
    defaultValues: {
      username: '',
      password: '',
      server: server_choices[0].value,
      custom_server: '',
    } as z.infer<typeof schema>,
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
  const serverSelected = useStore(form.store, state => state.values.server);
  const use_custom_server = !serverSelected;

  if (Platform.OS === 'ios') {
    StatusBar.setBarStyle('dark-content');
  }
  else if (Platform.OS === 'android') {
    StatusBar.setBackgroundColor(colors.primaryBg);
    StatusBar.setBarStyle('light-content');
    topMargin = (StatusBar.currentHeight + 20);
  }

  useEffect(() => {
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
        <KeyboardAvoidingCustomView>
          <ScrollView
            style={styles.scrollView}
            ref={scrollViewRef}
          >
            <Image source={logo_for_server(serverSelected)} style={[styles.logoImage, { marginTop: topMargin }]} />
            <View style={[elements.tray, { padding: 20, margin: 20 }]}>
              <form.AppField
                name="server"
                children={field => (
                  <field.FormDropdownSelector
                    title="Team"
                    placeholder="Select a team"
                    options={server_choices}
                  />
                )}
              />
              {use_custom_server && (
                <form.AppField
                  name="custom_server"
                  children={field => (
                    <field.FormTextInput
                      title="Custom Server"
                    />
                  )}
                />
              )}
              <form.AppField
                name="username"
                children={field => (
                  <field.FormTextInput
                    title="Username"
                    icon="account-outline"
                  />
                )}
              />
              <form.AppField
                name="password"
                children={field => (
                  <field.FormTextInput
                    title="Password"
                    icon="lock-outline"
                    secureTextEntry
                    autoCorrect={false}
                    autoCapitalize="none"
                  />
                )}
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
        </KeyboardAvoidingCustomView>
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
