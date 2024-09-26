import type { eventType } from '@/types/enums';

export interface event {
  id: number;
  title: string;
  type: eventType;
  description: string;
  location: string;
  start_at?: Date;
  finish_at?: Date;
  all_day?: boolean;
};

export function eventFromResponse(response: any): event {
  return {
    ...response,
    start_at: new Date(response.start_at),
    finish_at: new Date(response.finish_at),
  };
}
