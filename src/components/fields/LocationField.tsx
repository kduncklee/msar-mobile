import React from 'react';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import { elements } from '@styles/elements';
import colors from '@styles/colors';
import type { LatLng, Region } from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';
import { coordinateFromString } from '@utility/locationHeler';
import * as Clipboard from 'expo-clipboard';
import SmallButton from '../inputs/SmallButton';
import { locationToShortString, locationToString } from '@/types/location';
import type { location } from '@/types/location';
import { locationType } from '@/types/enums';

interface LocationFieldProps {
  location: location;
};

function LocationField({ location }: LocationFieldProps) {
  let locType: locationType = null;
  let coordinates: LatLng = { latitude: 0, longitude: 0 };

  const defaultRegion: Region = {
    latitude: 34.050783236893395,
    longitude: -118.83192890478199,
    latitudeDelta: 0.2091139902085246,
    longitudeDelta: 0.1355799588636216,
  };

  const copyPressed = async () => {
    await Clipboard.setStringAsync(locationToString(location));
  };

  const openMapPressed = () => {
    const address = locationToString(location);
    const mapUrl = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });

    Linking.openURL(mapUrl).catch(err => console.error('An error occurred', err));
  };

  if (location?.coordinates?.lat != null && location?.coordinates?.long != null) {
    coordinates = coordinateFromString(`${location.coordinates.lat}, ${location.coordinates.long}`);
    defaultRegion.latitude = coordinates.latitude;
    defaultRegion.longitude = coordinates.longitude;
  }

  if (location.address?.street) {
    locType = locationType.ADDRESS;
  }
  else if (coordinates.latitude) {
    locType = locationType.COORDINATES;
  }
  else if (location.text) {
    locType = locationType.DESCRIPTION;
  }

  return (
    <View style={styles.container}>
      {locType === locationType.DESCRIPTION
      && <Text style={[elements.mediumText, { padding: 8 }]}>{location.text}</Text>}

      {(locType === locationType.COORDINATES || locType === locationType.ADDRESS)
      && (
        <>
          <MapView style={styles.mapContainer} region={defaultRegion}>
            {coordinates
            && (
              <Marker
                coordinate={coordinates}
                title={(locType === locationType.ADDRESS)
                  ? locationToShortString(location)
                  : 'Location'}
              />
            )}
          </MapView>
          <Text style={[elements.smallText, { margin: 16 }]} selectable>
            {locationToString(location)}
          </Text>
          {location.text
          && (
            <Text style={[elements.smallText, { marginHorizontal: 16, marginBottom: 16 }]} selectable>
              {location.text}
            </Text>
          )}
          <View style={styles.buttonTray}>
            <SmallButton
              title="Open Map"
              icon={require('@assets/icons/navigation.png')}
              backgroundColor={colors.blue}
              textColor={colors.primaryText}
              onPress={() => openMapPressed()}
            />
            <View style={{ width: 12 }} />
            <SmallButton
              title="Copy"
              icon={require('@assets/icons/copy.png')}
              backgroundColor={colors.darkBlue}
              textColor={colors.primaryText}
              onPress={() => copyPressed()}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  mapContainer: {
    height: 120,
  },
  buttonTray: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 16,
  },
});

export default LocationField;
