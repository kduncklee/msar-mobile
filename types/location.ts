export type location = {
    text?: string,
    description?: string,
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
    } else if (location.coordinates != null) {
        return `${location.coordinates.latitude}, ${location.coordinates.longitude}`
    }
    
    return "";
}