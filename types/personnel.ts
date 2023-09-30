import { responseType } from "./enums"
export type personnel = {
    first_name: string,
    last_name: string,
    phone?: string,
    response: responseType
}

export const personnelToString = (personnel: personnel): string => {
    
    
    
    return personnel.first_name + " " + personnel.last_name;
}