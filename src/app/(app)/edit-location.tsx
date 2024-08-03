import { useEffect, useRef, useState } from 'react';
import { Alert, Image, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Header from '@components/Header';
import colors from '@styles/colors';
import { elements } from '@styles/elements';
import { router } from 'expo-router';
import type { LatLng, LongPressEvent, MapMarker, Region } from 'react-native-maps';
import MapView, { Marker } from 'react-native-maps';
import { coordinateFromString } from '@utility/locationHeler';
import FormTextInput from '@components/inputs/FormTextInput';
import { geocodeAddress } from '@remote/google-maps';
import ActivityModal from '@components/modals/ActivityModal';
import type { geocodeAddressResponse } from '@remote/responses';
import LocationSelectionModal from '@components/modals/LocationSelectModal';
import type { location } from '@/types/location';
import { locationToShortString, locationToString } from '@/types/location';
import { useEditingLocation } from '@/storage/mmkv';
import { handleBackPressed, useBackHandler } from '@/utility/backHandler';

function Page() {
  const markerRef = useRef<MapMarker>();
  const [showSpinner, setShowSpinner] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [editingLocation, setEditingLocation] = useEditingLocation();
  const [currentLocation, setCurrentLocation] = useState<location>(null);
  const [defaultRegion, setDefaultRegion] = useState<Region>({
    latitude: 34.050783236893395,
    longitude: -118.83192890478199,
    latitudeDelta: 0.9091139902085246,
    longitudeDelta: 0.5355799588636216,
  });
  const [addressText, setAddressText] = useState('');
  const [searchResults, setSearchResults] = useState<location[]>([]);
  const locationChanged = (currentLocation?.coordinates != null) && (
    (editingLocation == null) || (editingLocation.coordinates == null)
    || (editingLocation.coordinates.lat !== currentLocation.coordinates.lat)
    || (editingLocation.coordinates.long !== currentLocation.coordinates.long)
  );
  useBackHandler(locationChanged);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      StatusBar.setBarStyle('light-content');
    }
    else if (Platform.OS === 'android') {
      StatusBar.setBackgroundColor(colors.primaryBg);
    }
  }, []);

  useEffect(() => {
    console.log('editing location', locationToString(editingLocation));
    setLocation(editingLocation);
  }, [editingLocation]);

  useEffect(() => {
    if (currentLocation?.coordinates != null
      && !!currentLocation.coordinates.lat
      && !!currentLocation.coordinates.long) {
      const coordinate = coordinateFromString(`${currentLocation.coordinates.lat}, ${currentLocation.coordinates.long}`);
      setDefaultRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: 0.4,
        longitudeDelta: 0.2,
      });
    }
  }, [currentLocation]);

  const backPressed = () => {
    handleBackPressed(locationChanged);
  };

  const onMapLongPress = (event: LongPressEvent) => {
    if (markerRef.current != null) {
      markerRef.current.hideCallout();
    }

    setLocation({
      coordinates: {
        lat: event.nativeEvent.coordinate.latitude.toFixed(6),
        long: event.nativeEvent.coordinate.longitude.toFixed(6),
      },
    });
  };

  const onRegionChange = (region: Region) => {
    console.log(region);
  };

  // Save the location and return.
  const onLocationSelect = () => {
    setEditingLocation(currentLocation);

    if (currentLocation?.coordinates != null) {
      router.back();
    }
  };

  const onAddressChange = (text: string) => {
    setAddressText(text);
  };

  const searchPressed = () => {
    Keyboard.dismiss();
    performAddressSearch();
  };

  const performAddressSearch = async () => {
    if (addressText.length === 0) {
      return;
    }

    // Check if it is already lat, long. If so, do not search.
    // eslint-disable-next-line regexp/no-super-linear-backtracking
    const latlongRegex = /^\s*(-?\d+\.\d+)\s*(?:[,/][,/ ]*| )\s*(-?\d+\.\d+)\s*$/;
    const match = addressText.match(latlongRegex);
    console.log('search', addressText, match);
    if (match) {
      const location = {
        coordinates: {
          lat: match[1].toString(),
          long: match[2].toString(),
        },
      };
      setLocation(location);
      return;
    }

    // Run the search.
    setShowSpinner(true);
    if (markerRef.current != null) {
      markerRef.current.hideCallout();
    }
    const response: geocodeAddressResponse = await geocodeAddress(addressText);
    setShowSpinner(false);

    if (response.status === 'OK') {
      if (response.results.length === 1) {
        console.log(response.results[0]);
        setLocation(response.results[0]);
      }
      else {
        const tmpResults: location[] = [];
        response.results.forEach((location: location) => {
          tmpResults.push(location);
        });

        setSearchResults(tmpResults);
        setShowSearchResults(true);
      }
    }
    else if (response.status === 'ZERO_RESULTS') {
      Alert.alert(
        'No Results',
        'Try searching for a different address',
        [
          {
            text: 'OK',
          },
        ],
      );
    }
  };

  const setLocation = (location: location) => {
    setCurrentLocation(location);
    if (markerRef.current != null) {
      markerRef.current.showCallout();
    }
  };

  const searchResultSelected = (location: location) => {
    setLocation(location);
    setShowSearchResults(false);
  };

  const onSearchResultClose = () => {
    setShowSearchResults(false);
  };

  let currentCoordinate: LatLng = null;
  if (currentLocation?.coordinates != null) {
    currentCoordinate = coordinateFromString(`${currentLocation.coordinates.lat}, ${currentLocation.coordinates.long}`);
  }

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.container}>
          <Header title="Select Location" backButton onBackPressed={backPressed} />
          <View style={styles.contentContainer}>
            <MapView
              style={styles.map}
              onLongPress={onMapLongPress}
              onRegionChangeComplete={onRegionChange}
              initialRegion={defaultRegion}
              region={defaultRegion}
            >
              {currentLocation && currentCoordinate
              && (
                <Marker
                  ref={markerRef}
                  coordinate={currentCoordinate}
                  title={locationToShortString(currentLocation)}
                />
              )}
            </MapView>
            <View style={[elements.tray, { margin: 20, position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, paddingTop: 0 }]}>
              <View style={styles.searchBar}>
                <FormTextInput
                  onChange={onAddressChange}
                  placeholder="Search..."
                  returnKey="search"
                  onSubmit={performAddressSearch}
                  autoCorrect={false}
                />
                <TouchableOpacity activeOpacity={0.5} style={[styles.button, { backgroundColor: colors.blue }]} onPress={searchPressed}>
                  <Image source={require('@assets/icons/location_search.png')} style={styles.buttonImage} testID="search-button" />
                </TouchableOpacity>
              </View>
              {!currentCoordinate
              && (
                <>
                  <Text style={styles.selectInstructionText}>Long press on map to a drop pin</Text>
                  <View style={[styles.selectButton, { backgroundColor: colors.grayText }]}>
                    <Text style={[elements.buttonText]}>Select Location</Text>
                  </View>
                </>
              )}
              {currentCoordinate
              && (
                <>
                  <Text style={styles.coordinateText}>{`${currentCoordinate.latitude}, ${currentCoordinate.longitude}`}</Text>
                  <TouchableOpacity activeOpacity={0.5} style={styles.selectButton} onPress={onLocationSelect}>
                    <Text style={[elements.buttonText]}>Select Location</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      {showSpinner
      && <ActivityModal message="Searching For Location..." />}
      {showSearchResults
      && (
        <LocationSelectionModal
          locations={searchResults}
          onSelect={searchResultSelected}
          onClose={onSearchResultClose}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryBg,
  },
  contentContainer: {
    flex: 1,
  },
  map: {
    marginTop: 12,
    width: '100%',
    height: '110%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectInstructionText: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.grayText,
  },
  coordinateText: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    color: colors.primaryText,
  },
  selectButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: colors.yellow,
    borderRadius: 8,
    height: 50,

  },
  button: {
    marginTop: 18,
    marginLeft: 16,
    height: 50,
    width: 50,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    resizeMode: 'contain',
    height: 36,
    width: 36,
  },
});

export default Page;
