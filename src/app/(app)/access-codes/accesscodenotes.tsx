import Header from '@components/Header';
import colors from '@styles/colors';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCachedAccessCodes, useAccessCodesLocal } from 'storage/mmkv';
import { useAccessCodeListQuery } from '@/remote/query';

export default function AccessCodeNotesPage() {
  const { id, name, notes: paramNotes } = useLocalSearchParams<{ id?: string; name?: string; notes?: string }>();
  const idInt = id ? Number.parseInt(id) : Number.NaN;

  const { data: serverCodes } = useAccessCodeListQuery();
  const [cachedCodes] = useAccessCodesLocal();

  const codeItem = (serverCodes ?? cachedCodes ?? getCachedAccessCodes())
    ?.find(item => item.id === idInt || item.id?.toString() === id || item.name === id || item.name === name);

  const notesText = codeItem?.notes || paramNotes || 'No notes available.';
  const titleName = codeItem?.name || name || 'Access Code';

  return (
    <SafeAreaView style={styles.container}>
      <Header title={`${titleName} - Notes`} backButton />
      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.notesText} selectable>
            {notesText}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    minHeight: 150,
  },
  notesText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.primaryText,
  },
});
