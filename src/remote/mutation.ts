import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-root-toast';
import * as Sentry from '@sentry/react-native';
import useAuth from '@/hooks/useAuth';
import { logStatusType, logType } from '@/types/enums';
import { logEntryFromRespsonse } from '@/types/logEntry';
import { messageSuccessNotification } from '@/utility/pushNotifications';
import type { callout } from '@/types/callout';
import type { patrol } from '@/types/patrol';
import { usePatrolListQuery } from '@/remote/query';

//////////////////////////////////////////////////////////////////////////////
// React Query Mutations
//////////////////////////////////////////////////////////////////////////////

/// /// Callout Mutations
export function useCalloutCreateMutation() {
  const { api } = useAuth();
  return useMutation({
    mutationFn: (callout: callout) => api.apiCreateCallout(callout),
  });
}

export function useCalloutUpdateMutation() {
  const { api } = useAuth();
  return useMutation({
    mutationFn: ({ idInt, callout }: { idInt: number; callout: callout }) =>
      api.apiUpdateCallout(idInt, callout),
  });
}

/// /// Patrol Mutations
export function usePatrolCreateMutation() {
  const { api } = useAuth();
  const patrolQuery = usePatrolListQuery();
  return useMutation({
    mutationFn: (patrol: patrol) => api.apiCreatePatrol(patrol),
    onSuccess: (data, _variables, _context) => {
      console.log('patrol created', data);
      patrolQuery.refetch();
    },
    onError: (error, _variables, _context) => {
      Sentry.captureException(error);
      Toast.show(`Unable to create patrol: ${error.message}`, {
        duration: Toast.durations.LONG,
      });
    },
  });
}

export function usePatrolUpdateMutation() {
  const { api } = useAuth();
  return useMutation({
    mutationFn: ({ idInt, patrol }: { idInt: number; patrol: patrol }) =>
      api.apiUpdatePatrol(idInt, patrol),
  });
}

export function usePatrolRemoveMutation() {
  const { api } = useAuth();
  const patrolQuery = usePatrolListQuery();
  return useMutation({
    mutationFn: (idInt: number) => api.apiRemovePatrol(idInt),
    onSuccess: (data, _variables, _context) => {
      console.log('patrol deleted', data);
      patrolQuery.refetch();
    },
    onError: (error, _variables, _context) => {
      Sentry.captureException(error);
      Toast.show(`Unable to delete patrol: ${error.message}`, {
        duration: Toast.durations.LONG,
      });
    },
  });
}

/// /// Chat / Callout Log Mutations
// Combination hook needed for shared component.
export function useChatOrCalloutLogMutation(idInt: number) {
  const { api } = useAuth();
  let mutationFn;
  let queryKey;
  if (idInt) { // CalloutLog
    mutationFn = (message: string) => api.apiPostCalloutLog(idInt, message);
    queryKey = ['calloutLog', idInt];
  }
  else { // Chat
    mutationFn = (message: string) => api.apiPostChatLog(message);
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
  const { username } = useAuth();

  interface LogVariables {
    id?: string;
    message: string;
  };

  const updateItem = (prev, id, replacement) => {
    return {
      ...prev,
      pages: prev.pages.map(page => ({
        ...page,
        results: page.results.map(item => item.id === id
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
        results: page.results.map(item => item.id === id
          ? { ...item, status }
          : item,
        ),
      })),
    };
  };

  return useMutation({
    mutationFn: async (variables: LogVariables) => mutationFn(variables.message),

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
        member: { username },
        message: variables.message,
        status: logStatusType.PENDING,
        created_at: null,
      };

      // Add optimistic message to message list
      queryClient.setQueryData(queryKey, (prev: any) => {
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
