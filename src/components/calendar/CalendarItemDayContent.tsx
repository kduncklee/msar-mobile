import { StyleSheet, Text } from 'react-native';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';

interface CalendarItemDayContentProps {
  events: event[];
  patrols: patrol[];
}
// eslint-disable-next-line antfu/top-level-function
export const CalendarItemDayContent = ({
  events,
  patrols,
}: CalendarItemDayContentProps) => {
  return (
    <>
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
    </>
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
