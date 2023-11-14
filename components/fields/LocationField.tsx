import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'
import { location, locationToShortString, locationToString } from '../../types/location';
import { locationType } from '../../types/enums';
import MapView, { LatLng, Region, Marker } from 'react-native-maps';
import { coordinateFromString } from '../../utility/locationHeler';
import SmallButton from '../inputs/SmallButton';
import * as Clipboard from 'expo-clipboard';

type LocationFieldProps = {
    location: location
}

const LocationField = ({ location }: LocationFieldProps) => {

    var locType: locationType = null;
    var coordinates: LatLng = { latitude: 0, longitude: 0 };

    var defaultRegion: Region = {
        latitude: 34.050783236893395,
        longitude: -118.83192890478199,
        latitudeDelta: 0.2091139902085246,
        longitudeDelta: 0.1355799588636216
    }

    const copyPressed = async () => {
        await Clipboard.setStringAsync(locationToString(location));
    }

    const openMapPressed = () => {

        const address = locationToString(location);
        const mapUrl = Platform.select({
            ios: `maps:0,0?q=${encodeURIComponent(address)}`,
            android: `geo:0,0?q=${encodeURIComponent(address)}`,
        });

        Linking.openURL(mapUrl).catch((err) => console.error('An error occurred', err));
    }


    if (location.text) {
        locType = locationType.DESCRIPTION;
    } else if (location.address) {
        locType = locationType.ADDRESS;
        if (location.coordinates) {
            if (location.coordinates.lat != null && location.coordinates.long != null) {
                coordinates = coordinateFromString(`${location.coordinates.lat}, ${location.coordinates.long}`);
            }
            defaultRegion.latitude = coordinates.latitude;
            defaultRegion.longitude = coordinates.longitude;
        }
    } else if (location.coordinates) {
        locType = locationType.COORDINATES;
        if (location.coordinates.lat != null && location.coordinates.long != null) {
            coordinates = coordinateFromString(`${location.coordinates.lat}, ${location.coordinates.long}`);
        }
        defaultRegion.latitude = coordinates.latitude;
        defaultRegion.longitude = coordinates.longitude;
    }

    return (
        <View style={styles.container}>
            {locType === locationType.DESCRIPTION &&
                <Text style={[elements.mediumText, { padding: 8 }]}>{location.text}</Text>
            }
            {locType === locationType.ADDRESS &&
                <>
                    <MapView style={styles.mapContainer} region={defaultRegion}>
                        {coordinates &&
                            <Marker
                                coordinate={coordinates}
                                title={locationToShortString(location)} />
                        }
                    </MapView>
                </>
            }
            {locType === locationType.COORDINATES &&
                <MapView style={styles.mapContainer} region={defaultRegion}>
                    {coordinates &&
                        <Marker
                            coordinate={coordinates}
                            title={'Location'} />
                    }
                </MapView>
            }
            {(locType === locationType.COORDINATES || locType === locationType.ADDRESS) &&
                <>
                    <Text style={[elements.smallText, { margin: 16 }]}>
                        {locationToString(location)}
                    </Text>
                    <View style={styles.buttonTray}>
                        <SmallButton
                            title={'Open Map'}
                            icon={require('../../assets/icons/navigation.png')}
                            backgroundColor={colors.blue}
                            textColor={colors.primaryText}
                            onPress={() => openMapPressed()} />
                        <View style={{ width: 12 }} />
                        <SmallButton
                            title={'Copy'}
                            icon={require('../../assets/icons/copy.png')}
                            backgroundColor={colors.darkBlue}
                            textColor={colors.primaryText}
                            onPress={() => copyPressed()} />
                    </View>
                </>
            }
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        paddingHorizontal: 0,
        paddingVertical: 0
    },
    mapContainer: {
        height: 120
    },
    buttonTray: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingTop: 0,
        paddingBottom: 16,
    }
});

export default LocationField;