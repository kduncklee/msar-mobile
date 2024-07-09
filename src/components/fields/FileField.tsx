import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import * as Sharing from 'expo-sharing';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { getConditionalTimeString } from '@utility/dateHelper';
import { apiDownloadFile } from '@remote/api';
import { useLocalDataFilePath } from '@storage/mmkv';
import FileViewer from 'react-native-file-viewer';
import * as ContextMenu from 'zeego/context-menu';
import * as Sentry from '@sentry/react-native';
import type { dataFile } from '@/types/dataFile';

async function downloadFile(id: number, destination: string) {
  return apiDownloadFile(id, destination)
    .then(({ uri }) => {
      console.log(id, 'finished downloading to ', uri);
      return uri;
    })
    .catch((error) => {
      console.error('downloadFile Error', error);
      throw error;
    });
}

async function shareFile(uri: string) {
  Sharing.shareAsync(uri);
}

async function openFile(uri: string, mimeType: string) {
  const cUri = await FileSystem.getContentUriAsync(uri);
  console.log('cUri', cUri);
  if (Platform.OS === 'ios') {
    await FileViewer.open(cUri, { showOpenWithDialog: true });
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
  const localFilename = `${file.id}_${file.name}`;
  const localFullUri = `${FileSystem.documentDirectory}${localFilename}`;

  const [storedUri, setStoredUri] = useLocalDataFilePath(file.id);

  const download = async () => {
    return downloadFile(file.id, localFullUri).then((uri) => {
      setStoredUri(localFilename);
      return uri;
    });
  };

  const localOrDownload = async () => {
    if (storedUri) {
      // iOS moves the document dir between versions, so re-create the full path.
      // Early versions stored the absolute path to the old document directory.
      return localFullUri;
    }
    return download();
  };

  const downloadPressed = () => {
    download().catch((error) => {
      console.error('Share error', file.id, error);
      Sentry.captureException(error);
    });
  };

  const sharePressed = () => {
    localOrDownload().then(shareFile).catch((error) => {
      console.error('Share error', file.id, error);
      Sentry.captureException(error);
    });
  };

  const openPressed = () => {
    localOrDownload().then(uri => openFile(uri, file.content_type)).catch((error) => {
      console.error('Open error', file.id, error);
      Sentry.captureException(error);
    }); ;
  };

  const cellPressed = () => {
    openPressed();
  };

  const cellLongPressed = () => {
    // Having a onLongPressed ensures that onPressed does not fire on a long press.
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={cellPressed}
          onLongPress={cellLongPressed}
        >
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
      </ContextMenu.Trigger>

      <ContextMenu.Content>
        <ContextMenu.Item key="download" onSelect={downloadPressed}>
          <ContextMenu.ItemTitle>Download</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item key="open" onSelect={openPressed}>
          <ContextMenu.ItemTitle>Open</ContextMenu.ItemTitle>
        </ContextMenu.Item>
        <ContextMenu.Item key="share" onSelect={sharePressed}>
          <ContextMenu.ItemTitle>Share</ContextMenu.ItemTitle>
        </ContextMenu.Item>
      </ContextMenu.Content>

    </ContextMenu.Root>
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
