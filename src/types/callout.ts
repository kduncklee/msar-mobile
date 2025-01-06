import type { calloutStatus } from '@/types/enums';
import { responseType, stringToCalloutStatus, stringToResponseType } from '@/types/enums';
import type { location } from '@/types/location';
import type { opResponse, operationalPeriod } from '@/types/operationalPeriod';
import type { user } from '@/types/user';
import type { dataFile } from '@/types/dataFile';
import { dataFileFromResponse } from '@/types/dataFile';

export interface callout {
  id?: number;
  title: string;
  operation_type: string;
  description?: string;
  subject?: string;
  subject_contact?: string;
  informant?: string;
  informant_contact?: string;
  radio_channel?: string;
  additional_radio_channels?: string[];
  notifications_made?: string[];
  status: calloutStatus;
  resolution?: string;
  location?: location;
  operational_periods?: operationalPeriod[];
  files?: dataFile[];
  handling_unit?: string;
  created_at?: Date;
  my_response?: responseType;
  created_by?: user;
  log_count?: number;
  log_last_id?: number;
};

export function calloutFromResponse(data: any): callout {
  return {
    id: data.id,
    title: data.title,
    operation_type: data.operation_type,
    description: data.description,
    subject: data.subject,
    subject_contact: data.subject_contact,
    informant: data.informant,
    informant_contact: data.informant_contact,
    radio_channel: data.radio_channel,
    additional_radio_channels: data.additional_radio_channels,
    notifications_made: data.notifications_made,
    status: stringToCalloutStatus(data.status),
    resolution: data.resolution,
    location: data.location,
    operational_periods: data.operational_periods,
    files: data.files.map(dataFileFromResponse),
    handling_unit: data.handling_unit,
    created_at: new Date(data.created_at),
    my_response: stringToResponseType(data.my_response),
    created_by: data.created_by,
    log_count: data.log_count,
    log_last_id: data.log_last_id,
  };
}

export function calloutResponseBadge(callout: callout): string | null {
  if (callout.operational_periods[0]) {
    const responses = callout.operational_periods[0].responses;
    const filterByTen19: opResponse[] = responses.filter((opResponse) => {
      return opResponse.response === responseType.TEN19;
    });

    const filterByTen8: opResponse[] = responses.filter((opResponse) => {
      return opResponse.response === responseType.TEN8;
    });

    const badgeCount = filterByTen19.length + filterByTen8.length;
    if (badgeCount > 0) {
      return `${badgeCount}`;
    }
  }

  return null;
}
