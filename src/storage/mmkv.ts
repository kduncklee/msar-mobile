import * as SecureStore from 'expo-secure-store';
import { MMKV, useMMKVNumber, useMMKVObject, useMMKVString } from 'react-native-mmkv';
import { getData, removeData } from '@storage/storage';
import type { location } from '@/types/location';

const key_name = 'mmkv_encryption_key';
const keychainOptions: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
};

function generateEncryptionKey() {
  let password = '';
  const charset
    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  for (let i = 0; i < 32; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

function getEncryptionKey() {
  let key: string = SecureStore.getItem(key_name);
  if (!key) {
    key = generateEncryptionKey();
    SecureStore.setItem(key_name, key, keychainOptions);
  }
  return key;
}

export const storage = new MMKV({
  id: 'mmkv.secure',
  encryptionKey: getEncryptionKey(),
});

export const sharedStorage = new MMKV({
  id: 'mmkv.shared',
});

export const clientStorage = {
  setItem: (key: string, value) => {
    // console.log('mmkv set', key, String(value).substring(0,40));
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    // console.log('mmkv get', key, String(value).substring(0,40));
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    console.log('mmkv delete', key);
    storage.delete(key);
  },
};

export function useEditingLocation() {
  return useMMKVObject<location>('edit_location', storage);
}

export function useLocalDataFilePath(id: number) {
  return useMMKVString(`file_${id}`, storage);
}

export function useLastRead(id: number) {
  return useMMKVNumber(`last-read-${id.toString()}`, storage);
}

export function getLastLogRead(id: number): number {
  return storage.getNumber(`last-read-${id.toString()}`);
}

export function storeLastRead(id: number, value: number) {
  const last = getLastLogRead(id);
  if (
    (value !== undefined)
    && ((last === undefined) || (value > last))
  ) {
    console.log('storeLastRead', id, value);
    storage.set(`last-read-${id.toString()}`, value);
  }
}

export function getCriticalAlertsVolume(): number {
  const key = 'critical-alert-volume';
  return sharedStorage.contains(key) ? sharedStorage.getNumber(key) : 1.0;
}

export function storeCriticalAlertsVolume(value: number) {
  sharedStorage.set('critical-alert-volume', value);
}

export function getSoundForChannel(channel: string): string {
  return sharedStorage.getString(`sound-${channel}`);
}

export function storeSoundForChannel(channel: string, sound: string) {
  sharedStorage.set(`sound-${channel}`, sound);
}

export function getCriticalForChannel(channel: string): boolean {
  return sharedStorage.getBoolean(`critical-${channel}`);
}

export function storeCriticalForChannel(channel: string, critical: boolean) {
  sharedStorage.set(`critical-${channel}`, critical);
}

export function storeSnoozeExpires(value: number) {
  sharedStorage.set('snoozeExpires', value);
}

export function getSnoozeExpires(): number {
  const key = 'snoozeExpires';
  return sharedStorage.contains(key) ? sharedStorage.getNumber(key) : 0;
}

export function getIsSnoozing(): boolean {
  const snoozeExpireTime = getSnoozeExpires();
  return (snoozeExpireTime - new Date().getTime()) > 0;
}

export function clearSnoozeExpires() {
  return storeSnoozeExpires(0);
}

export function storeBadggeCount(value: number) {
  sharedStorage.set('badgeCount', value);
}

export async function migrateSharedStorage() {
  console.log('pre-migrateSharedStorage');
  if (sharedStorage.getBoolean('migrateSharedStorage'))
    return;
  console.log('migrateSharedStorage');
  const channels = ['callout', 'callout-resolved', 'log', 'announcement'];
  channels.forEach(async (channel) => {
    const sound = await getData(`sound-${channel}`);
    if (sound) {
      console.log(`Storing ${channel} sound = ${sound}`);
      storeSoundForChannel(channel, sound);
      removeData(`sound-${channel}`);
    }
    const critical = await getData(`critical-${channel}`);
    if (critical != null) {
      console.log(`Storing ${channel} critical = ${critical}`);
      storeCriticalForChannel(channel, JSON.parse(critical));
      removeData(`critical-${channel}`);
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
