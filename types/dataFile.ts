import { user } from "./user"

export type dataFile = {
    id: number,
    name: string,
    extension: string,
    content_type: string,
    size: number,
    member: user,
    created_at?: Date,
}

export const dataFileFromResponse = (data: any): dataFile => {
    var file : dataFile = {
        ...data,
        created_at: new Date(data.created_at)
    };
    return file;
}