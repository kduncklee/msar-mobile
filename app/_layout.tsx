import { Stack } from 'expo-router';

const Layout = () => {


    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen
                name="settings"
                options={{ presentation: 'modal'}} />
        </Stack>
    );
}

export default Layout;