import type { eventType } from '@/types/enums';
import { formatServerDate, parseServerDate } from '@/utility/dateHelper';

export interface event {
  id?: number;
  title: string;
  type: eventType | string;
  leaders?: string | null;
  description?: string | null;
  location?: string | null;
  lat?: string | number | null;
  lon?: string | number | null;
  start_at?: Date;
  finish_at?: Date;
  all_day?: boolean;
  published?: boolean;
  period_set?: any[];
};

export function eventFromResponse(response: any): event {
  return {
    ...response,
    start_at: response.start_at ? parseServerDate(response.start_at) : undefined,
    finish_at: response.finish_at ? parseServerDate(response.finish_at) : undefined,
  };
}

export function eventToRequest(e: event) {
  return {
    ...e,
    start_at: e.start_at ? formatServerDate(e.start_at) : e.start_at,
    finish_at: e.finish_at ? formatServerDate(e.finish_at) : e.finish_at,
  };
}
