import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

export const CustomCalendarButton = memo(
  ({ children, onPress }: { children: string; onPress: () => void }) => {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          ...styles.buttonContainer,
          backgroundColor: pressed
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(255, 255, 255, 0.1)',
        })}
      >
        <Text style={styles.buttonContent}>{children}</Text>
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: 'white',
    padding: 2,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonContent: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
});
