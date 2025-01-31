import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import FileField from '@components/fields/FileField';
import { elements } from '@styles/elements';
import type { Api } from 'remote/api';
import msarEventEmitter from 'utility/msarEventEmitter';
import type { callout } from '@/types/callout';
import useAuth from '@/hooks/useAuth';

async function uploadFile(api: Api, file: object, id: number) {
  const idText: string = id?.toString();
  console.log('file', file);
  const result = await api.apiUploadFile(file, idText);
  console.log('file result', result);
  console.log(await result.json());
  msarEventEmitter.emit('refreshCallout', { id });
}

async function pickUploadPhoto(api: Api, id: number) {
  const picker = await ImagePicker.launchImageLibraryAsync({
    quality: 1,
  });
  console.log(picker);
  if (picker.canceled) {
    console.log('No image selected.');
    return;
  }
  console.log(picker.assets);
  const image = picker.assets[0];
  const file = {
    name: image.fileName,
    uri: image.uri,
    size: image.fileSize,
    mimeType: image.mimeType,
    type: image.mimeType,
  };
  uploadFile(api, file, id);
}

async function pickUploadFile(api: Api, id: number) {
  const document = await DocumentPicker.getDocumentAsync();
  if (document.canceled) {
    console.log('No document selected.');
    return;
  }
  console.log(document.assets);
  const doc = document.assets[0];
  console.log('doc', doc);
  const file = {
    name: doc.name,
    uri: doc.uri,
    size: doc.size,
    mimeType: doc.mimeType,
    type: doc.mimeType,
  };
  uploadFile(api, file, id);
}

interface CalloutFileTabProps {
  callout: callout;
}

function CalloutFileTab({ callout }: CalloutFileTabProps) {
  const { api } = useAuth();

  return (
    <View style={styles.contentContainer}>
      <FlatList
        style={styles.contentContainer}
        data={callout.files}
        renderItem={({ item }) => {
          return <FileField file={item} />;
        }}
      />
      <View style={elements.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, elements.splitButton]}
          onPress={() => pickUploadPhoto(api, callout.id)}
        >
          <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>
            Upload photo
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[elements.capsuleButton, elements.splitButton]}
          onPress={() => pickUploadFile(api, callout.id)}
        >
          <Text style={[elements.whiteButtonText, { fontSize: 18 }]}>
            Upload File
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

export default CalloutFileTab;
