import * as FileSystem from 'expo-file-system';
import { getCredentials, getServer } from '@storage/storage';
import * as Application from 'expo-application';
import { Platform } from 'react-native';
import type { QueryClient } from '@tanstack/react-query';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { calloutGetLogResponse, loginResponse, tokenValidationResponse } from './responses';
import { calloutFromResponse } from '@/types/callout';
import type { callout } from '@/types/callout';
import { logEntryFromRespsonse } from '@/types/logEntry';
import type { calloutSummary } from '@/types/calloutSummary';
import { calloutSummaryFromResponse } from '@/types/calloutSummary';
import { logStatusType, logType } from '@/types/enums';
import { userDetailsFromResponse } from '@/types/user';
import { messageSuccessNotification } from '@/utility/pushNotifications';

const local_server: string = 'http://192.168.1.120:8000';
const legacy_server: string = 'https://malibusarhours.org/calloutapi';
const dev_server: string = 'https://msar-dev-app.azurewebsites.net';
const staging_server: string = 'https://staging.app.malibusarhours.org';
const prod_server: string = 'https://app.malibusarhours.org';
async function server(): Promise<string> {
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

async function tokenEndpoint(): Promise<string> {
  return `${await server()}/api-token-auth/`;
}
async function notificationsAvailableEndpoint(): Promise<string> {
  return `${await server()}/api/event_notifications/`;
}
async function radioChannelsAvailableEndpoint(): Promise<string> {
  return `${await server()}/api/radio_channels/`;
}
async function calloutsEndpoint(): Promise<string> {
  return `${await server()}/api/callouts/`;
}
async function chatEndpoint(): Promise<string> {
  return `${await server()}/api/announcement/log/`;
}
async function membersEndpoint(): Promise<string> {
  return `${await server()}/api/members/`;
}
async function devicesEndpoint(): Promise<string> {
  return `${await server()}/api/devices/`;
}
async function tokenValidationEndpoint(): Promise<string> {
  return `${await server()}/api/?format=json`;
}
async function filesEndpoint(): Promise<string> {
  return `${await server()}/api/files/`;
}

async function authorizationHeader() {
  const credentials = await getCredentials();
  if (!credentials.token) {
    throw new Error('No token');
  }
  return `Token ${credentials.token}`;
}

async function fetchWithCredentials(url: string, method: string = 'GET', body?: any, contentType?: string): Promise<any> {
  const options = {
    method,
    headers: {
      'Authorization': await authorizationHeader(),
      'Content-Type': contentType || 'application/json',
    },
    body: body || null,
  };
  const response = await fetch(url, options);
  if (!response.ok) {
    const msg = await response.text();
    console.log(response.status, msg);
    throw new Error(`Network response was ${response.status}: ${msg}`);
  }
  return response;
}

async function fetchJsonWithCredentials(url: string, method: string = 'GET', body?: any): Promise<any> {
  const json_body = body ? JSON.stringify(body) : null;
  return (await fetchWithCredentials(url, method, json_body)).json();
}

async function downloadWithCredentials(url: string, destination: string) {
  const options = {
    headers: { Authorization: await authorizationHeader() },
  };
  return FileSystem.downloadAsync(url, destination, options);
}

export async function apiGetToken(username: string, password: string): Promise<loginResponse> {
  return fetch(await tokenEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  })
    .then(response => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
      return {
        non_field_errors: [
          'Server Error',
        ],
      };
    });
}

