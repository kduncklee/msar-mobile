import { getCredentials } from "../storage/storage";
import { callout, calloutFromResponse } from "../types/callout";
import { logEntry, logEntryFromRespsonse } from "../types/logEntry";
import { calloutGetLogResponse, loginResponse } from "./responses";

let prod_server: string = "https://malibusarhours.org/calloutapi";
let server: string = prod_server;
let tokenEndpoint: string = server + "/api-token-auth/";
let calloutsEndpoint: string = server + "/api/callouts/";

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

export const apiGetCallouts = async (status?: string): Promise<any> => {

    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    var statusArg = "";
    if (status) {
        statusArg = `?status=${status}`
    }
    
    //console.log(credentials.token);
    return fetch(calloutsEndpoint + statusArg, {
        method: "GET",
        headers: {
            'Authorization': 'Token ' + credentials.token
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
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
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(calloutsEndpoint + id + '/', {
        method: "GET",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log("get callout response: " + JSON.stringify(data));
        return calloutFromResponse(data);
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
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

export const apiGetCalloutLog = async (id: number): Promise<calloutGetLogResponse> => {

    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(calloutsEndpoint + id + '/log/', {
        method: "GET",
        headers: {
            'Authorization': 'Token ' + credentials.token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        //console.log("get callout log response: " + JSON.stringify(data));
        var results: logEntry[] = [];
        data.results.forEach(result => {
            results.push(logEntryFromRespsonse(result));
        });

        return {
            count: data.count,
            results: results
        };
    })
    .catch(error => {
        console.log(error);
        return {
            error: "Server Error"
        };
    })
}


export const apiPostCalloutLog = async (id: number, message: string): Promise<any> => {
    const credentials = await getCredentials();
    if (!credentials.token) {
        return { error: "no token"}
    }

    return fetch(calloutsEndpoint + id + '/log/', {
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
