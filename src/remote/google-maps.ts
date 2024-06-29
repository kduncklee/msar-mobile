import { GoogleAPIKey } from '@utility/constants';
import type { geocodeAddressResponse } from '@remote/responses';
import type { location } from '@/types/location';

const geocodingEndpoint = 'https://maps.googleapis.com/maps/api/geocode/json?address=';
const keyParam = `&key=${GoogleAPIKey}`;

export async function geocodeAddress(address: string): Promise<geocodeAddressResponse> {
  const encodedAddress: string = encodeURIComponent(address);

  return fetch(geocodingEndpoint + encodedAddress + keyParam, {
    method: 'GET',
  })
    .then(response => response.json())
    .then((data) => {
      console.log(data);
      if (data.status === 'OK') {
        const locationList: location[] = [];
        data.results.forEach((result: any) => {
          locationList.push(convertGeocodeToLocation(result));
        });

        return {
          results: locationList,
          status: data.status,
        };
      }
      else if (data.status === 'ZERO_RESULTS') {
        return {
          results: [],
          status: data.status,
        };
      }
      else {
        return {
          results: [],
          status: data.status,
        };
      }
    })
    .catch((error) => {
      console.log(error);
      return {
        results: [],
        status: 'ERROR',
      };
    });
}

// ADD COORDINATES
function convertGeocodeToLocation(result: any): location {
  let streetNumber: string = '';
  let street: string = '';
  let city: string = '';
  let state: string = '';
  let zip: string = '';

  let latitude: number = null;
  let longitude: number = null;

  if (result.geometry.location.lat && typeof result.geometry.location.lat === 'number'
    && result.geometry.location.lng && typeof result.geometry.location.lng === 'number') {
    latitude = result.geometry.location.lat;
    longitude = result.geometry.location.lng;
  }

  result.address_components.forEach((component: any) => {
    if (component.types.includes('street_number')) {
      streetNumber = component.short_name;
    }
    else if (component.types.includes('route')) {
      street = component.short_name;
    }
    else if (component.types.includes('locality')) {
      city = component.short_name;
    }
    else if (component.types.includes('administrative_area_level_1')) {
      state = component.short_name;
    }
    else if (component.types.includes('postal_code')) {
      zip = component.short_name;
    }
  });

  const location: location = {
    address: {
      street: `${streetNumber} ${street}`,
      city,
      state,
      zip,
    },
  };

  if (latitude != null && longitude != null) {
    location.coordinates = {
      lat: latitude.toString(),
      long: longitude.toString(),
    };
  }

  return location;
}
