export enum calloutType {
    SEARCH,
    RESCUE,
    INFORMATION
}

export enum responseType {
    TEN7,
    TEN8,
    TEN19,
    TEN22,
}

export enum locationType {
    DESCRIPTION,
    COORDINATES,
    ADDRESS
}

export enum logType {
    RESPONSE,
    CALLOUT_UPDATE,
    MESSAGE_SELF,
    MESSAGE,
    MESSAGE_SYSTEM
}

export const isLogType = (object: any): boolean => {
    return object && typeof object.type === 'number' && Object.values(logType).includes(object.type as logType);
}
