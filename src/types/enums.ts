export enum eventType {
  MEETING = 'meeting',
  TRAINING = 'training',
  OPERATION = 'operation',
  COMMUNITY = 'community',
}

export enum locationType {
  DESCRIPTION,
  COORDINATES,
  ADDRESS,
}

export enum logType {
  RESPONSE = 'response',
  SYSTEM = 'system',
  MESSAGE = 'message',
}

export enum logStatusType {
  ERROR = 'Error: tap to retry.',
  PENDING = 'Sending ...',
}

export function stringToLogType(value: string): logType | undefined {
  switch (value) {
    case 'response':
      return logType.RESPONSE;
    case 'system':
      return logType.SYSTEM;
    case 'message':
      return logType.MESSAGE;
  }

  return undefined;
}

export enum calloutStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  ARCHIVED = 'archived',
}

export function stringToCalloutStatus(value: string): calloutStatus | undefined {
  switch (value) {
    case 'active':
      return calloutStatus.ACTIVE;
    case 'resolved':
      return calloutStatus.RESOLVED;
    case 'archived':
      return calloutStatus.ARCHIVED;
  }

  return undefined;
}

export function isLogType(object: any): boolean {
  return object && typeof object.type === 'number' && Object.values(logType).includes(object.type as logType);
}
