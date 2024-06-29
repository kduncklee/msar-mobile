import React from 'react';
import type { ImageRequireSource } from 'react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';

interface SmallButtonProps {
  title?: string;
  icon?: ImageRequireSource;
  backgroundColor: string;
  textColor?: string;
  onPress: () => void;
};

function SmallButton({ title, icon, backgroundColor, textColor, onPress }: SmallButtonProps) {
  let titlePaddingLeft = 12;
  if (icon) {
    titlePaddingLeft = 0;
  }
  return (

    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
        {!!icon
        && <Image source={icon} style={[elements.buttonIcon]} />}
        {!!title
        && <Text style={[elements.fieldText, { color: textColor, paddingVertical: 8, paddingLeft: titlePaddingLeft, paddingRight: 12, fontWeight: '400' }]}>{title}</Text>}
      </View>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 0,
    alignContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

});

export default SmallButton;
