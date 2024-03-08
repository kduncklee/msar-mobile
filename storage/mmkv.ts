import * as SecureStore from "expo-secure-store";
import { MMKV } from "react-native-mmkv";

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
  id: "mmkv.default",
  encryptionKey: getEncryptionKey(),
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
