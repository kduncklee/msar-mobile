export type location = {
    text?: string,
    address?: {
        street: string,
        city: string,
        state: string,
        zip: string
    }
    coordinates?: {
        lat: string,
        long: string
    }
}

export const locationToString = (location: location): string => {

    if (location.text != null) {
        if (location.text.length > 0) {
            return location.text
        }
    }
    
    if (location.address != null) {
        return `${location.address.street}, ${location.address.city}, ${location.address.state} ${location.address.zip}`;
    }
    
    if (location.coordinates != null) {
        return `${location.coordinates.lat}, ${location.coordinates.long}`
    }

    return "UNKNOWN";
}

export const locationToShortString = (location: location): string => {

    if (location.text != null) {
        if (location.text.length > 0) {
            return location.text
        }
    } else if (location.address != null) {
        return `${location.address.street}`;
    } else if (location.coordinates != null) {
        return `${location.coordinates.lat}, ${location.coordinates.long}`
    }

    return "Location";
}