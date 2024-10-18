import { StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import type { patrol } from '@/types/patrol';
import type { user_detail } from '@/types/user';
import colors from '@/styles/colors';
import { useMemberListQuery } from '@/remote/query';
import { elements } from '@/styles/elements';

interface user_ext extends user_detail {
  hasPatrol?: boolean;
}

interface CalendarFooterProps {
  patrols: patrol[];
}

function FooterRow({ user }: { user: user_ext }) {
  const icon = user.hasPatrol ? 'checkbox-outline' : 'checkbox-blank-outline';
  return (
    <View style={{
      alignSelf: 'stretch',
      flexDirection: 'row',
      backgroundColor: user.color || colors.green,
    }}
    >
      <View style={[styles.footerText, { alignContent: 'center' }]}>
        <MaterialCommunityIcons name={icon} size={20} color="black" />
      </View>
      <Text style={styles.footerText}>{user.username}</Text>
      <Text style={[styles.footerText, { flex: 3 }]}>{user.full_name}</Text>
      <Text style={styles.footerText}>{user.status}</Text>
    </View>
  );
}

function CalendarFooter({ patrols }: CalendarFooterProps) {
  const memberQuery = useMemberListQuery();

  if (!patrols?.length) {
    return null;
  }

  const memberPatrols = new Map<string, boolean>();
  patrols?.forEach((patrol) => {
    memberPatrols[patrol.member.username] = true;
  });

  const sorted: user_ext[] = memberQuery.data
    ? [...memberQuery.data].filter(item => item.is_current).sort((a, b) => {
        // if (a.status_order !== b.status_order) {
        if (a.color !== b.color) {
          return a.status_order < b.status_order ? -1 : 1;
        }
        return a.username < b.username ? -1 : 1;
      })
    : [];

  sorted.forEach((member) => {
    member.hasPatrol = memberPatrols[member.username];
  });

  return (
    <View>
      <Text style={elements.bigText}>Patrol Status</Text>
      {sorted.map((user, _index) => (<FooterRow key={user.id} user={user} />))}
    </View>
  );
}

const styles = StyleSheet.create({
  footerText: {
    color: colors.black,
    flex: 1,
    flexBasis: 'auto',
  },
});

export default CalendarFooter;
