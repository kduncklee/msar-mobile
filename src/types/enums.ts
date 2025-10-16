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
  INVALID = 'invalid',
}

export enum logStatusType {
  ERROR = 'Error: tap to retry.',
  PENDING = 'Sending ...',
}

export function stringToLogType(value: string): logType {
  switch (value) {
    case 'response':
      return logType.RESPONSE;
    case 'system':
      return logType.SYSTEM;
    case 'message':
      return logType.MESSAGE;
  }

  return logType.INVALID;
}

export enum calloutStatus {
  ACTIVE = 'active',
  RESOLVED = 'resolved',
  ARCHIVED = 'archived',
  INVALID = 'invalid',
}

export function stringToCalloutStatus(value: string): calloutStatus {
  switch (value) {
    case 'active':
      return calloutStatus.ACTIVE;
    case 'resolved':
      return calloutStatus.RESOLVED;
    case 'archived':
      return calloutStatus.ARCHIVED;
  }

  console.error('Undefined callout status', value);
  return calloutStatus.INVALID;
}

export function isLogType(object: any): boolean {
  return object && typeof object.type === 'number' && Object.values(logType).includes(object.type as logType);
}
