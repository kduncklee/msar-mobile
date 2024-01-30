import { getCredentials, getServer } from "../storage/storage";
import { callout, calloutFromResponse } from "../types/callout";
import { logEntry, logEntryFromRespsonse } from "../types/logEntry";
import { calloutGetLogResponse, loginResponse, tokenValidationResponse } from "./responses";
import * as Application from 'expo-application';
import { Platform } from "react-native";
import { useQuery, useMutation } from "@tanstack/react-query";

let local_server: string = "http://192.168.1.120:8000";
let legacy_server: string = "https://malibusarhours.org/calloutapi";
let dev_server: string = "https://msar-dev-app.azurewebsites.net";
let staging_server: string = "https://staging.app.malibusarhours.org";
let prod_server: string = "https://app.malibusarhours.org";
const server = async (): Promise<string> => {
    const server = await getServer();
    switch (server) {
        case 'local':
            return local_server;
        case 'legacy':
            return legacy_server;
        case 'dev':
            return dev_server;
        case 'staging':
            return staging_server;
    }
    return prod_server;
}

const tokenEndpoint = async (): Promise<string> =>
  (await server()) + "/api-token-auth/";
const calloutsEndpoint = async (): Promise<string> =>
  (await server()) + "/api/callouts/";
const chatEndpoint = async (): Promise<string> =>
  (await server()) + "/api/announcement/log/";
const devicesEndpoint = async (): Promise<string> =>
  (await server()) + "/api/devices/";
const tokenValidationEndpoint = async (): Promise<string> =>
  (await server()) + "/api/?format=json";

const fetchJsonWithCredentials = async (
  url: string,
  method: string = "GET",
  body?: any
): Promise<any> => {
  const credentials = await getCredentials();
  if (!credentials.token) {
    throw new Error("No token");
  }

  let options = {
    method: method,
    headers: {
      Authorization: "Token " + credentials.token,
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  if (!response.ok) {
    const msg = await response.text();
    console.log(response.status, msg);
    throw new Error("Network response was " + response.status + ": " + msg);
  }
  return response.json();
};

export const apiGetToken = async (username: string, password: string): Promise<loginResponse> => {

    return fetch(await tokenEndpoint(), {
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

    return fetch(await tokenValidationEndpoint(), {
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

    return fetchJsonWithCredentials(await calloutsEndpoint() + args);
}

export const apiCreateCallout = async (callout: callout): Promise<any> => {
    return fetchJsonWithCredentials(await calloutsEndpoint(), "POST", callout);
}

export const apiGetCallout = async (id: number): Promise<any> => {
    return fetchJsonWithCredentials(await calloutsEndpoint() + id + '/').then(data => {
        return calloutFromResponse(data);
    });
}

export const apiUpdateCallout = async (id: number, callout: callout): Promise<any> => {
    return fetchJsonWithCredentials(
      (await calloutsEndpoint()) + id + "/",
      "PUT",
      callout
    );
}

export const apiRespondToCallout = async (
  id: number,
  response: string
): Promise<any> => {
  return fetchJsonWithCredentials(
    (await calloutsEndpoint()) + id + "/respond/",
    "POST",
    {
      response: response,
    }
  );
};


const apiGetLogResponseFromUrl = async (url: string, pageParam?: string): Promise<calloutGetLogResponse> => {
    var fullUrl = pageParam ? pageParam : url + '?ordering=-id';
    console.log('full url', fullUrl);

    return fetchJsonWithCredentials(fullUrl);
}

export const apiGetCalloutLog = async (id: number, pageParam?: string): Promise<calloutGetLogResponse> => {
    return apiGetLogResponseFromUrl(await calloutsEndpoint() + id + '/log/', pageParam);
}

export const apiGetChatLog = async ({pageParam} : {pageParam: string}): Promise<calloutGetLogResponse> => {
    return apiGetLogResponseFromUrl(await chatEndpoint(), pageParam);
}


const apiPostLogFromUrl = async (url: string, message: string): Promise<any> => {
    return fetchJsonWithCredentials(url, "POST", {
      type: "message",
      message: message,
    });
}

export const apiPostCalloutLog = async (id: number, message: string): Promise<any> => {
    return apiPostLogFromUrl(await calloutsEndpoint() + id + '/log/', message);
}

export const apiPostChatLog = async (message: string): Promise<any> => {
    return apiPostLogFromUrl(await chatEndpoint(), message);
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
        name: Application.nativeApplicationVersion,
        registration_id: token,
        device_id: deviceId,
        active: true,
        type: Platform.OS === 'ios' ? 'ios' : 'android'
    }

    return fetch(await devicesEndpoint(), {
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

    return fetch(await devicesEndpoint() + token + "/", {
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

export const useCalloutQuery = (id: string) => {
    const idInt: number = parseInt(id);
    return useQuery({
        queryKey: ['calloutInfo', idInt],
        queryFn: () => apiGetCallout(idInt)
    })
}
