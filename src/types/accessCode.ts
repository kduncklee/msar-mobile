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

function parseCoord(val: any): number {
  if (typeof val === 'number') {
    return Number.isNaN(val) ? 0 : val;
  }
  const parsed = Number.parseFloat(val || '0');
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function accessCodeFromResponse(data: any): accessCode {
  let locations: LocationPoint[] = [];

  if (Array.isArray(data.locations)) {
    locations = data.locations.map((loc: any) => ({
      id: loc.id,
      latitude: parseCoord(loc.latitude),
      longitude: parseCoord(loc.longitude),
      label: loc.label ?? '',
    }));
  }
  else if (data.latitude !== undefined && data.longitude !== undefined) {
    const lat = parseCoord(data.latitude);
    const lon = parseCoord(data.longitude);
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
