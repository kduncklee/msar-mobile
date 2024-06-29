import type { logType } from '@/types/enums';
import { stringToLogType } from '@/types/enums';
import type { location } from '@/types/location';
import type { user } from '@/types/user';

export interface logEntry {
  id: number;
  type: logType;
  event: number;
  member: user;
  location?: location;
  message?: string;
  update?: string;
  status?: string; // app-only: not sent by server
  created_at: Date;
};

export function logEntryFromRespsonse(data: any): logEntry {
  return {
    id: data.id,
    type: stringToLogType(data.type),
    event: data.event,
    member: data.member,
    location: data.location,
    message: data.message,
    update: data.update,
    status: data.status,
    created_at: new Date(data.created_at),
  };
}

export function logEntriesFromInfiniteQueryData(data: any): logEntry[] {
  return data?.pages
    ? data?.pages?.flatMap(page =>
      page?.results.map(r => logEntryFromRespsonse(r)),
    )
    : [];
}
