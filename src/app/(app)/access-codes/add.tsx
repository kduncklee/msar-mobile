import type { accessCode } from '@/types/accessCode';
import Header from '@components/Header';
import { CustomTextInput } from '@components/inputs/CustomTextInput';
import LargeButton from '@components/inputs/LargeButton';
import SmallButton from '@components/inputs/SmallButton';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-root-toast';
import { useAccessCodeCreateMutation } from '@/remote/mutation';

export default function AddAccessCodePage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [keywords, setKeywords] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);

  const createMutation = useAccessCodeCreateMutation();

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
        setLatitude(loc.coords.latitude.toString());
        setLongitude(loc.coords.longitude.toString());
        Toast.show('Location updated!', { duration: Toast.durations.SHORT });
      }
    }
    catch (error: any) {
      console.log('Location error:', error);
      setLatitude('34.02591');
      setLongitude('-118.77976');
      Toast.show('Used default location', { duration: Toast.durations.SHORT });
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

    const latNum = Number.parseFloat(latitude);
    const lonNum = Number.parseFloat(longitude);

    const newCode: accessCode = {
      name: name.trim(),
      code: code.trim(),
      keywords: keywords.trim(),
      latitude: Number.isNaN(latNum) ? 0 : latNum,
      longitude: Number.isNaN(lonNum) ? 0 : lonNum,
    };

    createMutation.mutate(newCode, {
      onSuccess: () => {
        Toast.show('Access Code saved!', { duration: Toast.durations.SHORT });
        router.back();
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Add Access Code" backButton />
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
            <SmallButton
              title={gettingLocation ? 'Fetching...' : 'Use Current Location'}
              backgroundColor="rgba(255,255,255,0.15)"
              textColor={colors.yellow}
              onPress={handleUseCurrentLocation}
            />
          </View>
          <View style={styles.coordsRow}>
            <View style={styles.coordField}>
              <CustomTextInput
                value={latitude}
                onChangeText={setLatitude}
                placeholder="Latitude"
                keyboardType="numeric"
              />
            </View>
            <View style={styles.coordField}>
              <CustomTextInput
                value={longitude}
                onChangeText={setLongitude}
                placeholder="Longitude"
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[elements.capsuleButton, styles.saveButton]}
            onPress={handleSave}
            disabled={createMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {createMutation.isPending ? 'Saving...' : 'Save Access Code'}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
