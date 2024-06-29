import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import InformationTray from '@components/fields/InformationTray';
import PersonnelField from '@components/fields/PersonnelField';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { responseType } from '@/types/enums';
import type { opResponse } from '@/types/operationalPeriod';
import type { callout } from '@/types/callout';

interface CalloutPersonnelTabProps {
  callout: callout;
};

function CalloutPersonnelTab({ callout }: CalloutPersonnelTabProps) {
  let responses: opResponse[] = [];
  if (callout.operational_periods[0]) {
    responses = callout.operational_periods[0].responses;
  }

  const filterByTen19: opResponse[] = responses.filter((opResponse) => {
    return opResponse.response === responseType.TEN19;
  });

  const filterByTen8: opResponse[] = responses.filter((opResponse) => {
    return opResponse.response === responseType.TEN8;
  });

  const filterByTen7: opResponse[] = responses.filter((opResponse) => {
    return opResponse.response === responseType.TEN7;
  });

  return (
    <>
      {filterByTen19.length === 0 && filterByTen8.length === 0 && filterByTen7.length === 0
      && <Text style={[elements.mediumText, styles.noResponses]}>No Responses</Text>}
      {filterByTen19.length > 0
      && (
        <InformationTray
          title="10-19"
          titleBarColor={colors.secondaryYellow}
          titleTextColor={colors.black}
          count={filterByTen19.length}
        >
          <View style={styles.preList} />
          {
            filterByTen19.map((opResponse: opResponse, index: number) => {
              const addDiv: boolean = (index < filterByTen19.length - 1);

              return (
                <React.Fragment key={opResponse.member.id}>
                  <PersonnelField key={opResponse.member.id} opResponse={opResponse} />
                  {addDiv
                  && <View style={elements.informationDiv} />}
                </React.Fragment>
              );
            })
          }
          <View style={styles.postList} />
        </InformationTray>
      )}
      {filterByTen8.length > 0
      && (
        <InformationTray
          title="10-8"
          titleBarColor={colors.green}
          titleTextColor={colors.primaryText}
          count={filterByTen8.length}
        >
          <View style={styles.preList} />
          {
            filterByTen8.map((opResponse: opResponse, index: number) => {
              const addDiv: boolean = (index < filterByTen8.length - 1);

              return (
                <React.Fragment key={opResponse.member.id}>
                  <PersonnelField key={opResponse.member.id} opResponse={opResponse} />
                  {addDiv
                  && <View style={elements.informationDiv} />}
                </React.Fragment>
              );
            })
          }
          <View style={styles.postList} />
        </InformationTray>
      )}
      {filterByTen7.length > 0
      && (
        <InformationTray
          title="10-7"
          titleBarColor={colors.red}
          titleTextColor={colors.primaryText}
          count={filterByTen7.length}
        >
          <View style={styles.preList} />
          {
            filterByTen7.map((opResponse: opResponse, index: number) => {
              const addDiv: boolean = (index < filterByTen7.length - 1);

              return (
                <React.Fragment key={opResponse.member.id}>
                  <PersonnelField key={opResponse.member.id} opResponse={opResponse} />
                  {addDiv
                  && <View style={elements.informationDiv} />}
                </React.Fragment>
              );
            })
          }
          <View style={styles.postList} />
        </InformationTray>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  noResponses: {
    margin: 20,
    textAlign: 'center',
    color: colors.grayText,
  },
  preList: {
    marginTop: 8,
  },
  postList: {
    marginBottom: 8,
  },
});

export default CalloutPersonnelTab;
