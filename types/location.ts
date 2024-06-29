export interface location {
  text?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  coordinates?: {
    lat: string;
    long: string;
  };
};

export function locationToString(location: location): string {
  if (location.address?.street) {
    let address = `${location.address.street}`;
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
    return `${location.coordinates.lat}, ${location.coordinates.long}`;
  }

  return 'UNKNOWN';
}

export function locationToShortString(location: location): string {
  if (location.address?.street) {
    return `${location.address.street}`;
  }

  if (location.coordinates?.lat && location.coordinates?.long) {
    return `${location.coordinates.lat}, ${location.coordinates.long}`;
  }

  if (location.text) {
    return `${location.text}`;
  }

  return 'UNKNOWN';
}
