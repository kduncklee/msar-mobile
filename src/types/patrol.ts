import type { user } from '@/types/user';
import { userDetailsFromResponse } from '@/types/user';
import { formatServerDate, parseServerDate } from '@/utility/dateHelper';

export interface patrol {
  id?: number;
  member?: user;
  description?: string;
  start_at: Date;
  finish_at?: Date | null;
  color?: string;
};

export function patrolFromResponse(response: any): patrol {
  return {
    ...response,
    start_at: parseServerDate(response.start_at),
    finish_at: response.finish_at ? parseServerDate(response.finish_at) : null,
    member: userDetailsFromResponse(response.member),
  };
}

export function patrolToRequest(p: patrol) {
  return {
    ...p,
    start_at: formatServerDate(p.start_at),
    finish_at: p.finish_at ? formatServerDate(p.finish_at) : p.finish_at,
  };
}
