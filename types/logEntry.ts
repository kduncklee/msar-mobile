import { logType, stringToLogType } from "./enums"
import { location } from "./location"
import { user } from "./user"

export type logEntry = {
    id: number,
    type: logType,
    event: number,
    member: user,
    location?: location,
    message?: string,
    update?: string,
    created_at: Date
}

export const logEntryFromRespsonse = (data: any): logEntry => {

    return {
        id: data.id,
        type: stringToLogType(data.type),
        event: data.event,
        member: data.member,
        location: data.location,
        message: data.message,
        update: data.update,
        created_at: new Date(data.created_at)
    }
}

export const logEntriesFromInfiniteQueryData = (data: any): logEntry[] =>
    data?.pages
        ? data?.pages?.flatMap((page) =>
            page?.results.map((r) => logEntryFromRespsonse(r))
        ) : [];