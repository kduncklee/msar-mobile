import { Redirect, Stack } from 'expo-router';
import "../../storage/global";

export default function AppLayout() {

  if (!global.currentCredentials?.token) {
    return <Redirect href="/login" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="settings"
                options={{ presentation: 'modal'}} />
        </Stack>
  );
}
