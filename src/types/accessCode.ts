export interface accessCode {
  id?: number;
  name: string;
  code: string;
  keywords?: string;
  latitude: number;
  longitude: number;
  created_at?: string;
  updated_at?: string;
}

export function accessCodeFromResponse(data: any): accessCode {
  return {
    id: data.id,
    name: data.name ?? '',
    code: data.code ?? data.value ?? '',
    keywords: data.keywords ?? '',
    latitude: typeof data.latitude === 'number' ? data.latitude : Number.parseFloat(data.latitude || '0'),
    longitude: typeof data.longitude === 'number' ? data.longitude : Number.parseFloat(data.longitude || '0'),
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}
