import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: string) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (e) {
        // saving error
        console.log("error storing to: " + key);
    }
};

export const getData = async (key: string) => {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    } catch (e) {
        // error reading value
        console.log("error retrieving value: " + key)
        return null;
    }
};

export const removeData = async (key: string) => {
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
