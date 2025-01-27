import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '@styles/colors';
import { getConditionalTimeString } from '@utility/dateHelper';
import { colorForResponseType } from '@/types/calloutSummary';
import type { user } from '@/types/user';
import { userToString } from '@/types/user';
import { useCalloutResponsesAvailableMap } from '@/remote/query';

interface LogResponseFieldProps {
  member: user;
  response: string;
  timestamp: Date;
};

function LogResponseField({ member, response, timestamp }: LogResponseFieldProps) {
  const calloutResponseMap = useCalloutResponsesAvailableMap();

  return (
    <View style={styles.container}>
      <Text style={[styles.valueText, { color: colorForResponseType(response, calloutResponseMap) }]}>
        {userToString(member)}
        {' responded '}
        {response}
      </Text>
      <Text style={styles.logTimestamp}>
        {getConditionalTimeString(timestamp)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8,
  },

  valueText: {

    fontSize: 18,
    fontWeight: '400',
    fontStyle: 'italic',
    textAlign: 'center',
    color: colors.primaryText,
  },
  logTimestamp: {

    marginTop: 8,
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.grayText,
  },
});

export default LogResponseField;
