import type { CalendarItemDayWithContainerProps } from '@marceloterreiro/flash-calendar';
import { Calendar, useOptimizedDayMetadata } from '@marceloterreiro/flash-calendar';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useCallback } from 'react';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';
import { CalendarItemDayContent } from '@/components/calendar/CalendarItemDayContent';

interface CustomCalendarItemDayWithContainerProps extends CalendarItemDayWithContainerProps {
  events: event[];
  patrols: patrol[];
}
// eslint-disable-next-line antfu/top-level-function
export const CustomCalendarItemDay = ({
  children,
  metadata: baseMetadata,
  onPress,
  theme,
  dayHeight,
  daySpacing,
  containerTheme,
  events,
  patrols,
}: CustomCalendarItemDayWithContainerProps) => {
  const metadata = useOptimizedDayMetadata(baseMetadata);

  const handlePress = useCallback(() => {
    onPress(metadata.id);
  }, [metadata.id, onPress]);

  return (
    <Calendar.Item.Day.Container
      dayHeight={dayHeight}
      daySpacing={daySpacing}
      isStartOfWeek={metadata.isStartOfWeek}
      shouldShowActiveDayFiller={
        metadata.isRangeValid && !metadata.isEndOfWeek
          ? !metadata.isEndOfRange
          : false
      }
      theme={containerTheme}
    >

      <Pressable
        disabled={metadata.state === 'disabled'}
        onPress={handlePress}
        style={({ pressed: isPressed }) => {
          return {
            ...styles.baseContainer,
            dayHeight,
            ...theme?.base?.({ ...metadata, isPressed }).container,
            ...theme?.[metadata.state]?.({ ...metadata, isPressed }).container,
          };
        }}
      >
        {({ pressed: isPressed }) => {
          return (
            <>
              <Text
                style={{
                  ...styles.baseContent,
                  ...theme?.base?.({ ...metadata, isPressed }).content,
                  ...theme?.[metadata.state]?.({ ...metadata, isPressed }).content,
                }}
              >
                {children}
              </Text>
              <CalendarItemDayContent events={events} patrols={patrols} />
            </>
          );
        }}
      </Pressable>

    </Calendar.Item.Day.Container>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    padding: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    flex: 1,
  },
  baseContent: {
    textAlign: 'center',
  },
});
