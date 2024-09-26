import { toDateId } from '@marceloterreiro/flash-calendar';
import InformationField from '@/components/fields/InformationField';
import InformationTray from '@/components/fields/InformationTray';
import type { patrol } from '@/types/patrol';
import { userToString } from '@/types/user';
import { getTimeString } from '@/utility/dateHelper';

interface CalendarPatrolProps {
  patrol: patrol;
}

function CalendarPatrol({ patrol }: CalendarPatrolProps) {
  const textColor = patrol.color?.toLocaleLowerCase() === '#ffffff' ? '#000000' : null;
  let time = '';
  if (patrol.finish_at) {
    time = `${getTimeString(patrol.start_at)} - ${getTimeString(patrol.finish_at)}`;
  }

  console.log(patrol.start_at, toDateId(patrol.start_at), patrol.finish_at, 'time', time);
  return (
    <InformationTray
      title={userToString(patrol.member)}
      titleBarColor={patrol.color}
      titleTextColor={textColor}
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
