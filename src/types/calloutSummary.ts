import colors from '@styles/colors';
import type { location } from '@/types/location';
import { calloutStatus, stringToCalloutStatus } from '@/types/enums';
import type { respondedItem } from '@/types/respondedItem';
import type { calloutResponseAvailable } from '@/types/calloutResponseAvailable';

// {
//     "created_at": "2023-10-12T18:45:18.623621-07:00",
//     "id": 6,
//     "location": [Object
//     ],
//     "log_count": 2,
//     "my_response": null,
//     "operation_type": "rescue",
//     "responded": [Array
//     ],
//     "status": "active",
//     "title": "All fields, not 10-22"
// }

export interface calloutSummary {
  id: number;
  operation_type: string;
  operation_type_icon: string;
  operation_type_color: string;
  title?: string;
  my_response?: string;
  responded?: respondedItem[];
  created_at: Date;
  location: location;
  status?: calloutStatus;
  log_count: number;
  log_last_id: number;
};

export function calloutSummaryFromResponse(data: any): calloutSummary {
  return {
    id: data.id,
    operation_type: data.operation_type,
    operation_type_icon: data.operation_type_icon,
    operation_type_color: data.operation_type_color,
    title: data.title,
    my_response: data.my_response,
    responded: data.responded,
    created_at: new Date(data.created_at),
    location: data.location,
    status: stringToCalloutStatus(data.status),
    log_count: data.log_count,
    log_last_id: data.log_last_id,
  };
}

export const activeTabStatusQuery = 'active&status=resolved';
export const archivedTabStatusQuery = 'archived';

export function textForCalloutStatus(type: calloutStatus): string {
  switch (type) {
    case calloutStatus.ACTIVE:
      return 'Active';
    case calloutStatus.RESOLVED:
      return 'Resolved';
    case calloutStatus.ARCHIVED:
      return 'Archived';
  }
}

export function colorForTypeAndStatus(callout: calloutSummary): string {
  if (callout.status === calloutStatus.RESOLVED) {
    return colors.green;
  }
  return callout.operation_type_color || colors.blue;
}

export function iconForType(callout: calloutSummary): any {
  return callout.operation_type_icon || 'progress-question';
}

export function colorForResponseType(
  type: string,
  calloutResponsesAvailableMap: Map<string, calloutResponseAvailable>,
): string {
  const t = calloutResponsesAvailableMap?.get(type);
  if (t && t.color) {
    return t.color;
  }
  return colors.grayText;
}
