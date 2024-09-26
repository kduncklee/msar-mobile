import InformationField from '@/components/fields/InformationField';
import InformationTray from '@/components/fields/InformationTray';
import colors from '@/styles/colors';
import type { event } from '@/types/event';

interface CalendarEventProps {
  event: event;
}

function CalendarEvent({ event }: CalendarEventProps) {
  return (
    <InformationTray
      title={event.title}
      titleBarColor={colors.green}
    >
      <InformationField title="Location" value={event.location} />
      <InformationField title="Description" value={event.description} />
    </InformationTray>
  );
}
export default CalendarEvent;
