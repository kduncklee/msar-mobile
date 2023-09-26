import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { elements } from '../../styles/elements';
import colors from '../../styles/colors'
import { location, locationToString } from '../../types/location';
import { locationType } from '../../types/enums';
import MapView, { LatLng, Region, Marker } from 'react-native-maps';
import { coordinateFromString } from '../../utility/locationHeler';
import SmallButton from '../inputs/SmallButton';

type LocationFieldProps = {
    location: location
}

const LocationField = ({ location }: LocationFieldProps) => {

    var locType: locationType = null;
    var coordinates: LatLng = null;

    var defaultRegion: Region = {
        latitude: 34.050783236893395,
        longitude: -118.83192890478199,
        latitudeDelta: 0.2091139902085246,
        longitudeDelta: 0.1355799588636216
    }

    if (location.description) {
        locType = locationType.DESCRIPTION;
    } else if (location.coordinates) {
        locType = locationType.COORDINATES;
        coordinates = coordinateFromString(`${location.coordinates.latitude}, ${location.coordinates.longitude}`);
        defaultRegion.latitude = coordinates.latitude;
        defaultRegion.longitude = coordinates.longitude;
    }

    return (
        <View style={styles.container}>
            {locType === locationType.DESCRIPTION &&
                <Text style={elements.mediumText}>{location.description}</Text>
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
                            title={'Navigate'}
                            icon={require('../../assets/icons/navigation.png')}
                            backgroundColor={colors.blue}
                            textColor={colors.primaryText}
                            onPress={() => console.log('pressed nav')} />
                        <View style={{width: 12}} />
                        <SmallButton
                            title={'Copy'}
                            icon={require('../../assets/icons/copy.png')}
                            backgroundColor={colors.darkBlue}
                            textColor={colors.primaryText}
                            onPress={() => console.log('pressed copy')} />
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