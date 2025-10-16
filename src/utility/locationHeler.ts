import type { LatLng } from 'react-native-maps';

export const nullCoordinate = { latitude: 0, longitude: 0 };

export function coordinateFromString(string: string): LatLng {
  const parts = string.split(',');

  if (parts.length !== 2) {
    return nullCoordinate;
  }

  const [lat, long] = parts.map(Number.parseFloat);

  if (Number.isNaN(lat) || Number.isNaN(long)) {
    return nullCoordinate;
  }

  const coordinate: LatLng = {
    latitude: lat,
    longitude: long,
  };

  return coordinate;
}
