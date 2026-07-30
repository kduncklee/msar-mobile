import type { patrol } from '@/types/patrol';
import { toDateId } from '@marceloterreiro/flash-calendar';
import InformationField from '@/components/fields/InformationField';
import InformationTray from '@/components/fields/InformationTray';
import { textColorForBackground } from '@/styles/colors';
import { userToString } from '@/types/user';
import { getDateTimeRangeString } from '@/utility/dateHelper';

interface CalendarPatrolProps {
  patrol: patrol;
  onEditPress?: () => void;
}

function CalendarPatrol({ patrol, onEditPress }: CalendarPatrolProps) {
  const textColor = textColorForBackground(patrol?.color);
  const time = getDateTimeRangeString(patrol.start_at, patrol.finish_at);

  console.log(patrol.start_at, toDateId(patrol.start_at), patrol.finish_at, 'time', time);
  return (
    <InformationTray
      title={userToString(patrol.member)}
      titleBarColor={patrol.color}
      titleTextColor={textColor}
      editButton={true}
      onEditPress={onEditPress}
    >
      {!!time && (
        <InformationField title="Time" value={time} />
      )}
      {!!patrol.description && (
        <InformationField title="Comment" value={patrol.description} />
      )}
    </InformationTray>
  );
}
export default CalendarPatrol;
