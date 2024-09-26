import InformationField from '@/components/fields/InformationField';
import InformationTray from '@/components/fields/InformationTray';
import colors from '@/styles/colors';
import type { event } from '@/types/event';
import { getDateRangeString, getDateTimeRangeString, getTimeString } from '@/utility/dateHelper';

interface CalendarEventProps {
  event: event;
}

function CalendarEvent({ event }: CalendarEventProps) {
  const time = event.all_day
    ? (getDateRangeString(event.start_at, event.finish_at) || 'All day')
    : (getDateTimeRangeString(event.start_at, event.finish_at) || getTimeString(event.start_at));
  return (
    <InformationTray
      title={event.title}
      titleBarColor={colors.green}
    >
      {time && <InformationField title="Time" value={time} />}
      <InformationField title="Location" value={event.location} />
      <InformationField title="Type" value={event.type} />
      <InformationField title="Description" value={event.description} />
    </InformationTray>
  );
}
export default CalendarEvent;
