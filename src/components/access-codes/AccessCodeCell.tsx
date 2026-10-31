import type { accessCode } from '@/types/accessCode';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { Alert, Linking, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';

interface AccessCodeCellProps {
  item: accessCode;
  distanceInMiles?: number;
  onDelete?: (id: number) => void;
}

export function AccessCodeCell({ item, distanceInMiles, onDelete }: AccessCodeCellProps) {
  const copyCodeToClipboard = async () => {
    const lines = [
      `Name: ${item.name}`,
      `Code: ${item.code}`,
      `Location: ${(item?.latitude ?? 0).toFixed(5)}, ${(item?.longitude ?? 0).toFixed(5)}`,
    ];
    if (item.keywords) {
      lines.push(`Keywords: ${item.keywords}`);
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

  const openMapApp = () => {
    const lat = item?.latitude ?? 0;
    const lon = item?.longitude ?? 0;
    const label = encodeURIComponent(item?.name ?? 'Access Code Location');

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

  return (
    <View style={[elements.tray, styles.container]}>
      <View style={styles.headerRow}>
        <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
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

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={openMapApp}
        style={styles.locationRow}
      >
        <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.secondaryYellow} />
        <Text style={[styles.locationText, styles.clickableLocation]}>
          {(item?.latitude ?? 0).toFixed(5)}
          ,
          {(item?.longitude ?? 0).toFixed(5)}
        </Text>
        <MaterialCommunityIcons name="open-in-new" size={14} color={colors.secondaryYellow} style={{ marginLeft: 4 }} />
        {typeof distanceInMiles === 'number' && (
          <Text style={styles.distanceBadge}>
            {distanceInMiles < 0.1 ? 'Right here' : `${distanceInMiles.toFixed(2)} mi away`}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
    padding: 12,
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
});
