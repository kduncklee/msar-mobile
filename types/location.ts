export type location = {
    description?: string,
    coordinates?: {
        latitude: string,
        longitude: string
    }
}

export const locationToString = (location: location): string => {
    
    if (location.description != null) {
        return location.description
    } else if (location.coordinates != null) {
        return `${location.coordinates.latitude}, ${location.coordinates.longitude}`
    }
    
    return "";
}