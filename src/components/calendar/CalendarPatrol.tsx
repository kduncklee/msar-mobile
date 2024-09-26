import { toDateId } from '@marceloterreiro/flash-calendar';
import { Alert } from 'react-native';
import InformationField from '@/components/fields/InformationField';
import InformationTray from '@/components/fields/InformationTray';
import type { patrol } from '@/types/patrol';
import { isUserSelf, userToString } from '@/types/user';
import { getDateTimeRangeString } from '@/utility/dateHelper';
import useAuth from '@/hooks/useAuth';
import { usePatrolRemoveMutation } from '@/remote/mutation';

interface CalendarPatrolProps {
  patrol: patrol;
}

function CalendarPatrol({ patrol }: CalendarPatrolProps) {
  const { username } = useAuth();
  const patrolRemoveMutation = usePatrolRemoveMutation();
  const textColor = patrol.color?.toLocaleLowerCase() === '#ffffff' ? '#000000' : null;
  const time = getDateTimeRangeString(patrol.start_at, patrol.finish_at);
  const isSelf = isUserSelf(patrol.member, username);

  function edit() {
    console.log('edit patrol');
    Alert.alert('Confirm Patrol Deletion', `Are you sure you want to delete this patrol?`, [
      {
        text: 'Yes',
        onPress: () => { patrolRemoveMutation.mutate(patrol.id); },
        style: 'destructive',
      },
      {
        text: 'No',
        style: 'cancel',
      },
    ]);
  }

  console.log(patrol.start_at, toDateId(patrol.start_at), patrol.finish_at, 'time', time);
  return (
    <InformationTray
      title={userToString(patrol.member)}
      titleBarColor={patrol.color}
      titleTextColor={textColor}
      editButton={isSelf}
      onEditPress={edit}
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
