import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";
import type { IIntegration } from "../types/integration.types";

export const useIntegrations = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: ["integrations", filters],
    queryFn: async () => {
      const { data } = await api.get<{ data: { data: IIntegration[], total: number } }>("/system-settings/integrations", {
        params: filters,
      });
      return data.data;
    },
  });
};

export const useIntegration = (id: string) => {
  return useQuery({
    queryKey: ["integrations", id],
    queryFn: async () => {
      const { data } = await api.get<{ data: IIntegration }>(`/system-settings/integrations/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useCreateIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<IIntegration>) => {
      const { data } = await api.post("/system-settings/integrations", payload);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useUpdateIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<IIntegration> }) => {
      const { data } = await api.patch(`/system-settings/integrations/${id}`, payload);
      return data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      queryClient.invalidateQueries({ queryKey: ["integrations", variables.id] });
    },
  });
};

export const useDeleteIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/system-settings/integrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
    },
  });
};

export const useTestIntegration = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/system-settings/integrations/test/${id}`);
      return data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["integrations"] });
      queryClient.invalidateQueries({ queryKey: ["integrations", id] });
    },
  });
};
