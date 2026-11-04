import type { event } from '@/types/event';
import InformationField from '@/components/fields/InformationField';
import InformationTray from '@/components/fields/InformationTray';
import colors from '@/styles/colors';
import { getDateRangeString, getDateTimeRangeString, getTimeString } from '@/utility/dateHelper';

interface CalendarEventProps {
  event: event;
  onEditPress?: () => void;
}

function CalendarEvent({ event, onEditPress }: CalendarEventProps) {
  const time = event.all_day
    ? (getDateRangeString(event.start_at, event.finish_at) || 'All day')
    : (getDateTimeRangeString(event.start_at, event.finish_at) || getTimeString(event.start_at));
  return (
    <InformationTray
      title={event.title}
      titleBarColor={colors.green}
      editButton={!!onEditPress}
      onEditPress={onEditPress}
    >
      {time && <InformationField title="Time" value={time} />}
      <InformationField title="Type" value={event.type} />
      {!!event.leaders && <InformationField title="Leaders" value={event.leaders} />}
      {!!event.location && <InformationField title="Location" value={event.location} />}
      {!!event.description && <InformationField title="Description" value={event.description} />}
    </InformationTray>
  );
}
export default CalendarEvent;
