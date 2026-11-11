import type { accessCode } from '@/types/accessCode';
import Header from '@components/Header';
import { CustomTextInput } from '@components/inputs/CustomTextInput';
import colors from '@styles/colors';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCachedAccessCodes, storeCachedAccessCodes, useAccessCodesLocal } from 'storage/mmkv';
import { AccessCodeCell } from '@/components/access-codes/AccessCodeCell';
import { useAccessCodeListQuery } from '@/remote/query';

export default function SearchAccessCodesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: serverCodes, isLoading } = useAccessCodeListQuery();
  const [cachedCodes, setCachedCodes] = useAccessCodesLocal();

  useEffect(() => {
    if (serverCodes && Array.isArray(serverCodes)) {
      setCachedCodes(serverCodes);
      storeCachedAccessCodes(serverCodes);
    }
  }, [serverCodes, setCachedCodes]);

  const accessCodesList: accessCode[] = useMemo(() => {
    if (serverCodes && Array.isArray(serverCodes)) {
      return serverCodes;
    }
    return cachedCodes ?? getCachedAccessCodes();
  }, [serverCodes, cachedCodes]);

  const filteredCodes = useMemo(() => {
    if (!searchTerm.trim()) {
      return accessCodesList;
    }
    const term = searchTerm.toLowerCase().trim();
    return accessCodesList.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(term);
      const keywordsMatch = item.keywords?.toLowerCase().includes(term);
      const codeMatch = item.code.toLowerCase().includes(term);
      return nameMatch || keywordsMatch || codeMatch;
    });
  }, [accessCodesList, searchTerm]);

  const renderAccessCodeItem = useCallback(({ item }: { item: accessCode }) => (
    <AccessCodeCell item={item} />
  ), []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Search Access Codes" backButton />
      <View style={styles.searchContainer}>
        <CustomTextInput
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholder="Search by name, code or keyword..."
          icon="magnify"
        />
        <Text style={styles.confidentialText}>Confidential, Team Use Only</Text>
      </View>
      <FlatList
        data={filteredCodes}
        keyExtractor={item => item.id?.toString() ?? item.name}
        renderItem={renderAccessCodeItem}
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS === 'android'}
        ListEmptyComponent={(
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isLoading ? 'Loading access codes...' : 'No matching access codes found.'}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  searchContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  confidentialText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.secondaryYellow,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.primaryText,
    fontSize: 16,
  },
});
