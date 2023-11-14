import { location } from "../types/location"
import { logEntry } from "../types/logEntry"

export type loginResponse = {
    token?: string,
    non_field_errors?: string[]
}

export type geocodeAddressResponse = {
    results: location[],
    status: string
}

export type calloutGetLogResponse = {
    count?: number,
    results?: logEntry[],
    error?: string
}

export type tokenValidationResponse = {
    valid_token: boolean
}