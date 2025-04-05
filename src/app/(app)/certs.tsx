import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '@components/Header';
import colors from '@styles/colors';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { memberListQueryKey, teamCertsQueryKey, useMemberListQuery, useTeamCertsQuery } from '@/remote/query';
import type { user_detail } from '@/types/user';
import UserModal from '@/components/modals/UserModal';
import useStatusBarColor from '@/hooks/useStatusBarColor';
import type { display_cert, member_cert_summary_ext } from '@/types/cert';
import type { LabelValue } from '@/utility/reactForm';

function Page() {
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [tableData, setTableData] = useState([]);

  const [selectedUser, setSelectedUser] = useState<user_detail>(null);
  useStatusBarColor();
  const queryClient = useQueryClient();
  const certQuery = useTeamCertsQuery();
  const memberQuery = useMemberListQuery();

  useEffect(() => {
    const data = [];
    certQuery.data?.forEach((item) => {
      const combined: member_cert_summary_ext = { ...item };
      const user = memberQuery.data?.find(user => user.id === item.id);
      combined.user = user;
      combined.username = user.username;
      data.push(combined);
    });
    setTableData(data);
  }, [certQuery.data, memberQuery.data]);

  console.log('tableData[0]', tableData?.at(0));

  const fixedColumnMap: LabelValue[] = useMemo(() => [
    { label: 'Name', value: 'full_name' },
    { label: 'ID', value: 'username' },
    { label: 'Status', value: 'status' },
  ], []);
  const certColumns = useMemo(() => certQuery.data?.at(0)?.certs?.map(cert => cert.type), [certQuery.data]);
  const fixedColumns = fixedColumnMap.map(item => item.label);
  const allColumns = useMemo(() => fixedColumns.concat(certColumns), [certColumns, fixedColumns]);

  const sortTable = useCallback(
    (column) => {
      const newDirection = direction === 'desc' ? 'asc' : 'desc';
      const fixedKey = fixedColumnMap.find(item => item.label === column)?.value;
      const certSort = function (o) {
        return o?.certs?.find(c => c.type === column)?.description;
      };
      console.log('sort', column, fixedKey, certSort, fixedKey || certSort, certSort(tableData[0]));
      const sortedData = _.orderBy(
        tableData,
        [fixedKey || certSort],
        [newDirection],
      );
      setSelectedColumn(column);
      setDirection(newDirection);
      setTableData(sortedData);
    },
    [direction, fixedColumnMap, tableData],
  );

  const arrowRotation = useMemo(
    () => ({
      transform: [{ rotate: direction === 'desc' ? '270deg' : '90deg' }],
    }),
    [direction],
  );

  const renderTableHeader = useCallback(
    columns => (
      <View style={styles.tableHeader}>
        {columns.map(column => (
          <TouchableOpacity
            key={column}
            style={[styles.columnFlex, styles.columnHeader]}
            onPress={() => sortTable(column)}
          >
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.columnHeaderTxt}>{`${column} `}</Text>
              {selectedColumn === column && (
                <Image
                  style={[styles.arrowImage, arrowRotation]}
                  source={require('@assets/icons/back.png')}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ),
    [arrowRotation, selectedColumn, sortTable],
  );

  const renderCert = useCallback(
    (certs, type) => {
      const cert: display_cert = certs.find(c => c.type === type);
      return (
        <Text
          key={type}
          style={[styles.columnFlex, styles.columnRowTxt, { backgroundColor: cert.color }]}
        >
          {cert?.description}
        </Text>
      );
    },
    [],
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: teamCertsQueryKey });
    queryClient.invalidateQueries({ queryKey: memberListQueryKey });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => {
    setSelectedUser(null);
  };

  return (
    <SafeAreaView style={styles.containerX}>
      <Header title="Certs" backButton />

      <View>
        <View style={styles.container}>
          <ScrollView horizontal>
            <View style={{ width: 600 }}>
              <FlatList
                data={tableData}
                keyExtractor={(item, _index) => item.id}
                ListHeaderComponent={renderTableHeader(allColumns)}
                stickyHeaderIndices={[0]}
                renderItem={({ item }) => {
                  return (
                    <View style={styles.rowContainer}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => setSelectedUser(item.user)}
                        style={[styles.columnFlex, styles.columnRowTxt]}
                      >
                        <Text style={[styles.columnFirst]}>{item.full_name}</Text>
                      </TouchableOpacity>
                      <Text style={[styles.columnFlex, styles.columnRowTxt]}>{item.username}</Text>
                      <Text style={[styles.columnFlex, styles.columnRowTxt]}>{item.status}</Text>
                      {certColumns?.map(cert => renderCert(item.certs, cert))}
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
        </View>
      </View>

      {!!selectedUser && (<UserModal user={selectedUser} onCancel={onClose} />)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerX: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  contentContainer: {
    flex: 1,
  },
  scrollView: {
    marginTop: 0,
    flex: 1,
    paddingTop: 10,
  },

  columnFlex: {
    width: 0,
    // minWidth: 200,
    flex: 1,
    // flexBasis: 1000,
    flexGrow: 1,
    flexShrink: 1,
    alignItems: 'flex-start',
  },
  columnHeaderName: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    // width: 100,
  },
  columnHeader: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#D9D9D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'white',
    // width: 88,
  },
  columnFirst: {
    fontWeight: '800',
  },
  columnHeaderTxt: {
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 20,
    color: 'black',
    fontFamily: 'RedHatDisplay-Bold',
  },
  columnRowTxt: {
    // paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    color: '#3C492C',
    height: 38,
    fontFamily: 'RedHatDisplay-Medium',
  },
  columnRowTxtName: {
    // width: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 18,
    color: '#3C492C',
    height: 38,
    fontFamily: 'RedHatDisplay-Bold',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 16,
    width: '100%',
  },
  tableHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  rowContainer: {
    flexDirection: 'row',
  },
  arrowImage: {
    height: 16,
    width: 16,
    top: 2,
  },
});

export default Page;
