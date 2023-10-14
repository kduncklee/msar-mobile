import { GoogleAPIKey } from "../utility/constants";
import { location, locationToString } from "../types/location";
import { geocodeAddressResponse } from "./responses";

let geocodingEndpoint = "https://maps.googleapis.com/maps/api/geocode/json?address=";
let keyParam = `&key=${GoogleAPIKey}`;

export const geocodeAddress = async (address: string): Promise<geocodeAddressResponse> => {

    const encodedAddress: string = encodeURIComponent(address);

    return fetch(geocodingEndpoint + encodedAddress + keyParam, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {

        console.log(data);
        if (data.status === 'OK') {
            var locationList: location[] = []
            data.results.forEach((result: any) => {
                locationList.push(convertGeocodeToLocation(result));
            });

            return {
                results: locationList,
                status: data.status
            }

        } else if (data.status === 'ZERO_RESULTS') {
            return {
                results: [],
                status: data.status
            }
        } else {
            return {
                results: [],
                status: data.status
            }
        }
        
    })
    .catch(error => {
        console.log(error);
        return {
            results: [],
            status: "ERROR"
        };
    });
}

//ADD COORDINATES
const convertGeocodeToLocation = (result: any): location => {

    var streetNumber: string = ""
    var street: string = ""
    var city: string = ""
    var state: string = ""
    var zip: string = ""

    var latitude: number = null;
    var longitude: number = null;

    if (result.geometry.location.lat && typeof result.geometry.location.lat === 'number' && 
        result.geometry.location.lng && typeof result.geometry.location.lng === 'number') {
            latitude = result.geometry.location.lat;
            longitude = result.geometry.location.lng;
    }

    result.address_components.forEach((component: any) => {
        
        if (component.types.includes("street_number")) {
            streetNumber = component.short_name;
        } else if (component.types.includes("route")) {
            street = component.short_name;
        } else if (component.types.includes("locality")) {
            city = component.short_name;
        } else if (component.types.includes("administrative_area_level_1")) {
            state = component.short_name;
        } else if (component.types.includes("postal_code")) {
            zip = component.short_name;
        }
    });

    var location: location = {
        address: {
            street: streetNumber + ' ' + street,
            city: city,
            state: state,
            zip: zip
        }
    }

    if (latitude != null && longitude != null) {
        location.coordinates = {
            lat: latitude.toString(),
            long: longitude.toString()
        }
    }

    return location;
    
}
