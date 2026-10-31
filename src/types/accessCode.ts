export interface LocationPoint {
  id?: number;
  latitude: number;
  longitude: number;
  label?: string;
}

export interface accessCode {
  id?: number;
  name: string;
  code: string;
  keywords?: string;
  locations: LocationPoint[];
  latitude?: number;
  longitude?: number;
  created_at?: string;
  updated_at?: string;
}

export function accessCodeFromResponse(data: any): accessCode {
  let locations: LocationPoint[] = [];

  if (Array.isArray(data.locations)) {
    locations = data.locations.map((loc: any) => ({
      id: loc.id,
      latitude: typeof loc.latitude === 'number' ? loc.latitude : Number.parseFloat(loc.latitude || '0'),
      longitude: typeof loc.longitude === 'number' ? loc.longitude : Number.parseFloat(loc.longitude || '0'),
      label: loc.label ?? '',
    }));
  }
  else if (data.latitude !== undefined && data.longitude !== undefined) {
    const lat = typeof data.latitude === 'number' ? data.latitude : Number.parseFloat(data.latitude || '0');
    const lon = typeof data.longitude === 'number' ? data.longitude : Number.parseFloat(data.longitude || '0');
    if (lat !== 0 || lon !== 0) {
      locations = [{ latitude: lat, longitude: lon }];
    }
  }

  const primaryLat = locations.length > 0 ? locations[0].latitude : 0;
  const primaryLon = locations.length > 0 ? locations[0].longitude : 0;

  return {
    id: data.id,
    name: data.name ?? '',
    code: data.code ?? data.value ?? '',
    keywords: data.keywords ?? '',
    locations,
    latitude: primaryLat,
    longitude: primaryLon,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
