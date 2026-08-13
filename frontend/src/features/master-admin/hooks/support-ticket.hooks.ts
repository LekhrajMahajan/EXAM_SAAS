import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supportTicketApi, type TicketFilters } from "../api/support-ticket.api";
import { toast } from "react-hot-toast";

export const useSupportTicketStats = () => {
  return useQuery({
    queryKey: ["support-tickets-stats"],
    queryFn: () => supportTicketApi.getStatistics(),
  });
};

export const useSupportTickets = (filters: TicketFilters) => {
  return useQuery({
    queryKey: ["support-tickets", filters],
    queryFn: () => supportTicketApi.getAll(filters),
  });
};

export const useSupportTicketById = (id: string) => {
  return useQuery({
    queryKey: ["support-ticket", id],
    queryFn: () => supportTicketApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSupportTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => supportTicketApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets-stats"] });
      toast.success("Ticket created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create ticket");
    },
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => supportTicketApi.updateStatus(id, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["support-tickets-stats"] });
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, assigneeId }: { id: string; assigneeId: string }) => supportTicketApi.assign(id, assigneeId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-tickets"] });
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.id] });
      toast.success("Ticket assigned successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to assign ticket");
    },
  });
};

export const useAddTicketMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { message: string; isInternalNote?: boolean; attachments?: any[] } }) => 
      supportTicketApi.addMessage(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["support-ticket", variables.id] });
      toast.success("Message added successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to add message");
    },
  });
};
