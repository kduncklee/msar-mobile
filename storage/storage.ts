import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
        console.log("error storing to: " + key);
    }
};

const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        // error reading value
        console.log("error retrieving value: " + key)
        return null;
    }
};

const removeData = async (key: string) => {
    try {
        await AsyncStorage.removeItem(key)
      } catch(e) {
        // remove error
        console.log("Problem removing key: " + key);
      }
}

export const storeCredentials = async (username: string, token: string) => {

    await storeData("username", username);
    await storeData("token", token);
}

export const getCredentials = async () => {
    const username = await getData("username");
    const token = await getData("token");

    return {
        username: username,
        token: token
    }
}

export const clearCredentials = async () => {
    await removeData("username");
    await removeData("token");
}

export const storeServer = async (server: string) => {
    await storeData("server", server);
}

export const getServer = async (): Promise<string> => {
    return getData("server");
}

export const clearServer = async (): Promise<void> => {
    return removeData("server");
}

export const getCriticalAlertsVolume = async (): Promise<number> => {
    const jsonValue = await getData("critical-alert-volume");
    return (jsonValue != null) ? JSON.parse(jsonValue) : 1.0;
}

export const storeCriticalAlertsVolume = async (value: number) => {
    await storeData("critical-alert-volume", JSON.stringify(value));
}

export const getSoundForChannel = async (channel: string): Promise<string> => {
    return getData("sound-" + channel);
}

export const storeSoundForChannel = async (channel: string, sound: string) => {
    await storeData("sound-" + channel, sound);
}

export const getCriticalForChannel = async (channel: string): Promise<boolean> => {
    const jsonValue = await getData("critical-" + channel);
    return (jsonValue != null) ? JSON.parse(jsonValue) : false;
}

export const storeCriticalForChannel = async (channel: string, critical: boolean) => {
    await storeData("critical-" + channel, JSON.stringify(critical));
}