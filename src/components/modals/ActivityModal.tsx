import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import colors from '@styles/colors';

interface ActivityModalProps {
  message?: string;
};

function ActivityModal({ message }: ActivityModalProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primaryText} style={styles.spinner} />
      {!!message
      && <Text style={styles.messageText}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 100,
    margin: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000b5',
    alignContent: 'center',
    justifyContent: 'center',
  },
  spinner: {

  },
  messageText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.grayText,
  },
});

export default ActivityModal;
