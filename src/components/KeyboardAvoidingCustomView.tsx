import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

interface KeyboardAvoidingCustomViewProps {
  children: React.ReactNode;
}

const KeyboardAvoidingCustomView: React.FC<KeyboardAvoidingCustomViewProps> = (props) => {
  const { children } = props;
  return (
    <KeyboardAvoidingView
      style={styles.contentContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
});

export default KeyboardAvoidingCustomView;
