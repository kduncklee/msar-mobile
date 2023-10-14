export enum calloutType {
    SEARCH = "search",
    RESCUE = "rescue",
    INFORMATION = "information"
}

export const stringToCalloutType = (value: string): calloutType | undefined => {
    const enumValue = value as calloutType;
    if (Object.values(calloutType).includes(enumValue)) {
        return enumValue;
    }

    return undefined;
}


export enum responseType {
    TEN7 = "10-7",
    TEN8 = "10-8",
    TEN19 = "10-19",
    TEN22 = "10-22",
}

export const stringToResponseType = (value: string): responseType | undefined => {
    const enumValue = value as responseType;
    if (Object.values(responseType).includes(enumValue)) {
        return enumValue;
    }

    return undefined;
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

export const stringToCalloutStatus = (value: string): calloutStatus | undefined => {
    const enumValue = value as calloutStatus;
    if (Object.values(calloutStatus).includes(enumValue)) {
        return enumValue;
    }

    return undefined;
}

export const isLogType = (object: any): boolean => {
    return object && typeof object.type === 'number' && Object.values(logType).includes(object.type as logType);
}
