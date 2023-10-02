export enum calloutType {
    SEARCH = "search",
    RESCUE = "rescue",
    INFORMATION = "information"
}

export enum responseType {
    TEN7 = "10-7",
    TEN8 = "10-8",
    TEN19 = "10-19",
    TEN22 = "10-22",
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

export enum calloutStatus {
    ACTIVE = "active",
    RESOLVED = "resolved",
    ARCHIVED = "archived"
}

export const isLogType = (object: any): boolean => {
    return object && typeof object.type === 'number' && Object.values(logType).includes(object.type as logType);
}
