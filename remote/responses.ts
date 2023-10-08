import { location } from "../types/location"

export type loginResponse = {
    token?: string,
    non_field_errors?: string[]
}

export type geocodeAddressResponse = {
    results: location[],
    status: string
}