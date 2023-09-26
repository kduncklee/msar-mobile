import { ImageRequireSource } from "react-native";
import { location } from "./location";
import colors from "../styles/colors"
import { calloutType, responseType } from "./enums"

export type calloutSummary = {
    id: number,
    subject: string,
    type: calloutType,
    responder_count: number,
    timestamp?: Date,
    location: location,
    log_count: number,
    my_response?: responseType
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