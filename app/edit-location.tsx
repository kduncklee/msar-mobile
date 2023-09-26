import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, StatusBar, Platform, TouchableOpacity, Text, View, Alert } from 'react-native';
import Header from '../components/Header';
import colors from '../styles/colors';
import { elements } from '../styles/elements';
import { router, useLocalSearchParams } from 'expo-router';
import MapView, { LatLng, LongPressEvent, Region, Marker } from 'react-native-maps';
import { coordinateFromString } from '../utility/locationHeler';


const Page = () => {
    const params = useLocalSearchParams();
    const [currentCoordinate, setCurrentCoordinate] = useState<LatLng>(null);
    var initialCoordinate: LatLng = null;

    var defaultRegion: Region = {
        latitude: 34.050783236893395,
        longitude: -118.83192890478199,
        latitudeDelta: 0.9091139902085246,
        longitudeDelta: 0.5355799588636216
    }

    if (params.locationDescription && typeof params.locationDescription === 'string') {
        const locationDesc: string = params.locationDescription;

        const coordinate = coordinateFromString(locationDesc);
        if (coordinate != null) {
            initialCoordinate = coordinate;
            defaultRegion.latitude = coordinate.latitude;
            defaultRegion.longitude = coordinate.longitude;
        }
    }

    useEffect(() => {
        if (initialCoordinate != null) {
            setCurrentCoordinate(initialCoordinate);
        }
    }, []);

    const backPressed = () => {

        if (initialCoordinate != null && currentCoordinate != null) {
            if (initialCoordinate.latitude != currentCoordinate.latitude ||
                initialCoordinate.longitude != currentCoordinate.longitude) {
                showChangeAlert();
                return;
            }
        }

        router.back();
    }

    const showChangeAlert = () => {
        Alert.alert(
            'Location Changed',
            'Going back without setting the location will lose this change. Do you want to proceed?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Yes',
                    onPress: () => {
                        router.back();
                    },
                },
            ],
            { cancelable: false }
        );
    };


    const onMapLongPress = (event: LongPressEvent) => {
        //console.log(event.nativeEvent.coordinate);
        setCurrentCoordinate(event.nativeEvent.coordinate);
    }

    const onRegionChange = (region: Region, { isGesture: boolean }) => {
        console.log(region);
    }

    const onLocationSelect = () => {
        router.setParams({ location: `${currentCoordinate.latitude}, ${currentCoordinate.longitude}` });
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header title={'Select Location'} backButton={true} onBackPressed={backPressed} />
            <View style={styles.contentContainer}>
                <MapView
                    style={styles.map}
                    onLongPress={onMapLongPress}
                    onRegionChangeComplete={onRegionChange}
                    region={defaultRegion}>
                    {currentCoordinate &&
                        <Marker
                            coordinate={currentCoordinate}
                            title={'Location'} />
                    }
                </MapView>
                <View style={[elements.tray, { margin: 20, position: "absolute", bottom: 0, left: 0, right: 0 }]}>
                    {!currentCoordinate &&
                        <>
                            <Text style={styles.selectInstructionText}>Long press on map to a drop pin</Text>
                            <View style={[styles.selectButton, { backgroundColor: colors.grayText }]}>
                                <Text style={[elements.buttonText]}>Select Location</Text>
                            </View>
                        </>
                    }
                    {currentCoordinate &&
                        <>
                            <Text style={styles.coordinateText}>{currentCoordinate.latitude + ", " + currentCoordinate.longitude}</Text>
                            <TouchableOpacity activeOpacity={0.5} style={styles.selectButton} onPress={onLocationSelect}>
                                <Text style={[elements.buttonText]}>Select Location</Text>
                            </TouchableOpacity>
                        </>
                    }
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primaryBg
    },
    contentContainer: {
        flex: 1,
    },
    map: {
        marginTop: 12,
        width: "100%",
        height: "110%"
    },
    selectInstructionText: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center",
        color: colors.grayText,
    },
    coordinateText: {
        marginTop: 20,
        fontSize: 14,
        fontWeight: "400",
        textAlign: "center",
        color: colors.primaryText,
    },
    selectButton: {
        alignItems: "center",
        justifyContent: "center",
        margin: 20,
        backgroundColor: colors.yellow,
        borderRadius: 4,
        height: 50,

    }
});

export default Page;
