import { getCredentials, getServer } from "../storage/storage";
import { callout, calloutFromResponse } from "../types/callout";
import { logEntry, logEntryFromRespsonse } from "../types/logEntry";
import { calloutGetLogResponse, loginResponse, tokenValidationResponse } from "./responses";
import * as Application from 'expo-application';
import { Platform } from "react-native";
import { useQuery, useMutation, QueryClient, useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { calloutSummary, calloutSummaryFromResponse } from "../types/calloutSummary";
import { logStatusType, logType } from "types/enums";

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
const notificationsAvailableEndpoint = async (): Promise<string> =>
  (await server()) + "/api/event_notifications/";
const radioChannelsAvailableEndpoint = async (): Promise<string> =>
  (await server()) + "/api/radio_channels/";
const calloutsEndpoint = async (): Promise<string> =>
  (await server()) + "/api/callouts/";
const chatEndpoint = async (): Promise<string> =>
  (await server()) + "/api/announcement/log/";
const devicesEndpoint = async (): Promise<string> =>
  (await server()) + "/api/devices/";
const tokenValidationEndpoint = async (): Promise<string> =>
  (await server()) + "/api/?format=json";

const fetchWithCredentials = async (
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
  return response;
};

const fetchJsonWithCredentials = async (
  url: string,
  method: string = "GET",
  body?: any
): Promise<any> => {
    return (await fetchWithCredentials(url, method, body)).json();
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


export const apiGetNotificationsAvailable = async (): Promise<any> => {
    return fetchJsonWithCredentials(await notificationsAvailableEndpoint());
}

export const apiGetRadioChannelsAvailable = async (): Promise<any> => {
    return fetchJsonWithCredentials(await radioChannelsAvailableEndpoint());
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

export const apiGetChatLog = async (pageParam: string): Promise<calloutGetLogResponse> => {
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

export const apiSetDeviceId = async (token: string, active: boolean = true) => {
    const tokenInfo = {
        name: Application.nativeApplicationVersion,
        registration_id: token,
        device_id: active ? "msar" : "msar-disabled",
        active: active,
        type: Platform.OS === 'ios' ? 'ios' : 'android'
    }

    try {
        const data = await fetchJsonWithCredentials(
            await devicesEndpoint(), "POST", tokenInfo);
        console.log("assigned push token: " + JSON.stringify(data));
    } catch (error) {
        console.log('Error saving push token: ' + error.message);
    }
}

export const apiRemoveDeviceId = async (token: string) => {
    try {
        const data = await fetchWithCredentials(
            await devicesEndpoint() + token + "/", "DELETE");
        console.log("removed push token: " + JSON.stringify(data));
    } catch (error) {
        console.log(error);
        alert('Error removing push token: ' + error.message);
    }
}

export const apiGetDeviceId = async (token: string): Promise<any> => {
    if (!token) return Promise.reject();
    try {
        const data = await fetchJsonWithCredentials(
            await devicesEndpoint() + token + "/", "GET");
        console.log("get push token: " + JSON.stringify(data));
        return data;
    } catch (error) {
        // 404 indicates it is not stored.
        console.log(error);
        return Promise.reject();
    }
}

export const apiIsDeviceIdActive = async (token: string): Promise<boolean> => {
    return (await apiGetDeviceId(token)).active;
}

export const apiUpdateDeviceId = async (token: string) => {
    apiGetDeviceId(token).then(
        (data) => {
            if (data.name != Application.nativeApplicationVersion) {
                console.log('updating stored version');
                apiSetDeviceId(token, data.active);
            }
        },
        () => apiSetDeviceId(token, true)
    );
}


//////////////////////////////////////////////////////////////////////////////
// React Query
//////////////////////////////////////////////////////////////////////////////

////// Notifications Available
const notificationsAvailabletQueryParams = () => {
  return {
    queryKey: ["notificationsAvailable"],
    queryFn: () => apiGetNotificationsAvailable(),
  };
};

export const useNotificationsAvailableQuery = () => {
  return useQuery(notificationsAvailabletQueryParams());
};

////// RadioChannels Available
const radioChannelsAvailabletQueryParams = () => {
  return {
    queryKey: ["radioChannelsAvailable"],
    queryFn: () => apiGetRadioChannelsAvailable(),
  };
};

export const useRadioChannelsAvailableQuery = () => {
  return useQuery(radioChannelsAvailabletQueryParams());
};

////// Callout List
const calloutListQueryParams = (status?: string) => {
  return {
    queryKey: ["callouts", status],
    queryFn: async () => {
      console.log(status);
      const response = await apiGetCallouts(status);
      const callouts: calloutSummary[] = [];
      response.results.forEach((result: any) => {
        // Perform operations on each result item here
        callouts.push(calloutSummaryFromResponse(result));
      });
      return callouts;
    },
  };
};

export const prefetchCalloutListQuery = async (
  queryClient: QueryClient,
  status?: string
) => {
  return queryClient.prefetchQuery(calloutListQueryParams(status));
};

export const useCalloutListQuery = (status?: string) => {
  return useQuery(calloutListQueryParams(status));
};

////// Callout
const calloutQueryParams = (id: string) => {
  const idInt: number = parseInt(id);
  return {
    queryKey: ["calloutInfo", idInt],
    queryFn: () => apiGetCallout(idInt),
  };
};

export const prefetchCalloutQuery = async (
  queryClient: QueryClient,
  id: string
) => {
  return queryClient.prefetchQuery(calloutQueryParams(id));
};

export const useCalloutQuery = (id: string) => {
  return useQuery(calloutQueryParams(id));
};

////// Callout Log
const calloutLogQueryParams = (id: string) => {
  const idInt: number = parseInt(id);
  return {
    queryKey: ["calloutLog", idInt],
    queryFn: ({ pageParam }) => apiGetCalloutLog(idInt, pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage?.next,
  };
};

export const prefetchCalloutLogQuery = async (
  queryClient: QueryClient,
  id: string
) => {
  return queryClient.prefetchInfiniteQuery(calloutLogQueryParams(id));
};

export const useCalloutLogInfiniteQuery = (id: string) => {
  return useInfiniteQuery(calloutLogQueryParams(id));
};

////// Chat 
const chatLogQueryParams = () => {
  return {
    queryKey: ["chat"],
    queryFn: ({ pageParam }) => apiGetChatLog(pageParam),
    initialPageParam: "",
    getNextPageParam: (lastPage, pages) => lastPage?.next,
  };
};

export const prefetchChatLogQuery = async (queryClient: QueryClient) => {
  return queryClient.prefetchInfiniteQuery(chatLogQueryParams());
};

export const useChatLogInfiniteQuery = () => {
  return useInfiniteQuery(chatLogQueryParams());
};

////// Chat / Callout Log Mutations
export const useCalloutLogMutation = (idInt: number) => {
  return useLogMutation((message: string) => apiPostCalloutLog(idInt, message), ["calloutLog", idInt]);
}

export const useChatLogMutation = () => {
  return useLogMutation(apiPostChatLog, ["chat"]);
}

export const useLogMutation = (mutationFn, queryKey) => {
  const queryClient = useQueryClient();

  type LogVariables = {
    id?: string,
    message: string,
  }

  const updateItem = (prev, id, replacement) => {
    return {
      ...prev,
      pages: prev.pages.map((page) => ({
        ...page,
        results: page.results.map((item) =>
          item.id === id
            ? replacement
            : item
        )
      }))
    };
  }
  const updateItemStatus = (prev, id, status) => {
    return {
      ...prev,
      pages: prev.pages.map((page) => ({
        ...page,
        results: page.results.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      }))
    };
  }

  return useMutation({
    mutationFn: async (variables: LogVariables) => 
      mutationFn(variables.message),

    onMutate: async (variables) => {
      // Cancel current queries for the message list
      await queryClient.cancelQueries({ queryKey });

      if (variables.id) { // already existing, this is a retry
        queryClient.setQueryData(queryKey, (old) => {
          return updateItemStatus(old, variables.id, logStatusType.PENDING);
        });
        return { id: variables.id };
      }

      const id = "temp_" + Date.now().toString(36);

      // Create optimistic message
      const optimistic = {
        id: id,
        type: logType.MESSAGE,
        member: { username: global.currentCredentials.username },
        message: variables.message,
        status: logStatusType.PENDING,
        created_at: null,
      };

      // Add optimistic message to message list
      queryClient.setQueryData(queryKey, (prev) => {
        if (!prev) { return prev; }
        const working = {
          ...prev,
          pages: prev.pages.slice()
        };
        working.pages[0] = {...working.pages[0]};
        working.pages[0].results = [optimistic, ...working.pages[0].results];
        return working;
      });

      // Return context with the optimistic message's id
      return { id };
    },

    onSuccess: (result, variables, context) => {
      const entry = logEntryFromRespsonse(result);
      // Replace optimistic message in the list with the result
      queryClient.setQueryData(queryKey, (old) => {
        return updateItem(old, context.id, entry);
      });
      // Invalidate the cache to get the actual data on server.
      queryClient.invalidateQueries({ queryKey });
    },

    onError: (error, variables, context) => {
      // Remove optimistic message from the list
      queryClient.setQueryData(queryKey, (old) => {
        console.log("e id, old", context.id, old);
        return updateItemStatus(old, context.id, logStatusType.ERROR);
      });
    },

    retry: 16,  // 5 minutes (6 in first minute, then 30s each)
  }, queryClient);
};