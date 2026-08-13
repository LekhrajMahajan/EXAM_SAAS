import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subscriptionApi } from "../api/subscription.api";
import { toast } from "react-hot-toast";
import type { 
  AssignSubscriptionPayload,
  RenewSubscriptionPayload,
  ChangeSubscriptionPayload,
  StatusChangePayload
} from "../types/subscription.types";

export const SUBSCRIPTION_KEYS = {
  all: ["subscriptions"] as const,
  stats: () => [...SUBSCRIPTION_KEYS.all, "stats"] as const,
  lists: () => [...SUBSCRIPTION_KEYS.all, "list"] as const,
  list: (filters: string) => [...SUBSCRIPTION_KEYS.lists(), { filters }] as const,
  details: () => [...SUBSCRIPTION_KEYS.all, "detail"] as const,
  detail: (id: string) => [...SUBSCRIPTION_KEYS.details(), id] as const,
};

export const useSubscriptionStats = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.stats(),
    queryFn: async () => {
      const { data } = await subscriptionApi.getDashboardStats();
      return data.data; // { total, active, expired, mrr }
    },
  });
};

export const useSubscriptions = (params?: any) => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.list(JSON.stringify(params)),
    queryFn: async () => {
      const { data } = await subscriptionApi.getAll(params);
      return data.data; // Assumes backend wraps with { success, message, data: { data, total, page... } }
    },
  });
};

export const useSubscription = (id: string) => {
  return useQuery({
    queryKey: SUBSCRIPTION_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await subscriptionApi.getById(id);
      return data.data; // { subscription, history }
    },
    enabled: !!id,
  });
};

export const useAssignSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AssignSubscriptionPayload) => {
      const { data } = await subscriptionApi.assign(payload);
      return data;
    },
    onSuccess: () => {
      toast.success("Subscription assigned successfully");
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to assign subscription");
    },
  });
};

export const useRenewSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: RenewSubscriptionPayload }) => {
      const { data } = await subscriptionApi.renew(id, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success("Subscription renewed successfully");
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to renew subscription");
    },
  });
};

export const useChangeSubscription = (action: "upgrade" | "downgrade") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ChangeSubscriptionPayload }) => {
      const apiCall = action === "upgrade" ? subscriptionApi.upgrade : subscriptionApi.downgrade;
      const { data } = await apiCall(id, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Subscription ${action}d successfully`);
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Failed to ${action} subscription`);
    },
  });
};

export const useSubscriptionStatusChange = (action: "suspend" | "resume" | "cancel") => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: StatusChangePayload }) => {
      const apiCall = subscriptionApi[action];
      const { data } = await apiCall(id, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Subscription ${action} action successful`);
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || `Failed to ${action} subscription`);
    },
  });
};
