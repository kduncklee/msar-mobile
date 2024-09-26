import { type user, userDetailsFromResponse } from '@/types/user';

export interface patrol {
  id?: number;
  member?: user;
  description?: string;
  start_at: Date;
  finish_at?: Date;
  color?: string;
};

export function patrolFromResponse(response: any): patrol {
  return {
    ...response,
    start_at: new Date(response.start_at),
    finish_at: response.finish_at ? new Date(response.finish_at) : null,
    member: userDetailsFromResponse(response.member),
  };
}
