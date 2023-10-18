import { NullLiteral } from "typescript"
import { calloutStatus, calloutType, responseType, stringToCalloutType, stringToCalloutStatus, stringToResponseType } from "./enums"
import { location } from "./location"
import { operationalPeriod, opResponse } from "./operationalPeriod"
import { user } from "./user"

export type callout = {
    id?: number,
    title: string,
    operation_type: calloutType,
    description?: string,
    subject?: string,
    subject_contact?: string,
    informant?: string,
    informant_contact?: string,
    radio_channel?: string,
    notifications_made?: string[],
    status: calloutStatus,
    resolution?: string,
    location?: location,
    operational_periods?: operationalPeriod[],
    handling_unit?: string,
    created_at?: Date,
    my_response?: responseType,
    created_by?: user
}

export const calloutFromResponse = (data: any): callout => {

    return {
        id: data.id,
        title: data.title,
        operation_type: stringToCalloutType(data.operation_type),
        description: data.description,
        subject: data.subject,
        subject_contact: data.subject_contact,
        informant: data.informant,
        informant_contact: data.informant_contact,
        radio_channel: data.radio_channel,
        notifications_made: data.notifications_made,
        status: stringToCalloutStatus(data.status),
        resolution: data.resolution,
        location: data.location,
        operational_periods: data.operational_periods,
        handling_unit: data.handling_unit,
        created_at: new Date(data.created_at),
        my_response: stringToResponseType(data.my_response),
        created_by: data.created_by
    }
}

export const calloutResponseBadge = (callout: callout): string | null => {

    if (callout.operational_periods[0]) {
        const responses = callout.operational_periods[0].responses;
        const filterByTen19: opResponse[] = responses.filter((opResponse) => {
            return opResponse.response === responseType.TEN19;
        });
    
        const filterByTen8: opResponse[] = responses.filter((opResponse) => {
            return opResponse.response === responseType.TEN8;
        });

        const badgeCount = filterByTen19.length + filterByTen8.length;
        if (badgeCount > 0) {
            return `${badgeCount}`;
        }
    }


    return null;
}