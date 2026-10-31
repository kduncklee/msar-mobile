import type { accessCode } from '@/types/accessCode';
import Header from '@components/Header';
import { CustomTextInput } from '@components/inputs/CustomTextInput';
import SmallButton from '@components/inputs/SmallButton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-root-toast';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCachedAccessCodes, useAccessCodesLocal } from 'storage/mmkv';
import { useAccessCodeDeleteMutation, useAccessCodeUpdateMutation } from '@/remote/mutation';
import { useAccessCodeListQuery } from '@/remote/query';

interface FormLocationPoint {
  key: string;
  latitude: string;
  longitude: string;
  label: string;
}

export default function EditAccessCodePage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idInt = id ? Number.parseInt(id) : Number.NaN;

  const { data: serverCodes } = useAccessCodeListQuery();
  const [cachedCodes] = useAccessCodesLocal();

  const currentCodeItem = (serverCodes ?? cachedCodes ?? getCachedAccessCodes())
    .find(item => item.id === idInt || item.id?.toString() === id || item.name === id);

  const initialLocations: FormLocationPoint[] = currentCodeItem?.locations && currentCodeItem.locations.length > 0
    ? currentCodeItem.locations.map((loc, idx) => ({
        key: loc.id?.toString() ?? `loc-${idx}-${loc.latitude}`,
        latitude: loc.latitude.toString(),
        longitude: loc.longitude.toString(),
        label: loc.label ?? '',
      }))
    : (currentCodeItem?.latitude !== undefined && currentCodeItem?.longitude !== undefined && (currentCodeItem.latitude !== 0 || currentCodeItem.longitude !== 0)
        ? [{
            key: 'initial-primary',
            latitude: currentCodeItem.latitude.toString(),
            longitude: currentCodeItem.longitude.toString(),
            label: '',
          }]
        : []);

  const [name, setName] = useState(currentCodeItem?.name ?? '');
  const [code, setCode] = useState(currentCodeItem?.code ?? '');
  const [keywords, setKeywords] = useState(currentCodeItem?.keywords ?? '');
  const [locations, setLocations] = useState<FormLocationPoint[]>(initialLocations);
  const [gettingLocation, setGettingLocation] = useState(false);

  const updateMutation = useAccessCodeUpdateMutation();
  const deleteMutation = useAccessCodeDeleteMutation();

  const handleAddBlankLocation = () => {
    setLocations(prev => [...prev, { key: Math.random().toString(), latitude: '', longitude: '', label: '' }]);
  };

  const handleRemoveLocation = (index: number) => {
    setLocations(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateLocation = (index: number, field: keyof FormLocationPoint, value: string) => {
    setLocations((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleUseCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Toast.show('Location permission denied', { duration: Toast.durations.SHORT });
        return;
      }
      let loc = await Location.getLastKnownPositionAsync();
      if (!loc) {
        loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Low });
      }
      if (loc) {
        setLocations(prev => [
          ...prev,
          {
            key: Math.random().toString(),
            latitude: loc.coords.latitude.toString(),
            longitude: loc.coords.longitude.toString(),
            label: '',
          },
        ]);
        Toast.show('Current location added!', { duration: Toast.durations.SHORT });
      }
    }
    catch (error: any) {
      console.log('Location error:', error);
      Toast.show('Unable to acquire location', { duration: Toast.durations.SHORT });
    }
    finally {
      setGettingLocation(false);
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Toast.show('Please enter an Access Code Name', { duration: Toast.durations.SHORT });
      return;
    }
    if (!code.trim()) {
      Toast.show('Please enter an Access Code Value', { duration: Toast.durations.SHORT });
      return;
    }

    const parsedLocations = locations
      .map((loc) => {
        const lat = Number.parseFloat(loc.latitude);
        const lon = Number.parseFloat(loc.longitude);
        return {
          latitude: Number.isNaN(lat) ? 0 : lat,
          longitude: Number.isNaN(lon) ? 0 : lon,
          label: loc.label.trim(),
        };
      })
      .filter(loc => loc.latitude !== 0 || loc.longitude !== 0);

    const primaryLat = parsedLocations.length > 0 ? parsedLocations[0].latitude : 0;
    const primaryLon = parsedLocations.length > 0 ? parsedLocations[0].longitude : 0;

    const updatedCode: accessCode = {
      id: idInt,
      name: name.trim(),
      code: code.trim(),
      keywords: keywords.trim(),
      locations: parsedLocations,
      latitude: primaryLat,
      longitude: primaryLon,
    };

    updateMutation.mutate(
      { idInt, code: updatedCode },
      {
        onSuccess: () => {
          Toast.show('Access Code updated!', { duration: Toast.durations.SHORT });
          router.back();
        },
      },
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Access Code',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteMutation.mutate(idInt, {
              onSuccess: () => {
                Toast.show('Access Code deleted!', { duration: Toast.durations.SHORT });
                router.back();
              },
            });
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Edit Access Code"
        backButton
        rightButtonIcon="trash-can-outline"
        onRightPressed={handleDelete}
      />
      <ScrollView style={styles.formContent} keyboardShouldPersistTaps="handled">
        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Access Code Name *</Text>
          <CustomTextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Gate 4 Trailhead"
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Access Code Value *</Text>
          <CustomTextInput
            value={code}
            onChangeText={setCode}
            placeholder="e.g. 4821# or Keybox 2"
          />
        </View>

        <View style={styles.fieldBlock}>
          <Text style={styles.label}>Additional Keywords (Optional)</Text>
          <CustomTextInput
            value={keywords}
            onChangeText={setKeywords}
            placeholder="e.g. gate, water tower, north"
          />
        </View>

        <View style={styles.fieldBlock}>
          <View style={styles.locationHeaderRow}>
            <Text style={styles.label}>GPS Coordinates</Text>
            <View style={styles.locationButtons}>
              <SmallButton
                title="+ Add Location"
                backgroundColor="rgba(255,255,255,0.15)"
                textColor={colors.yellow}
                onPress={handleAddBlankLocation}
              />
              <View style={{ width: 8 }} />
              <SmallButton
                title={gettingLocation ? 'Fetching...' : 'Use Current Location'}
                backgroundColor="rgba(255,255,255,0.15)"
                textColor={colors.yellow}
                onPress={handleUseCurrentLocation}
              />
            </View>
          </View>

          {locations.length === 0
            ? (
                <Text style={styles.noLocationText}>
                  No GPS coordinates added. Tap '+ Add Location' or 'Use Current Location' above.
                </Text>
              )
            : (
                locations.map((loc, index) => (
                  <View key={loc.key} style={styles.locationCard}>
                    <View style={styles.locationCardHeader}>
                      <Text style={styles.locationCardTitle}>
                        Location #
                        {index + 1}
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveLocation(index)} style={styles.deleteLocButton}>
                        <MaterialCommunityIcons name="trash-can-outline" size={20} color="#E53935" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.coordsRow}>
                      <View style={styles.coordField}>
                        <CustomTextInput
                          value={loc.latitude}
                          onChangeText={val => handleUpdateLocation(index, 'latitude', val)}
                          placeholder="Latitude"
                          keyboardType="numeric"
                        />
                      </View>
                      <View style={styles.coordField}>
                        <CustomTextInput
                          value={loc.longitude}
                          onChangeText={val => handleUpdateLocation(index, 'longitude', val)}
                          placeholder="Longitude"
                          keyboardType="numeric"
                        />
                      </View>
                    </View>
                  </View>
                ))
              )}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[elements.capsuleButton, styles.saveButton]}
            onPress={handleSave}
            disabled={updateMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {updateMutation.isPending ? 'Saving...' : 'Update Access Code'}
            </Text>
          </TouchableOpacity>
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
  formContent: {
    flex: 1,
    padding: 16,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primaryText,
    marginBottom: 6,
  },
  locationHeaderRow: {
    flexDirection: 'column',
    marginBottom: 8,
  },
  locationButtons: {
    flexDirection: 'row',
    marginTop: 6,
    flexWrap: 'wrap',
  },
  noLocationText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 6,
  },
  locationCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  locationCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.secondaryYellow,
  },
  deleteLocButton: {
    padding: 4,
  },
  coordsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordField: {
    width: '48%',
  },
  buttonRow: {
    marginTop: 16,
    marginBottom: 40,
  },
  saveButton: {
    height: 56,
    width: '100%',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.black,
    textAlign: 'center',
  },
});
