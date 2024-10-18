import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { elements } from '@styles/elements';
import colors, { textColorForBackground } from '@styles/colors';
import type { user_detail } from '@/types/user';
import { makePhoneCall } from '@/utility/phone';

interface UserCellProps {
  user: user_detail;
  onPress: (user) => void;
};

function UserCell({ user, onPress }: UserCellProps) {
  const tintColor = textColorForBackground(user.color);
  return (
    <View style={[elements.tray, styles.container]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => makePhoneCall(user.mobile_phone)}
        style={[styles.sideBar, { backgroundColor: user.color || colors.green }]}
      >
        <Image source={require('@assets/icons/phone.png')} tintColor={tintColor} style={styles.sideBarImage} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.contentBar}
        activeOpacity={0.5}
        onPress={() => onPress(user)}
      >
        <View style={styles.contentRow}>
          <Text style={styles.headerText}>{user.full_name}</Text>
          <Text style={styles.usernameText}>{user.username}</Text>
        </View>
        <View style={styles.contentRow}>
          <Text style={styles.phoneText}>{user.mobile_phone}</Text>
          <Text style={styles.statusText}>{user.status}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 5,
    overflow: 'hidden',
  },
  sideBar: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
  },
  sideBarImage: {
    resizeMode: 'contain',
    width: 30,
    height: 30,
  },
  contentBar: {
    flex: 1,
    flexDirection: 'column',
  },
  contentRow: {
    flexDirection: 'row',
    margin: 5,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primaryText,
    flex: 1,
  },
  usernameText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 10,
    marginRight: 20,
    color: colors.primaryText,
  },
  phoneText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '200',
    color: colors.primaryText,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '200',
    color: colors.primaryText,
    marginLeft: 10,
    marginRight: 20,
  },
});

export default UserCell;
