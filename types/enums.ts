export enum calloutType {
    SEARCH = "search",
    RESCUE = "rescue",
    INFORMATION = "information"
}

export const stringToCalloutType = (value: string): calloutType | undefined => {
    
    switch (value) {
        case 'search':
            return calloutType.SEARCH;
        case 'rescue':
            return calloutType.RESCUE;
        case 'information':
            return calloutType.INFORMATION;
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
    RESPONSE = "response",
    SYSTEM = "system",
    MESSAGE = "message"
}

export const stringToLogType = (value: string): logType | undefined => {
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
    ACTIVE = "active",
    RESOLVED = "resolved",
    ARCHIVED = "archived"
}

export const stringToCalloutStatus = (value: string): calloutStatus | undefined => {
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

export const isLogType = (object: any): boolean => {
    return object && typeof object.type === 'number' && Object.values(logType).includes(object.type as logType);
}
