import { StyleSheet, Text, View } from 'react-native';
import type { patrol } from '@/types/patrol';
import type { event } from '@/types/event';
import colors from '@/styles/colors';

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

      {!events && !patrols && <View style={styles.spacer} />}
    </>
  );
};

const styles = StyleSheet.create({
  common: {
    fontStyle: 'italic',
    textAlign: 'center',
    borderRadius: 10,
    backgroundColor: colors.green,
    margin: 1,
  },
  event: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  patrol: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  spacer: {
    margin: 20,
  },
});
