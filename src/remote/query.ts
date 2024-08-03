import type { QueryClient } from '@tanstack/react-query';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import type { Api } from './api';
import type { calloutSummary } from '@/types/calloutSummary';
import { calloutSummaryFromResponse } from '@/types/calloutSummary';
import { userDetailsFromResponse } from '@/types/user';
import useAuth from '@/hooks/useAuth';

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
/// /// Members List

export const memberListQueryKey = ['members'];
function memberListQueryParams(api: Api) {
  return {
    queryKey: memberListQueryKey,
    queryFn: async () => {
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
