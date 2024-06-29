import AsyncStorage from '@react-native-async-storage/async-storage';

async function storeData(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value);
  }
  catch (e) {
    // saving error
    console.log(`error storing to: ${key}`);
  }
}

export async function getData(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  }
  catch (e) {
    // error reading value
    console.log(`error retrieving value: ${key}`);
    return null;
  }
}

export async function removeData(key: string) {
  try {
    await AsyncStorage.removeItem(key);
  }
  catch (e) {
    // remove error
    console.log(`Problem removing key: ${key}`);
  }
}

export async function storeCredentials(username: string, token: string) {
  await storeData('username', username);
  await storeData('token', token);
}

export async function getCredentials() {
  const username = await getData('username');
  const token = await getData('token');

  return {
    username,
    token,
  };
}

export async function clearCredentials() {
  await removeData('username');
  await removeData('token');
}

export async function storeServer(server: string) {
  await storeData('server', server);
}

export async function getServer(): Promise<string> {
  return getData('server');
}

export async function clearServer(): Promise<void> {
  return removeData('server');
}
