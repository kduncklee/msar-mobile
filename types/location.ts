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

    if (location.address != null) {
        if (location.address.street) {
            return `${location.address.street}, ${location.address.city}, ${location.address.state} ${location.address.zip}`;
        }
    }
    
    if (location.coordinates?.lat && location.coordinates?.long) {
        return `${location.coordinates.lat}, ${location.coordinates.long}`
    }

    return "UNKNOWN";
}

export const locationToShortString = (location: location): string => {
    
    if (location.address != null) {
        if (location.address.street != null) {
            return `${location.address.street}`;
        }
    }
    
    if (location.coordinates != null) {
        return `${location.coordinates.lat}, ${location.coordinates.long}`
    }

    return "UNKNOWN";
}
