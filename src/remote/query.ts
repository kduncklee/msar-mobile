import type { QueryClient } from '@tanstack/react-query';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { formatISO } from 'date-fns';
import type { Api } from './api';
import type { calloutSummary } from '@/types/calloutSummary';
import { calloutSummaryFromResponse } from '@/types/calloutSummary';
import type { member_status_type, user_detail } from '@/types/user';
import { memberStatusTypeFromResponse, userDetailsFromResponse } from '@/types/user';
import useAuth from '@/hooks/useAuth';
import type { event } from '@/types/event';
import { eventFromResponse } from '@/types/event';
import { type patrol, patrolFromResponse } from '@/types/patrol';
import type { calloutResponseAvailable } from '@/types/calloutResponseAvailable';

//////////////////////////////////////////////////////////////////////////////
// React Query
//////////////////////////////////////////////////////////////////////////////

/// /// Notifications Available
function notificationsAvailabletQueryParams(api: Api) {
  return {
    queryKey: ['notificationsAvailable'],
    queryFn: () => api.apiGetNotificationsAvailable(),
  };
}

export function useNotificationsAvailableQuery() {
  const { api } = useAuth();
  return useQuery(notificationsAvailabletQueryParams(api));
}
/// /// RadioChannels Available
function radioChannelsAvailabletQueryParams(api: Api) {
  return {
    queryKey: ['radioChannelsAvailable'],
    queryFn: () => api.apiGetRadioChannelsAvailable(),
  };
}

export function useRadioChannelsAvailableQuery() {
  const { api } = useAuth();
  return useQuery(radioChannelsAvailabletQueryParams(api));
}

/// /// Operation Types Available
function operationTypesAvailabletQueryParams(api: Api) {
  return {
    queryKey: ['operationTypesAvailable'],
    queryFn: () => api.apiGetOperationTypesAvailable(),
  };
}

export function useOperationTypesAvailableQuery() {
  const { api } = useAuth();
  return useQuery(operationTypesAvailabletQueryParams(api));
}

/// /// Callout Responses Available
function calloutResponsesAvailabletQueryParams(api: Api) {
  return {
    queryKey: ['calloutResponsesAvailable'],
    queryFn: () => api.apiGetCalloutResponsesAvailable(),
  };
}

export function useCalloutResponsesAvailableQuery() {
  const { api } = useAuth();
  return useQuery(calloutResponsesAvailabletQueryParams(api));
}

export function useCalloutResponsesAvailableMap(): Map<string, calloutResponseAvailable> {
  const calloutResponesQuery = useCalloutResponsesAvailableQuery();
  if (!calloutResponesQuery.data) {
    return new Map();
  };
  return new Map(calloutResponesQuery.data.results.map(i => [i.response, i] as [string, calloutResponseAvailable]));
}

/// /// Events List

function argsStartAtFinishAt(startAt: Date, finishAt: Date, isEvent: boolean) {
  // TODO: This should be finish_at to handle multi-day patrols, but that doesn't work if finish_at is null.
  const finish_filter = isEvent ? 'finish_at' : 'start_at';
  let args = isEvent ? '&' : '?';
  if (startAt) {
    args += `start_at_iso_after=${formatISO(startAt)}`;
  }
  if (finishAt) {
    args += `${args ? '&' : '?'}${finish_filter}_iso_before=${formatISO(finishAt)}`;
  }
  return args;
}

const eventListQueryKey = ['events'];
function eventListQueryParams(api: Api, startAt?: Date, finishAt?: Date) {
  const args = argsStartAtFinishAt(startAt, finishAt, true);
  return {
    queryKey: [...eventListQueryKey, args],
    queryFn: async (): Promise<event[]> => {
      const response = await api.apiGetEvents(args);
      return response.results.map((result: any) => eventFromResponse(result));
    },
  };
}

export async function prefetchEventListQuery(queryClient: QueryClient, api: Api) {
  return queryClient.prefetchQuery(eventListQueryParams(api));
}

export function useEventListQuery(startAt?: Date, finishAt?: Date) {
  const { api } = useAuth();
  return useQuery(eventListQueryParams(api, startAt, finishAt));
}

/// /// Patrols List

const patrolListQueryKey = ['patrols'];
function patrolListQueryParams(api: Api, startAt?: Date, finishAt?: Date) {
  const args = argsStartAtFinishAt(startAt, finishAt, false);
  return {
    queryKey: [...patrolListQueryKey, args],
    queryFn: async (): Promise<patrol[]> => {
      const response = await api.apiGetPatrols(args);
      return response.results.map((result: any) => patrolFromResponse(result));
    },
  };
}

