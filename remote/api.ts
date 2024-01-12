import { getCredentials } from "../storage/storage";
import { callout, calloutFromResponse } from "../types/callout";
import { logEntry, logEntryFromRespsonse } from "../types/logEntry";
import { calloutGetLogResponse, loginResponse, tokenValidationResponse } from "./responses";
import { Platform } from "react-native";

let prod_server: string = "https://app.malibusarhours.org";
let server: string = prod_server;
let tokenEndpoint: string = server + "/api-token-auth/";
let calloutsEndpoint: string = server + "/api/callouts/";
let chatEndpoint: string = server + "/api/announcement/log/";
let devicesEndpoint: string = server + "/api/devices/";
let tokenValidationEndpoint: string = server + "/api/?format=json";

const fetchJsonWithCredentials = async (url: string): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        throw new Error('No token');
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        throw new Error('Network response was ' + response.status);
    }
    return response.json();
}

export const apiGetToken = async (username: string, password: string): Promise<loginResponse> => {

    return fetch(tokenEndpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => {
        console.log(error);
        return {
            non_field_errors: [
                "Server Error"
            ]
        };
    })
}

export const apiValidateToken = async (): Promise<tokenValidationResponse> => {

    const credentials = await getCredentials();
    if (!credentials.token) {
        return { valid_token: false }
    }

    return fetch(tokenValidationEndpoint, {
        method: "GET",
        headers: {
            'Authorization': 'Token ' + credentials.token
        }
    })
    .then(response => {
        if (response.ok) {
            return { valid_token: true }
        } else {
            return { valid_token: false }
        }
        //console.log("response status " + response.status);
    })
    .catch(error => {
        console.log(error);
        return { valid_token: false }
    })
}

export const apiGetCallouts = async (status?: string): Promise<any> => {
    var args = "?ordering=-id";
    if (status) {
        args += `&status=${status}`
    }

    return fetchJsonWithCredentials(calloutsEndpoint + args);
}

export const apiCreateCallout = async (callout: callout): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(calloutsEndpoint, {
        method: "POST",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(callout)
    })
    .then(response => response.json())
    .then(data => {
        //console.log("created response: " + JSON.stringify(data));
        return calloutFromResponse(data);
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
}

export const apiGetCallout = async (id: number): Promise<any> => {
    return fetchJsonWithCredentials(calloutsEndpoint + id + '/').then(data => {
        return calloutFromResponse(data);
    });
}

export const apiUpdateCallout = async (id: number, callout: callout): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(calloutsEndpoint + id + '/', {
        method: "PUT",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(callout)
    })
    .then(response => response.json())
    .then(data => {
        console.log("created response: " + JSON.stringify(data));
        return calloutFromResponse(data);
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
}

export const apiRespondToCallout = async (id: number, response: string): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(calloutsEndpoint + id + '/respond/', {
        method: "POST",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            response: response
        })
    })
    .then(response => response.json())
    .then(data => {
        //console.log("created response: " + JSON.stringify(data));
        return data
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
}


const apiGetLogResponseFromUrl = async (url: string, pageParam?: string): Promise<calloutGetLogResponse> => {
    var fullUrl = pageParam ? pageParam : url + '?ordering=-id';
    console.log('full url', fullUrl);

    return fetchJsonWithCredentials(fullUrl);
}

export const apiGetCalloutLog = async (id: number, pageParam?: string): Promise<calloutGetLogResponse> => {
    return apiGetLogResponseFromUrl(calloutsEndpoint + id + '/log/', pageParam);
}

export const apiGetChatLog = async ({pageParam} : {pageParam: string}): Promise<calloutGetLogResponse> => {
    return apiGetLogResponseFromUrl(chatEndpoint, pageParam);
}


const apiPostLogFromUrl = async (url: string, message: string): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(url, {
        method: "POST",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            type: "message",
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        //console.log("created log entry: " + JSON.stringify(data));
        return data
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
}

export const apiPostCalloutLog = async (id: number, message: string): Promise<any> => {
    return apiPostLogFromUrl(calloutsEndpoint + id + '/log/', message);
}

export const apiPostChatLog = async (message: string): Promise<any> => {
    return apiPostLogFromUrl(chatEndpoint, message);
}

export const apiSetDeviceId = async (token: string, critical?: boolean): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    let deviceId: string = "msar";
    if (critical !== undefined && critical === false) {
        deviceId = null
    }

    const tokenInfo = {
        name: "expo",
        registration_id: token,
        device_id: deviceId,
        active: true,
        type: Platform.OS === 'ios' ? 'ios' : 'android'
    }

    return fetch(devicesEndpoint, {
        method: "POST",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(tokenInfo)
    })
    .then(response => response.json())
    .then(data => {
        console.log("assigned push token: " + JSON.stringify(data));
        //return calloutFromResponse(data);
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
}

export const apiRemoveDeviceId = async (token: string): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(devicesEndpoint + token + "/", {
        method: "DELETE",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("removed push token: " + JSON.stringify(data));
        //return calloutFromResponse(data);
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
}
