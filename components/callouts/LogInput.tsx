import React from 'react';
import { Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '@styles/colors';

interface LogInputProps {
  text: string;
  onTextChange: (text: string) => void;
  onSendPress: () => void;
};

function LogInput({ text, onSendPress, onTextChange }: LogInputProps) {
  return (
    <View style={styles.container}>
      <TextInput
        defaultValue={text}
        multiline
        onChangeText={onTextChange}
        style={styles.messageText}
        placeholder="Message..."
        placeholderTextColor={colors.grayText}
      />
      <TouchableOpacity activeOpacity={0.5} style={[styles.button, { backgroundColor: colors.blue }]} onPress={onSendPress}>
        <Image source={require('@assets/icons/send_white.png')} style={styles.buttonImage} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 'auto',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  messageText: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    flex: 1,
    color: colors.lightText,
    backgroundColor: colors.secondaryBg,
    marginBottom: 4,
  },
  button: {
    marginLeft: 8,
    height: 36,
    width: 36,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    resizeMode: 'contain',
    height: 30,
    width: 30,
  },
});

export default LogInput;
