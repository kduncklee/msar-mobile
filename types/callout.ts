import { calloutStatus, calloutType, responseType, stringToCalloutType, stringToCalloutStatus, stringToResponseType } from "./enums"
import { location } from "./location"

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
    handling_unit?: string,
    created_at?: Date,
    my_response?: responseType
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
        handling_unit: data.handling_unit,
        created_at: new Date(data.created_at),
        my_response: stringToResponseType(data.my_response)
    }
}

export const blankCallout = (): callout => {
    return {
        id: 1,
        title: "Loading...",
        operation_type: calloutType.INFORMATION,
        status: calloutStatus.ACTIVE,
        created_at: new Date()
    }
}