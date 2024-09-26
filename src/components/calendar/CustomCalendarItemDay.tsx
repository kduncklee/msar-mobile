import type { CalendarItemDayWithContainerProps } from '@marceloterreiro/flash-calendar';
import { Calendar, useOptimizedDayMetadata } from '@marceloterreiro/flash-calendar';
import { StyleSheet, Text } from 'react-native';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';

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

      <Calendar.Item.Day
        height={dayHeight}
        metadata={metadata}
        onPress={onPress}
        theme={theme}
      >
        {children}
      </Calendar.Item.Day>

      {events?.map(event => (
        <Text
          key={event.title}
          numberOfLines={1}
          ellipsizeMode="clip"
          allowFontScaling={false}
          style={[styles.common, styles.event]}
        >
          {event.title}
        </Text>
      ))}

      {patrols?.map(patrol => (
        <Text
          numberOfLines={1}
          ellipsizeMode="clip"
          allowFontScaling={false}
          key={patrol.member.username}
          style={[styles.common, styles.patrol, { backgroundColor: patrol.color }]}
        >
          {patrol.member.username}
        </Text>
      ))}
    </Calendar.Item.Day.Container>
  );
};

const styles = StyleSheet.create({
  common: {
    fontStyle: 'italic',
    textAlign: 'center',
    borderRadius: 10,
    backgroundColor: '#68a0cf',
    margin: 1,
  },
  event: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  patrol: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
