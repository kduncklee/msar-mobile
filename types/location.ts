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

    if (location.address?.street) {
        var address = `${location.address.street}`;
        if (location.address?.city) {
            address += `, ${location.address.city}`;
            if (location.address?.state) {
                address += `, ${location.address.state}`;
                if (location.address?.zip) {
                    address += ` ${location.address.zip}`;
                }
            }
        }
        return address;
    }
    
    if (location.coordinates?.lat && location.coordinates?.long) {
        return `${location.coordinates.lat}, ${location.coordinates.long}`
    }

    return "UNKNOWN";
}

export const locationToShortString = (location: location): string => {
    
    if (location.address?.street) {
        return `${location.address.street}`;
    }
    
    if (location.coordinates?.lat && location.coordinates?.long) {
        return `${location.coordinates.lat}, ${location.coordinates.long}`
    }

    if (location.text) {
        return `${location.text}`;
    }

    return "UNKNOWN";
}
