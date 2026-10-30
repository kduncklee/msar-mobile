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

export function calculateDistanceInMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a
    = Math.sin(dLat / 2) * Math.sin(dLat / 2)
    + Math.cos(lat1 * (Math.PI / 180))
    * Math.cos(lat2 * (Math.PI / 180))
    * Math.sin(dLon / 2)
    * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