export async function apiValidateToken(): Promise<tokenValidationResponse> {
  const credentials = await getCredentials();
  if (!credentials.token) {
    return { valid_token: false };
  }

  return fetch(await tokenValidationEndpoint(), {
    method: 'GET',
    headers: {
      Authorization: `Token ${credentials.token}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return { valid_token: true };
      }
      else {
        return { valid_token: false };
      }
      // console.log("response status " + response.status);
    })
    .catch((error) => {
      console.log(error);
      return { valid_token: false };
    });
}

export async function apiGetNotificationsAvailable(): Promise<any> {
  return fetchJsonWithCredentials(await notificationsAvailableEndpoint());
}

export async function apiGetRadioChannelsAvailable(): Promise<any> {
  return fetchJsonWithCredentials(await radioChannelsAvailableEndpoint());
}

export async function apiGetCallouts(status?: string): Promise<any> {
  let args = '?ordering=-id';
  if (status) {
    args += `&status=${status}`;
  }

  return fetchJsonWithCredentials(await calloutsEndpoint() + args);
}

export async function apiCreateCallout(callout: callout): Promise<any> {
  return fetchJsonWithCredentials(await calloutsEndpoint(), 'POST', callout);
}

export async function apiGetCallout(id: number): Promise<any> {
  return fetchJsonWithCredentials(`${await calloutsEndpoint() + id}/`).then((data) => {
    return calloutFromResponse(data);
  });
}

export async function apiUpdateCallout(id: number, callout: callout): Promise<any> {
  return fetchJsonWithCredentials(
    `${(await calloutsEndpoint()) + id}/`,
    'PUT',
    callout,
  );
}

export async function apiRespondToCallout(id: number, response: string): Promise<any> {
  return fetchJsonWithCredentials(
    `${(await calloutsEndpoint()) + id}/respond/`,
    'POST',
    {
      response,
    },
  );
}

async function apiGetLogResponseFromUrl(url: string, pageParam?: string): Promise<calloutGetLogResponse> {
  const fullUrl = pageParam || `${url}?ordering=-id`;
  console.log('full url', fullUrl);

  return fetchJsonWithCredentials(fullUrl);
}

export async function apiGetCalloutLog(id: number, pageParam?: string): Promise<calloutGetLogResponse> {
  return apiGetLogResponseFromUrl(`${await calloutsEndpoint() + id}/log/`, pageParam);
}

export async function apiGetChatLog(pageParam: string): Promise<calloutGetLogResponse> {
  return apiGetLogResponseFromUrl(await chatEndpoint(), pageParam);
}

async function apiPostLogFromUrl(url: string, message: string): Promise<any> {
  return fetchJsonWithCredentials(url, 'POST', {
    type: 'message',
    message,
  });
}

export async function apiPostCalloutLog(id: number, message: string): Promise<any> {
  return apiPostLogFromUrl(`${await calloutsEndpoint() + id}/log/`, message);
}

export async function apiPostChatLog(message: string): Promise<any> {
  return apiPostLogFromUrl(await chatEndpoint(), message);
}

export async function apiGetMembers(): Promise<any> {
  return fetchJsonWithCredentials(await membersEndpoint());
}

export async function apiSetDeviceId(token: string, active: boolean = true) {
  const tokenInfo = {
    name: Application.nativeApplicationVersion,
    registration_id: token,
    device_id: active ? 'msar' : 'msar-disabled',
    active,
    type: Platform.OS === 'ios' ? 'ios' : 'android',
  };

  try {
    const data = await fetchJsonWithCredentials(
      await devicesEndpoint(),
      'POST',
      tokenInfo,
    );
    console.log(`assigned push token: ${JSON.stringify(data)}`);
  }
  catch (error) {
    console.log(`Error saving push token: ${error.message}`);
  }
}

export async function apiRemoveDeviceId(token: string) {
  try {
    const data = await fetchWithCredentials(
      `${await devicesEndpoint() + token}/`,
      'DELETE',
    );
    console.log(`removed push token: ${JSON.stringify(data)}`);
  }
  catch (error) {
    console.log(error);
    // eslint-disable-next-line no-alert
    alert(`Error removing push token: ${error.message}`);
  }
}

export async function apiGetDeviceId(token: string): Promise<any> {
  if (!token)
    return Promise.reject(new Error('No token'));
  try {
    const data = await fetchJsonWithCredentials(
      `${await devicesEndpoint() + token}/`,
      'GET',
    );
    console.log(`get push token: ${JSON.stringify(data)}`);
    return data;
  }
  catch (error) {
    // 404 indicates it is not stored.
    console.log(error);
    return Promise.reject(error);
  }
}

export async function apiIsDeviceIdActive(token: string): Promise<boolean> {
  return (await apiGetDeviceId(token)).active;
}

export async function apiUpdateDeviceId(token: string) {
  apiGetDeviceId(token).then(
    (data) => {
      if (data.name !== Application.nativeApplicationVersion) {
        console.log('updating stored version');
        apiSetDeviceId(token, data.active);
      }
    },
    () => apiSetDeviceId(token, true),
  );
}

export async function apiUploadFile(file, id: string) {
  const body = new FormData();
  body.append('file', file);
  body.append('event', id);
  return fetchWithCredentials(await filesEndpoint(), 'POST', body, 'multipart/form-data');
}

async function apiGetDownloadFileUrl(id: number) {
  return `${await filesEndpoint() + id}/download/`;
}

export async function apiDownloadFile(id: number, destination: string) {
  return downloadWithCredentials(await apiGetDownloadFileUrl(id), destination);
}

//////////////////////////////////////////////////////////////////////////////
// React Query
//////////////////////////////////////////////////////////////////////////////

/// /// Notifications Available
function notificationsAvailabletQueryParams() {
  return {
    queryKey: ['notificationsAvailable'],
    queryFn: () => apiGetNotificationsAvailable(),
  };
}

export function useNotificationsAvailableQuery() {
  return useQuery(notificationsAvailabletQueryParams());
}

/// /// RadioChannels Available
function radioChannelsAvailabletQueryParams() {
  return {
    queryKey: ['radioChannelsAvailable'],
    queryFn: () => apiGetRadioChannelsAvailable(),
  };
}

export function useRadioChannelsAvailableQuery() {
  return useQuery(radioChannelsAvailabletQueryParams());
}

/// /// Members List
export const memberListQueryKey = ['members'];
function memberListQueryParams() {
  return {
    queryKey: memberListQueryKey,
    queryFn: async () => {
      const response = await apiGetMembers();
      return response.results.map((result: any) => userDetailsFromResponse(result));
    },
  };
}

export async function prefetchMemberListQuery(queryClient: QueryClient) {
  return queryClient.prefetchQuery(memberListQueryParams());
}

export function useMemberListQuery() {
  return useQuery(memberListQueryParams());
}

/// /// Callout List
function calloutListQueryParams(status?: string) {
  return {
    queryKey: ['callouts', status],
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
}

export async function prefetchCalloutListQuery(queryClient: QueryClient, status?: string) {
  return queryClient.prefetchQuery(calloutListQueryParams(status));
}

export function useCalloutListQuery(status?: string) {
  return useQuery(calloutListQueryParams(status));
}

/// /// Callout
export function calloutQueryKey(idInt: number) {
  return ['calloutInfo', idInt];
}
function calloutQueryParams(id: string) {
  const idInt: number = Number.parseInt(id);
  return {
    queryKey: calloutQueryKey(idInt),
    queryFn: () => apiGetCallout(idInt),
    enabled: !!id,
  };
}

export async function prefetchCalloutQuery(queryClient: QueryClient, id: string) {
  return queryClient.prefetchQuery(calloutQueryParams(id));
}

export function useCalloutQuery(id: string) {
  return useQuery(calloutQueryParams(id));
}

/// /// Callout Log
export function calloutLogQueryKey(idInt: number) {
  return ['calloutLog', idInt];
}
function calloutLogQueryParams(idInt: number) {
  return {
    queryKey: calloutLogQueryKey(idInt),
    queryFn: ({ pageParam }) => apiGetCalloutLog(idInt, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage, _pages) => lastPage?.next,
  };
}

export async function prefetchCalloutLogQuery(queryClient: QueryClient, id: string) {
  return queryClient.prefetchInfiniteQuery(calloutLogQueryParams(id));
}

export function useCalloutLogInfiniteQuery(idInt: number) {
  return useInfiniteQuery(calloutLogQueryParams(idInt));
}

/// /// Chat
function chatLogQueryParams() {
  return {
    queryKey: ['chat'],
    queryFn: ({ pageParam }) => apiGetChatLog(pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage, _pages) => lastPage?.next,
  };
}

export async function prefetchChatLogQuery(queryClient: QueryClient) {
  return queryClient.prefetchInfiniteQuery(chatLogQueryParams());
}

export function useChatLogInfiniteQuery() {
  return useInfiniteQuery(chatLogQueryParams());
}

/// /// Chat / Callout Log Mutations
// Combination hook needed for shared component.
export function useChatOrCalloutLogMutation(idInt: number) {
  let mutationFn;
  let queryKey;
  if (idInt) { // CalloutLog
    mutationFn = (message: string) => apiPostCalloutLog(idInt, message);
    queryKey = ['calloutLog', idInt];
  }
  else { // Chat
    mutationFn = apiPostChatLog;
    queryKey = ['chat'];
  }
  return useLogMutation(mutationFn, queryKey);
}
export function useCalloutLogMutation(idInt: number) {
  return useChatOrCalloutLogMutation(idInt);
}
export function useChatLogMutation() {
  return useChatOrCalloutLogMutation(undefined);
}

export function useLogMutation(mutationFn, queryKey) {
  const queryClient = useQueryClient();

  interface LogVariables {
    id?: string;
    message: string;
  };

  const updateItem = (prev, id, replacement) => {
    return {
      ...prev,
      pages: prev.pages.map(page => ({
        ...page,
        results: page.results.map(item =>
          item.id === id
            ? replacement
            : item,
        ),
      })),
    };
  };
  const updateItemStatus = (prev, id, status) => {
    return {
      ...prev,
      pages: prev.pages.map(page => ({
        ...page,
        results: page.results.map(item =>
          item.id === id
            ? { ...item, status }
            : item,
        ),
      })),
    };
  };

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

      const id = `temp_${Date.now().toString(36)}`;

      // Create optimistic message
      const optimistic = {
        id,
        type: logType.MESSAGE,
        member: { username: global.currentCredentials.username },
        message: variables.message,
        status: logStatusType.PENDING,
        created_at: null,
      };

      // Add optimistic message to message list
      queryClient.setQueryData(queryKey, (prev) => {
        if (!prev) {
          return prev;
        }
        const working = {
          ...prev,
          pages: prev.pages.slice(),
        };
        working.pages[0] = { ...working.pages[0] };
        working.pages[0].results = [optimistic, ...working.pages[0].results];
        return working;
      });

      // Return context with the optimistic message's id
      return { id };
    },

    onSuccess: (result, _variables, context) => {
      const entry = logEntryFromRespsonse(result);
      // Replace optimistic message in the list with the result
      queryClient.setQueryData(queryKey, (old) => {
        return updateItem(old, context.id, entry);
      });
      // Invalidate the cache to get the actual data on server.
      queryClient.invalidateQueries({ queryKey });

      messageSuccessNotification(result.message);
    },

    onError: (_error, _variables, context) => {
      // Remove optimistic message from the list
      queryClient.setQueryData(queryKey, (old) => {
        console.log('e id, old', context.id, old);
        return updateItemStatus(old, context.id, logStatusType.ERROR);
      });
    },

    retry: 16, // 5 minutes (6 in first minute, then 30s each)
  }, queryClient);
}
