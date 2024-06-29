import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';

interface LargeButtonProps {
  title: string;
  backgroundColor: string;
  textColor?: string;
  onPress: () => void;
};

function LargeButton({ title, backgroundColor, textColor, onPress }: LargeButtonProps) {
  return (

    <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[elements.mediumText, { color: textColor, paddingVertical: 8, fontWeight: '500', textAlign: 'center' }]}>{title}</Text>
      </View>
    </TouchableOpacity>

  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    marginVertical: 8,
  },
});

export default LargeButton;
