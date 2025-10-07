import type { display_cert, member_cert_summary_ext } from '@/types/cert';
import type { user_detail } from '@/types/user';
import type { LabelValue } from '@/utility/reactForm';
import Header from '@components/Header';
import colors, { textColorForBackground } from '@styles/colors';
import { useQueryClient } from '@tanstack/react-query';
import _ from 'lodash';
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import UserModal from '@/components/modals/UserModal';
import useStatusBarColor from '@/hooks/useStatusBarColor';
import { memberListQueryKey, teamCertsQueryKey, useMemberListQuery, useTeamCertsQuery } from '@/remote/query';
import { elements } from '@/styles/elements';

function Page() {
  const [direction, setDirection] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
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
  const minColumnWidth = 15;
  const [columnWidths, setColumnWidths] = useState(() => allColumns.map(_ => minColumnWidth));
  const cellRefs = useRef([]);

  const unsortedData = [];
  certQuery.data?.forEach((item) => {
    const combined: member_cert_summary_ext = { ...item };
    const user = memberQuery.data?.find(user => user.id === item.id);
    combined.user = user;
    combined.username = user?.username;
    unsortedData.push(combined);
  });

  let sortedData = unsortedData;
  if (selectedColumn && direction) {
    const fixedKey = fixedColumnMap.find(item => item.label === selectedColumn)?.value;
    const certSort = function (o) {
      return o?.certs?.find(c => c.type === selectedColumn)?.description;
    };
    // console.log('sort', column, fixedKey, certSort, fixedKey || certSort, certSort(tableData[0]));
    sortedData = _.orderBy(
      unsortedData,
      [fixedKey || certSort],
      [direction],
    );
  }
  const tableData = sortedData;

  console.log('columns', allColumns, columnWidths);
  // console.log('tableData', tableData);
  // console.log('tableData[0]', tableData?.at(0));

  const sortTable = useCallback(
    (column) => {
      if (column === selectedColumn) {
        const newDirection = direction === 'desc' ? 'asc' : 'desc';
        setDirection(newDirection);
      }
      else {
        setDirection('asc');
      }
      setSelectedColumn(column);
    },
    [direction, selectedColumn],
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

  useLayoutEffect(() => {
    const widths = [...columnWidths]; // allColumns.map(_ => minColumnWidth);
    let updated = false;
    console.log('useLayoutEffect', widths, cellRefs.current.length);

    for (let rowIndex = 0; rowIndex < cellRefs.current.length; rowIndex++) {
      const row = cellRefs.current[rowIndex];
      for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
        const cell = row[columnIndex];
        if (cell) {
          cell.measureInWindow((_x, _y, width, _height) => {
            if (width > widths[columnIndex]) {
              console.log(columnIndex, widths[columnIndex], width);
              widths[columnIndex] = width;
              updated = true;
            }
          });
        }
      }
    }
    if (updated) {
      console.log('updating', columnWidths, widths);
      setColumnWidths(widths);
    }
  }, [allColumns, columnWidths, setColumnWidths]);

  const updateRef = (el, rowIndex, columnIndex) => {
    if (!cellRefs.current[rowIndex]) {
      cellRefs.current[rowIndex] = [];
    }
    cellRefs.current[rowIndex][columnIndex] = el;
  };

  const renderTableHeader = useCallback(
    columns => (
      <View style={styles.tableHeader}>
        {columns.map((column, index) => (
          <TouchableOpacity
            key={column}
            style={[styles.columnHeader, { minWidth: columnWidths[index] }]}
            onPress={() => sortTable(column)}
            ref={el => updateRef(el, 0, index)}
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
    [arrowRotation, columnWidths, selectedColumn, sortTable],
  );

  const renderCert = useCallback(
    (certs, type, rowIndex, index) => {
      const cert: display_cert = certs.find(c => c.type === type);
      const columnIndex = fixedColumns.length + index;
      return (
        <Text
          key={type}
          ref={el => updateRef(el, rowIndex, columnIndex)}
          style={[styles.columnRowTxt, {
            backgroundColor: cert?.color,
            color: textColorForBackground(cert?.color),
            minWidth: columnWidths[columnIndex],
          }]}
        >
          {cert?.description}
        </Text>
      );
    },
    [columnWidths, fixedColumns.length],
  );

  const renderRow = useCallback(
    ({ item, index }) => {
      const rowIndex = index + 1; // add 1 for header row
      return (
        <View style={styles.rowContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setSelectedUser(item.user)}
            style={[styles.columnRowTxt, { minWidth: columnWidths[0] }]}
            ref={el => updateRef(el, rowIndex, 0)}
          >
            <Text style={[styles.columnFirstTxt]}>{item.full_name}</Text>
          </TouchableOpacity>
          <Text
            style={[styles.columnRowTxt, { minWidth: columnWidths[1] }]}
            ref={el => updateRef(el, rowIndex, 1)}
          >
            {item.username}
          </Text>
          <Text
            style={[styles.columnRowTxt, { minWidth: columnWidths[2] }]}
            ref={el => updateRef(el, rowIndex, 2)}
          >
            {item.status}
          </Text>
          {certColumns?.map((cert, columnIndex) => renderCert(item.certs, cert, rowIndex, columnIndex))}
        </View>
      );
    },
    [certColumns, columnWidths, renderCert],
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
