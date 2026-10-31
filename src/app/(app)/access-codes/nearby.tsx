import type { accessCode } from '@/types/accessCode';
import Header from '@components/Header';
import colors from '@styles/colors';
import * as Location from 'expo-location';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCachedAccessCodes, useAccessCodesLocal } from 'storage/mmkv';
import { AccessCodeCell } from '@/components/access-codes/AccessCodeCell';
import { useAccessCodeListQuery } from '@/remote/query';
import { calculateDistanceInMiles } from '@/utility/locationHeler';

interface CodeWithDistance {
  item: accessCode;
  distance: number;
}

export default function NearbyAccessCodesPage() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const { data: serverCodes } = useAccessCodeListQuery();
  const [cachedCodes] = useAccessCodesLocal();

  const accessCodesList: accessCode[] = useMemo(() => {
    if (serverCodes && Array.isArray(serverCodes)) {
      return serverCodes;
    }
    return cachedCodes ?? getCachedAccessCodes();
  }, [serverCodes, cachedCodes]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let location = await Location.getLastKnownPositionAsync();
          if (!location) {
            location = await Location.getCurrentPositionAsync({
              accuracy: Location.Accuracy.Low,
            });
          }
          if (location && isMounted) {
            setUserLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });
          }
        }
      }
      catch (error) {
        console.log('Error acquiring position:', error);
        if (isMounted) {
          setUserLocation({ latitude: 34.02591, longitude: -118.77976 });
        }
      }
      finally {
        if (isMounted) {
          setLoadingLocation(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const nearbyCodes: CodeWithDistance[] = useMemo(() => {
    if (!userLocation || accessCodesList.length === 0) {
      return [];
    }
    const withDistance = accessCodesList.map((item) => {
      const dist = calculateDistanceInMiles(
        userLocation.latitude,
        userLocation.longitude,
        item.latitude,
        item.longitude,
      );
      return { item, distance: dist };
    });

    withDistance.sort((a, b) => a.distance - b.distance);
    return withDistance.slice(0, 15);
  }, [userLocation, accessCodesList]);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Nearby Access Codes" backButton />
      {loadingLocation
        ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primaryText} />
              <Text style={styles.loadingText}>Acquiring current GPS location...</Text>
            </View>
          )
        : (
            <FlatList
              data={nearbyCodes}
              keyExtractor={({ item: codeItem }) => codeItem.id?.toString() ?? codeItem.name}
              renderItem={({ item: { item: codeItem, distance } }) => (
                <AccessCodeCell item={codeItem} distanceInMiles={distance} />
              )}
              ListEmptyComponent={(
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {!userLocation
                      ? 'GPS Location unavailable. Please enable location permissions.'
                      : 'No nearby access codes found.'}
                  </Text>
                </View>
              )}
            />
          )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: colors.primaryText,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.primaryText,
    fontSize: 16,
    textAlign: 'center',
  },
});
