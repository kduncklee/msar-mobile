import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';

export interface CheckboxPropsCommon {
  title: string;
  disabled?: boolean;
}

interface CheckboxProps extends CheckboxPropsCommon {
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

function Checkbox({ title, checked, disabled, onToggle }: CheckboxProps) {
  const onCheckToggle = () => {
    if (disabled) {
      return;
    }
    onToggle(!checked);
  };

  let opacity: number = 1;
  if (disabled) {
    opacity = 0.5;
  }

  return (
    <View style={[styles.container, { opacity }]}>
      <TouchableOpacity
        activeOpacity={0.5}
        style={[elements.inputContainer, { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }]}
        onPress={onCheckToggle}
        testID={`${title}-checkbox`}
      >
        {checked
        && <Image source={require('@assets/icons/check.png')} style={elements.fieldImage} testID={`${title}-checked`} />}
      </TouchableOpacity>
      <Text style={[elements.mediumText, { marginLeft: 10, fontWeight: '600' }]} testID={title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default Checkbox;
