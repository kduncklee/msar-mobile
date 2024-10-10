import { toDateId } from '@marceloterreiro/flash-calendar';
import InformationField from '@/components/fields/InformationField';
import InformationTray from '@/components/fields/InformationTray';
import type { patrol } from '@/types/patrol';
import { isUserSelf, userToString } from '@/types/user';
import { getDateTimeRangeString } from '@/utility/dateHelper';
import useAuth from '@/hooks/useAuth';

interface CalendarPatrolProps {
  patrol: patrol;
  onEditPress?: () => void;
}

function CalendarPatrol({ patrol, onEditPress }: CalendarPatrolProps) {
  const { username } = useAuth();
  const textColor = patrol.color?.toLocaleLowerCase() === '#ffffff' ? '#000000' : null;
  const time = getDateTimeRangeString(patrol.start_at, patrol.finish_at);
  const isSelf = isUserSelf(patrol.member, username);

  console.log(patrol.start_at, toDateId(patrol.start_at), patrol.finish_at, 'time', time);
  return (
    <InformationTray
      title={userToString(patrol.member)}
      titleBarColor={patrol.color}
      titleTextColor={textColor}
      editButton={isSelf}
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
