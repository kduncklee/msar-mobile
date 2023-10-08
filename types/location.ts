export type location = {
    text?: string,
    description?: string,
    address?: {
        street: string,
        city: string,
        state: string,
        zip: string
    }
    coordinates?: {
        latitude: string,
        longitude: string
    }
}

export const locationToString = (location: location): string => {
    
    if (location.text != null) {
        return location.text
    } else if (location.description != null) {
        return location.description
    } else if (location.address != null) {
        return `${location.address.street}, ${location.address.city}, ${location.address.state} ${location.address.zip}`;
    } else if (location.coordinates != null) {
        return `${location.coordinates.latitude}, ${location.coordinates.longitude}`
    }
    
    return "";
}

export const locationToShortString = (location: location): string => {

    if (location.address != null) {
        return `${location.address.street}`;
    }
    return "Location";
}