import { LatLng } from 'react-native-maps';
export const coordinateFromString = (string: string): LatLng => {

    const parts = string.split(',');

    if (parts.length !== 2) {
        return null;
    }

    const [lat,long] = parts.map(parseFloat);

    if (isNaN(lat) || isNaN(long)) {
        return null;
    }

    const coordinate: LatLng = {
        latitude: lat,
        longitude: long
    };

    return coordinate;
}