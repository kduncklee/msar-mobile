import type { accessCode } from '@/types/accessCode';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import React, { memo, useState } from 'react';
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import ModalFade from '@/components/modals/common/ModalFade';
import { useAccessCodeUpdateMutation } from '@/remote/mutation';
import { getPaddedDateString } from '@/utility/dateHelper';

interface AccessCodeCellProps {
  item: accessCode;
  distanceInMiles?: number;
  onDelete?: (id: number) => void;
}

function AccessCodeCellComponent({ item, distanceInMiles, onDelete }: AccessCodeCellProps) {
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const updateMutation = useAccessCodeUpdateMutation();

  const locationsList = item.locations && item.locations.length > 0
    ? item.locations
    : (item.latitude !== undefined && item.longitude !== undefined && (item.latitude !== 0 || item.longitude !== 0)
        ? [{ latitude: item.latitude, longitude: item.longitude }]
        : []);

  const copyCodeToClipboard = async () => {
    const lines = [
      `Name: ${item.name}`,
      `Code: ${item.code}`,
    ];
    if (item.notes) {
      lines.push(`Notes: ${item.notes}`);
    }
    if (locationsList.length === 1) {
      lines.push(`Location: ${locationsList[0].latitude.toFixed(5)}, ${locationsList[0].longitude.toFixed(5)}`);
    }
    else if (locationsList.length > 1) {
      lines.push('Locations:');
      locationsList.forEach((loc, index) => {
        const labelStr = loc.label ? ` (${loc.label})` : '';
        lines.push(`  ${index + 1}. ${loc.latitude.toFixed(5)}, ${loc.longitude.toFixed(5)}${labelStr}`);
      });
    }
    const textToCopy = lines.join('\n');

    await Clipboard.setStringAsync(textToCopy);
    Toast.show('Copied to clipboard!', {
      duration: Toast.durations.SHORT,
    });
  };

  const handleEdit = () => {
    router.push({
      pathname: '/access-codes/edit',
      params: { id: (item.id ?? item.name)?.toString() },
    });
  };

  const openNotes = () => {
    router.push({
      pathname: '/access-codes/accesscodenotes',
      params: {
        id: (item.id ?? item.name)?.toString(),
        name: item.name,
        notes: item.notes,
      },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Access Code',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (item.id !== undefined && onDelete) {
              onDelete(item.id);
            }
          },
        },
      ],
    );
  };

  const handleVerify = (isGood: boolean) => {
    if (item.id === undefined) {
      return;
    }
    const updatedCode: accessCode = {
      ...item,
      verified_good: isGood,
      last_verified_at: new Date().toISOString(),
    };
    updateMutation.mutate(
      { idInt: item.id, code: updatedCode },
      {
        onSuccess: () => {
          Toast.show(isGood ? 'Marked as Verified Good!' : 'Marked as Unverified / Issue', {
            duration: Toast.durations.SHORT,
          });
          setShowVerifyModal(false);
        },
      },
    );
  };

  const openMapApp = (lat: number, lon: number, labelName?: string) => {
    const label = encodeURIComponent(labelName || item?.name || 'Access Code Location');

    if (Platform.OS === 'ios') {
      const url = `maps:0,0?q=${label}@${lat},${lon}`;
      Linking.openURL(url);
    }
    else {
      const url = `geo:0,0?q=${lat},${lon}(${label})`;
      Linking.openURL(url).catch(() => {
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`);
      });
    }
  };

  const isBad = item.verified_good === false;
  const verifiedDate = item.last_verified_at ? new Date(item.last_verified_at) : null;
  const verifiedLabel = verifiedDate
    ? getPaddedDateString(verifiedDate, false)
    : 'Verify';

  return (
    <View style={[elements.tray, styles.container, isBad && styles.badContainer]}>
      <View style={styles.headerRow}>
        <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
        <TouchableOpacity onPress={() => setShowVerifyModal(true)} style={styles.verifiedBadgeButton}>
          <MaterialCommunityIcons
            name={isBad ? 'close-circle-outline' : 'check-circle-outline'}
            size={14}
            color={isBad ? '#FF6B6B' : colors.secondaryYellow}
          />
          <Text style={[styles.verifiedBadgeText, isBad && styles.badVerifiedText]}>
            {verifiedLabel}
          </Text>
        </TouchableOpacity>
        <View style={styles.actionIcons}>
          <TouchableOpacity onPress={handleEdit} style={styles.iconButton}>
            <MaterialCommunityIcons name="pencil" size={20} color={colors.primaryText} />
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.iconButton}>
              <MaterialCommunityIcons name="trash-can-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.codeRow}>
        <Text style={styles.codeLabel}>Code:</Text>
        <Text style={styles.codeValue} selectable>{item.code}</Text>
        {!!item.notes?.trim() && (
          <TouchableOpacity onPress={openNotes} style={styles.notesButton}>
            <MaterialCommunityIcons name="notebook-outline" size={16} color={colors.secondaryYellow} />
            <Text style={styles.notesLinkText}>Notes</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={copyCodeToClipboard} style={styles.copyButton}>
          <MaterialCommunityIcons name="content-copy" size={18} color={colors.primaryText} />
          <Text style={styles.copyText}>Copy</Text>
        </TouchableOpacity>
      </View>

      {!!item.keywords && (
        <Text style={styles.keywordsText}>
          Keywords:
          {' '}
          {item.keywords}
        </Text>
      )}

      {locationsList.map((loc, index) => (
        <TouchableOpacity
          key={loc.id ?? `${loc.latitude}-${loc.longitude}-${index}`}
          activeOpacity={0.7}
          onPress={() => openMapApp(loc.latitude, loc.longitude, loc.label)}
          style={styles.locationRow}
        >
          <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.secondaryYellow} />
          <Text style={[styles.locationText, styles.clickableLocation]}>
            {loc.label ? `${loc.label}: ` : ''}
            {loc.latitude.toFixed(5)}
            ,
            {' '}
            {loc.longitude.toFixed(5)}
          </Text>
          <MaterialCommunityIcons name="open-in-new" size={14} color={colors.secondaryYellow} style={{ marginLeft: 4 }} />
          {index === 0 && typeof distanceInMiles === 'number' && (
            <Text style={styles.distanceBadge}>
              {distanceInMiles < 0.1 ? 'Right here' : `${distanceInMiles.toFixed(2)} mi away`}
            </Text>
          )}
        </TouchableOpacity>
      ))}

      {showVerifyModal && (
        <ModalFade
          modalVisible={showVerifyModal}
          onCancel={() => setShowVerifyModal(false)}
          headerTitle="Verify Access Code"
        >
          <View style={styles.modalBody}>
            <Text style={styles.modalTitle}>{item.name}</Text>
            <Text style={styles.modalSubtitle}>Is this access code working correctly?</Text>

            <View style={styles.thumbsContainer}>
              <TouchableOpacity
                style={[styles.thumbButton, styles.thumbUpButton]}
                onPress={() => handleVerify(true)}
              >
                <MaterialCommunityIcons name="thumb-up" size={36} color="#FFFFFF" />
                <Text style={styles.thumbButtonText}>Working / Good</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.thumbButton, styles.thumbDownButton]}
                onPress={() => handleVerify(false)}
              >
                <MaterialCommunityIcons name="thumb-down" size={36} color="#FFFFFF" />
                <Text style={styles.thumbButtonText}>Issue / Bad Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ModalFade>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
  },
  badContainer: {
    backgroundColor: 'rgba(110, 25, 25, 0.85)',
    borderColor: 'rgba(230, 70, 70, 0.6)',
    borderWidth: 1.5,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primaryText,
    flex: 1,
  },
  verifiedBadgeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    marginHorizontal: 6,
  },
  verifiedBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryYellow,
    marginLeft: 4,
  },
  badVerifiedText: {
    color: '#FF6B6B',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 4,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    padding: 8,
    borderRadius: 6,
  },
  codeLabel: {
    fontSize: 14,
    color: '#AAA',
    marginRight: 6,
  },
  codeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryText,
    flex: 1,
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 4,
    marginRight: 6,
  },
  notesLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.secondaryYellow,
    marginLeft: 3,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 4,
  },
  copyText: {
    fontSize: 12,
    color: colors.primaryText,
    marginLeft: 4,
  },
  keywordsText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#CCC',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  locationText: {
    fontSize: 13,
    color: colors.primaryText,
    marginLeft: 4,
  },
  clickableLocation: {
    color: colors.secondaryYellow,
    textDecorationLine: 'underline',
  },
  distanceBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFD700',
    marginLeft: 'auto',
  },
  modalBody: {
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 24,
    textAlign: 'center',
  },
  thumbsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  thumbButton: {
    width: '45%',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbUpButton: {
    backgroundColor: '#2E7D32',
  },
  thumbDownButton: {
    backgroundColor: '#C62828',
  },
  thumbButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export const AccessCodeCell = memo(AccessCodeCellComponent);
