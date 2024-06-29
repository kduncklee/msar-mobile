import type { user } from '@/types/user';

export interface dataFile {
  id: number;
  name: string;
  extension: string;
  content_type: string;
  size: number;
  member: user;
  created_at?: Date;
};

export function dataFileFromResponse(data: any): dataFile {
  const file: dataFile = {
    ...data,
    created_at: new Date(data.created_at),
  };
  return file;
}
