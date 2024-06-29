import type { location } from '@/types/location';
import type { logEntry } from '@/types/logEntry';

export interface loginResponse {
  token?: string;
  non_field_errors?: string[];
};

export interface geocodeAddressResponse {
  results: location[];
  status: string;
};

export interface calloutGetLogResponse {
  count?: number;
  results?: logEntry[];
  error?: string;
};

export interface tokenValidationResponse {
  valid_token: boolean;
}
