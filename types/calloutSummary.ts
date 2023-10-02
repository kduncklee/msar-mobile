import { ImageRequireSource } from "react-native";
import { location } from "./location";
import colors from "../styles/colors"
import { calloutType, responseType, calloutStatus } from "./enums"
import { respondedItem } from "./respondedItem";
import { Type } from "typescript";

export type calloutSummary = {
    id: number,
    type: calloutType,
    title?: string,
    description?: string,
    radio_channel?: string,
    resolution?: string,
    my_response?: responseType
    responded?: respondedItem[]
    timestamp: Date,
    location: location,
    status?: calloutStatus,

    subject?: string,
    responder_count?: number,
    log_count?: number,
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

export const processCalloutSummary = (data: any): calloutSummary => {

    const summary: calloutSummary = {
        id: data.id,
        type: data.operation_type as calloutType,
        title: data.title,
        description: data.description,
        radio_channel: data.radio_channel,
        my_response: data.my_response as responseType,
        resolution: data.resolution,
        responded: data.responded as respondedItem[],
        timestamp: new Date(data.created_at),
        location: data.location as location,
        status: data.status as calloutStatus
    }

    return summary

}