import { ImageRequireSource } from "react-native";
import { location } from "./location";
import colors from "../styles/colors"
import { calloutType, responseType, calloutStatus, stringToCalloutType, stringToResponseType, stringToCalloutStatus } from "./enums"
import { respondedItem } from "./respondedItem";
import { Type } from "typescript";

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

export type calloutSummary = {
    id: number,
    operation_type: calloutType,
    title?: string,
    my_response?: responseType
    responded?: respondedItem[]
    created_at: Date,
    location: location,
    status?: calloutStatus,
    log_count: number,
    log_last_id: number,
}

export const calloutSummaryFromResponse = (data: any): calloutSummary => {

    return {
        id: data.id,
        operation_type: stringToCalloutType(data.operation_type),
        title: data.title,
        my_response: stringToResponseType(data.my_response),
        responded: data.responded,
        created_at: new Date(data.created_at),
        location: data.location,
        status: stringToCalloutStatus(data.status),
        log_count: data.log_count,
        log_last_id: data.log_last_id,
    }
}

export const activeTabStatusQuery = "active&status=resolved";
export const archivedTabStatusQuery = "archived";


export const textForCalloutStatus = (type: calloutStatus): string => {
    switch (type) {
        case calloutStatus.ACTIVE:
            return "Active";
        case calloutStatus.RESOLVED:
            return "Resolved";
        case calloutStatus.ARCHIVED:
            return "Archived";
    }
}

export const colorForType = (type: calloutType): string => {

    switch (type) {
        case calloutType.SEARCH:
            return colors.secondaryYellow;
        case calloutType.RESCUE:
            return colors.red;
        case calloutType.INFORMATION:
            return colors.blue;
    }
}

export const colorForTypeAndStatus = (type: calloutType, status: calloutStatus): string => {
    if (status == calloutStatus.RESOLVED) {
        return colors.green;
    }
    return colorForType(type);
}

export const imageForType = (type: calloutType): ImageRequireSource => {

    switch (type) {
        case calloutType.SEARCH:
            return require("assets/icons/search.png");
        case calloutType.RESCUE:
            return require("assets/icons/rescue.png");;
        case calloutType.INFORMATION:
            return require("assets/icons/information.png");;
    }
}

export const textForType = (type?: calloutType): string => {

    if (type == null) {
        return "N/A";
    }

    switch (type as calloutType) {
        case calloutType.SEARCH:
            return "Search";
        case calloutType.RESCUE:
            return "Rescue";
        case calloutType.INFORMATION:
            return "Information";
    }
}

export const colorForResponseType = (type?: responseType): string => {

    if (type == null) {
        return colors.grayText;
    }

    switch (type as responseType) {
        case responseType.TEN7:
            return colors.red;
        case responseType.TEN8:
            return colors.green;
        case responseType.TEN19:
            return colors.secondaryYellow;
        case responseType.TEN22:
            return colors.blue;
    }
}

export const textForResponseType = (type?: responseType): string => {

    if (type == null) {
        return "N/A";
    }

    switch (type as responseType) {
        case responseType.TEN7:
            return "10-7";
        case responseType.TEN8:
            return "10-8";
        case responseType.TEN19:
            return "10-19";
        case responseType.TEN22:
            return "10-22";
    }
}
