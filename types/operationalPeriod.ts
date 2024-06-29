import type { user } from '@/types/user';

export interface operationalPeriod {
  id: number;
  op: number;
  responses: opResponse[];
};

export interface opResponse {
  id: number;
  response: string;
  member: user;
  created_at?: Date;
}
