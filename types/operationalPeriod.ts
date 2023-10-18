import { user } from "./user"

export type operationalPeriod = {
    id: number,
    op: number,
    responses: opResponse[]
}

export type opResponse = {
    id: number,
    response: string,
    member: user,
    created_at?: Date
}