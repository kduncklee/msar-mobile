import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { getConditionalTimeString } from '@utility/dateHelper';
import { apiDownloadFile } from '@remote/api';
import { storage } from '@storage/mmkv';
import type { dataFile } from '@/types/dataFile';

const storageKey = (id: number) => `file_${id}`;

async function downloadFile(id: number, name: string, mimeType: string) {
  const destination = `${FileSystem.documentDirectory}${id}_${name}`;
  apiDownloadFile(id, destination)
    .then(({ uri }) => {
      console.log(id, 'finished downloading to ', uri);
      storage.set(storageKey(id), uri);
      openFile(uri, mimeType);
    })
    .catch((error) => {
      console.error(error);
    });
}

async function openFile(uri: string, mimeType: string) {
  const cUri = await FileSystem.getContentUriAsync(uri);
  console.log('cUri', cUri);
  if (Platform.OS === 'ios') {
    Sharing.shareAsync(cUri);
  }
  else {
    IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
      data: cUri,
      flags: 1,
      type: mimeType,
    });
  }
}
interface FileFieldProps {
  file: dataFile;
}

function FileField({ file }: FileFieldProps) {
  const size_mb = file.size / 1024 / 1024;
  const size_text = `${size_mb.toFixed(3)} MB`;

  const cellPressed = () => {
    const uri = storage.getString(storageKey(file.id));
    if (uri) {
      openFile(uri, file.content_type);
    }
    else {
      downloadFile(file.id, file.name, file.content_type);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.5} onPress={cellPressed}>
      <View style={[elements.tray, styles.container]}>
        <View style={styles.sideBar}>
          <Image
            source={require('@assets/icons/copy.png')}
            style={styles.sideBarImage}
          />
        </View>
        <View style={styles.contentBar}>
          <View style={styles.contentTop}>
            <Text style={styles.fileNameText}>{file.name}</Text>
          </View>
          <View style={styles.contentMiddle}>
            <Text style={styles.memberNameText}>{file.member.full_name}</Text>
            <Image
              source={require('@assets/icons/forward_narrow.png')}
              style={styles.arrowImage}
            />
          </View>
          <View style={styles.contentBottom}>
            <View style={[elements.capsule]}>
              <Text style={elements.smallYellowText}>
                {getConditionalTimeString(file.created_at)}
              </Text>
            </View>
            <View style={[elements.capsule]}>
              <Text style={elements.smallYellowText}>{size_text}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: 'hidden',
  },
  sideBar: {
    backgroundColor: colors.green,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  sideBarImage: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  contentBar: {
    flex: 1,
    flexDirection: 'column',
  },
  contentTop: {
    flexDirection: 'row',
    margin: 10,
  },
  fileNameText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
    flex: 1,
  },
  contentMiddle: {
    flexDirection: 'row',
    marginHorizontal: 10,
    alignItems: 'center',
  },
  memberNameText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '200',
    color: colors.primaryText,
  },
  arrowImage: {
    resizeMode: 'contain',
    width: 20,
    height: 20,
    marginLeft: 10,
  },
  contentBottom: {
    flexDirection: 'row',
    margin: 10,
  },
});

export default FileField;
