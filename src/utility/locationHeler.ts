import type { LatLng } from 'react-native-maps';

export function coordinateFromString(string: string): LatLng {
  const parts = string.split(',');

  if (parts.length !== 2) {
    return null;
  }

  const [lat, long] = parts.map(Number.parseFloat);

  if (Number.isNaN(lat) || Number.isNaN(long)) {
    return null;
  }

  const coordinate: LatLng = {
    latitude: lat,
    longitude: long,
  };

  return coordinate;
}