export async function prefetchPatrolListQuery(queryClient: QueryClient, api: Api) {
  return queryClient.prefetchQuery(patrolListQueryParams(api));
}

export async function invalidatePatrolListQuery(queryClient: QueryClient) {
  return queryClient.invalidateQueries({ queryKey: patrolListQueryKey });
}

export function usePatrolListQuery(startAt?: Date, finishAt?: Date) {
  const { api } = useAuth();
  return useQuery(patrolListQueryParams(api, startAt, finishAt));
}

/// /// Member Status Types List

export const memberStatusTypesQueryKey = ['members'];
function memberStatusTypesQueryParams(api: Api) {
  return {
    queryKey: memberListQueryKey,
    queryFn: async (): Promise<member_status_type[]> => {
      const response = await api.apiGetMemberStatusTypes();
      return response.results.map((result: any) => memberStatusTypeFromResponse(result));
    },
  };
}

export function useMemberStatusTypesQuery() {
  const { api } = useAuth();
  return useQuery(memberStatusTypesQueryParams(api));
}

/// /// Members List

export const memberListQueryKey = ['members'];
function memberListQueryParams(api: Api) {
  return {
    queryKey: memberListQueryKey,
    queryFn: async (): Promise<user_detail[]> => {
      const response = await api.apiGetMembers();
      return response.results.map((result: any) => userDetailsFromResponse(result));
    },
  };
}

export async function prefetchMemberListQuery(queryClient: QueryClient, api: Api) {
  return queryClient.prefetchQuery(memberListQueryParams(api));
}

export function useMemberListQuery() {
  const { api } = useAuth();
  return useQuery(memberListQueryParams(api));
}

/// /// Callout List
function calloutListQueryParams(api: Api, status?: string) {
  return {
    queryKey: ['callouts', status],
    queryFn: async () => {
      console.log(status);
      const response = await api.apiGetCallouts(status);
      const callouts: calloutSummary[] = [];
      response.results.forEach((result: any) => {
        // Perform operations on each result item here
        callouts.push(calloutSummaryFromResponse(result));
      });
      return callouts;
    },
  };
}

export async function prefetchCalloutListQuery(queryClient: QueryClient, api: Api, status?: string) {
  return queryClient.prefetchQuery(calloutListQueryParams(api, status));
}

export function useCalloutListQuery(status?: string) {
  const { api } = useAuth();
  return useQuery(calloutListQueryParams(api, status));
}
/// /// Callout

export function calloutQueryKey(idInt: number) {
  return ['calloutInfo', idInt];
}
function calloutQueryParams(api: Api, id: string) {
  const idInt: number = Number.parseInt(id);
  return {
    queryKey: calloutQueryKey(idInt),
    queryFn: () => api.apiGetCallout(idInt),
    enabled: !!id,
  };
}

export async function prefetchCalloutQuery(queryClient: QueryClient, api: Api, id: string) {
  return queryClient.prefetchQuery(calloutQueryParams(api, id));
}

export function useCalloutQuery(id: string) {
  const { api } = useAuth();
  return useQuery(calloutQueryParams(api, id));
}
/// /// Callout Log

export function calloutLogQueryKey(idInt: number) {
  return ['calloutLog', idInt];
}
function calloutLogQueryParams(api: Api, idInt: number) {
  return {
    queryKey: calloutLogQueryKey(idInt),
    queryFn: ({ pageParam }) => api.apiGetCalloutLog(idInt, pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage, _pages) => lastPage?.next,
  };
}

export async function prefetchCalloutLogQuery(queryClient: QueryClient, api: Api, idInt: number) {
  return queryClient.prefetchInfiniteQuery(calloutLogQueryParams(api, idInt));
}

export function useCalloutLogInfiniteQuery(idInt: number) {
  const { api } = useAuth();
  return useInfiniteQuery(calloutLogQueryParams(api, idInt));
}
/// /// Chat
function chatLogQueryParams(api: Api) {
  return {
    queryKey: ['chat'],
    queryFn: ({ pageParam }) => api.apiGetChatLog(pageParam),
    initialPageParam: '',
    getNextPageParam: (lastPage, _pages) => lastPage?.next,
  };
}

export async function prefetchChatLogQuery(queryClient: QueryClient, api: Api) {
  return queryClient.prefetchInfiniteQuery(chatLogQueryParams(api));
}

export function useChatLogInfiniteQuery() {
  const { api } = useAuth();
  return useInfiniteQuery(chatLogQueryParams(api));
}
