import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '@components/Header';
import colors, { textColorForBackground } from '@styles/colors';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import { memberListQueryKey, teamCertsQueryKey, useMemberListQuery, useTeamCertsQuery } from '@/remote/query';
import type { user_detail } from '@/types/user';
import UserModal from '@/components/modals/UserModal';
import useStatusBarColor from '@/hooks/useStatusBarColor';
import type { display_cert, member_cert_summary_ext } from '@/types/cert';
import type { LabelValue } from '@/utility/reactForm';
import { elements } from '@/styles/elements';

function Page() {
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [selectedUser, setSelectedUser] = useState<user_detail>(null);
  useStatusBarColor();

  const queryClient = useQueryClient();
  const certQuery = useTeamCertsQuery();
  const memberQuery = useMemberListQuery();

  const fixedColumnMap: LabelValue[] = useMemo(() => [
    { label: 'Name', value: 'full_name' },
    { label: 'ID', value: 'username' },
    { label: 'Status', value: 'status' },
  ], []);
  const certColumns = useMemo(() => certQuery.data?.at(0)?.certs?.map(cert => cert.type_display || cert.type), [certQuery.data]);
  const fixedColumns = fixedColumnMap.map(item => item.label);
  const allColumns = useMemo(() => fixedColumns.concat(certColumns), [certColumns, fixedColumns]);
  const columnWidthExtra = 5;
  const minColumnWidth = 15;
  const [columnWidths, setColumnWidths] = useState(allColumns.map(_ => minColumnWidth));

  useEffect(() => {
    const data = [];
    certQuery.data?.forEach((item) => {
      const combined: member_cert_summary_ext = { ...item };
      const user = memberQuery.data?.find(user => user.id === item.id);
      combined.user = user;
      combined.username = user?.username;
      data.push(combined);
    });
    setTableData(data);
  }, [certQuery.data, memberQuery.data]);

  // console.log('tableData', tableData);
  // console.log('tableData[0]', tableData?.at(0));

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

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: teamCertsQueryKey });
    queryClient.invalidateQueries({ queryKey: memberListQueryKey });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onClose = () => {
    setSelectedUser(null);
  };

  const updateMaxWidth = useCallback((index: number, event: LayoutChangeEvent) => {
    const width = event?.nativeEvent?.layout?.width;
    if (width > columnWidths[index] + columnWidthExtra) {
      const copy = [...columnWidths];
      copy[index] = width;
      console.log('update', index, width, columnWidths[index] + columnWidthExtra, columnWidths[index]);
      setColumnWidths(copy);
    }
  }, [columnWidths]);

  const renderTableHeader = useCallback(
    columns => (
      <View style={styles.tableHeader}>
        {columns.map((column, index) => (
          <TouchableOpacity
            key={column}
            style={[styles.columnHeader, { minWidth: columnWidths[index] }]}
            onLayout={event => updateMaxWidth(index, event)}
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
    [arrowRotation, columnWidths, selectedColumn, sortTable, updateMaxWidth],
  );

  const renderCert = useCallback(
    (certs, type, index) => {
      const cert: display_cert = certs.find(c => c.type === type);
      const columnIndex = fixedColumns.length + index;
      return (
        <Text
          key={type}
          style={[styles.columnRowTxt, {
            backgroundColor: cert?.color,
            color: textColorForBackground(cert?.color),
            minWidth: columnWidths[columnIndex],
          }]}
          onLayout={event => updateMaxWidth(columnIndex, event)}
        >
          {cert?.description}
        </Text>
      );
    },
    [columnWidths, fixedColumns.length, updateMaxWidth],
  );

  const renderRow = useCallback(
    ({ item }) => {
      return (
        <View style={styles.rowContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setSelectedUser(item.user)}
            style={[styles.columnRowTxt, { minWidth: columnWidths[0] }]}
            onLayout={event => updateMaxWidth(0, event)}
          >
            <Text style={[styles.columnFirstTxt]}>{item.full_name}</Text>
          </TouchableOpacity>
          <Text
            style={[styles.columnRowTxt, { minWidth: columnWidths[1] }]}
            onLayout={event => updateMaxWidth(1, event)}
          >
            {item.username}
          </Text>
          <Text
            style={[styles.columnRowTxt, { minWidth: columnWidths[2] }]}
            onLayout={event => updateMaxWidth(2, event)}
          >
            {item.status}
          </Text>
          {certColumns?.map((cert, index) => renderCert(item.certs, cert, index))}
        </View>
      );
    },
    [certColumns, columnWidths, renderCert, updateMaxWidth],
  );

  if (!tableData.length) {
    return (
      <SafeAreaView style={styles.containerTop}>
        <Header title="Certs" backButton />
        <Text style={elements.mediumText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.containerTop}>
      <Header title="Certs" backButton />

      <View style={styles.container}>
        <ScrollView horizontal style={{ }}>
          <FlatList
            contentContainerStyle={{ paddingBottom: 100 }}
            data={tableData}
            keyExtractor={item => item.id}
            ListHeaderComponent={renderTableHeader(allColumns)}
            stickyHeaderIndices={[0]}
            renderItem={renderRow}
          />
        </ScrollView>
      </View>

      {!!selectedUser && (<UserModal user={selectedUser} onCancel={onClose} />)}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  containerTop: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },

  columnHeader: {
    borderWidth: 1,
    borderColor: colors.secondaryBg,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: colors.secondaryBg,
    minWidth: 20,
  },
  columnHeaderTxt: {
    fontWeight: '800',
    color: colors.primaryText,
  },
  columnFirstTxt: {
    fontWeight: '600',
    color: colors.primaryText,
  },
  columnRowTxt: {
    minWidth: 20,
    paddingHorizontal: 5,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.secondaryBg,
    fontWeight: '400',
    color: colors.primaryText,
  },
  container: {
    width: '100%',
    height: '100%',
    padding: 5,
  },
  tableHeader: {
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
