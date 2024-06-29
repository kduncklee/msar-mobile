import type { responseType } from '@/types/enums';

export interface personnel {
  first_name: string;
  last_name: string;
  phone?: string;
  response: responseType;
};

export function personnelToString(personnel: personnel): string {
  return `${personnel.first_name} ${personnel.last_name}`;
}
