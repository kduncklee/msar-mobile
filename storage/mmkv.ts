import * as SecureStore from "expo-secure-store";
import { MMKV } from "react-native-mmkv";
import { getData, removeData } from "./storage";

const key_name = "mmkv_encryption_key";
const keychainOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

function generateEncryptionKey() {
  var password = "";
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  for (var i = 0; i < 32; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function getEncryptionKey() {
  var key: string = SecureStore.getItem(key_name);
  if (!key) {
    key = generateEncryptionKey();
    SecureStore.setItem(key_name, key, keychainOptions);
  }
  return key;
}

export const storage = new MMKV({
  id: "mmkv.secure",
  encryptionKey: getEncryptionKey(),
});

export const sharedStorage = new MMKV({
  id: "mmkv.shared",
});

export const clientStorage = {
  setItem: (key:string, value) => {
    // console.log('mmkv set', key, String(value).substring(0,40));
    storage.set(key, value);
  },
  getItem: (key:string) => {
    const value = storage.getString(key);
    // console.log('mmkv get', key, String(value).substring(0,40));
    return value === undefined ? null : value;
  },
  removeItem: (key:string) => {
    console.log('mmkv delete', key);
    storage.delete(key);
  },
};


export const getCriticalAlertsVolume = (): number => {
    const key = "critical-alert-volume";
    return sharedStorage.contains(key) ? sharedStorage.getNumber(key) : 1.0;
}

export const storeCriticalAlertsVolume = (value: number) => {
    sharedStorage.set("critical-alert-volume", value);
}

export const getSoundForChannel = (channel: string): string => {
    return sharedStorage.getString("sound-" + channel);
}

export const storeSoundForChannel = (channel: string, sound: string) => {
    sharedStorage.set("sound-" + channel, sound);
}

export const getCriticalForChannel = (channel: string): boolean => {
    return sharedStorage.getBoolean("critical-" + channel);
}

export const storeCriticalForChannel = (channel: string, critical: boolean) => {
    sharedStorage.set("critical-" + channel, critical);
}


export const storeSnoozeExpires = (value: number) => {
    sharedStorage.set("snoozeExpires", value);
}

export const getSnoozeExpires = (): number => {
    const key = "snoozeExpires";
    return sharedStorage.contains(key) ? sharedStorage.getNumber(key) : 0;
}

export const getIsSnoozing = (): boolean => {
    const snoozeExpireTime = getSnoozeExpires();
    return (snoozeExpireTime - new Date().getTime()) > 0;
}

export const clearSnoozeExpires = () => {
    return storeSnoozeExpires(0);
}

export const migrateSharedStorage = async () => {
    console.log('pre-migrateSharedStorage');
    if (sharedStorage.getBoolean('migrateSharedStorage')) return;
    console.log('migrateSharedStorage');
    const channels = ['callout', 'callout-resolved', 'log', 'announcement'];
    channels.forEach(async channel => {
        const sound = await getData('sound-' + channel);
        if (sound) {
            console.log(`Storing ${channel} sound = ${sound}`);
            storeSoundForChannel(channel, sound);
            removeData('sound-' + channel);
        }
        const critical = await getData('critical-' + channel);
        if (critical != null) {
            console.log(`Storing ${channel} critical = ${critical}`);
            storeCriticalForChannel(channel, JSON.parse(critical));
            removeData('critical-' + channel);
        }
    });

    const volume = await getData('critical-alert-volume');
    if (volume != null) {
        console.log(`Storing volume = ${volume}`);
        storeCriticalAlertsVolume(JSON.parse(volume));
        removeData('critical-alert-volume');
    }

    sharedStorage.set('migrateSharedStorage', true);
}