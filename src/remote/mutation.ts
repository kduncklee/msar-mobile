import { useMutation, useQueryClient } from '@tanstack/react-query';
import useAuth from '@/hooks/useAuth';
import { logStatusType, logType } from '@/types/enums';
import { logEntryFromRespsonse } from '@/types/logEntry';
import { messageSuccessNotification } from '@/utility/pushNotifications';
import type { callout } from '@/types/callout';

//////////////////////////////////////////////////////////////////////////////
// React Query Mutations
//////////////////////////////////////////////////////////////////////////////

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
    mutationFn = api.apiPostChatLog;
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
