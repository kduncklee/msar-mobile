import { logType } from "./enums"
export type logEntry = {
    type: logType,
    data: any,
    timestamp: Date
}