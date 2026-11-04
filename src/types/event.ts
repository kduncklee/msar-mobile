import type { eventType } from '@/types/enums';

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
    start_at: response.start_at ? new Date(response.start_at) : undefined,
    finish_at: response.finish_at ? new Date(response.finish_at) : undefined,
  };
}
