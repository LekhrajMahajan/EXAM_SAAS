import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceApi } from "../api/invoice.api";
import type { GenerateNotePayload, UpdateInvoiceStatusPayload } from "../types/invoice.types";
import { toast } from "react-hot-toast";

const INVOICE_KEYS = {
  all: ["invoices"] as const,
  lists: () => [...INVOICE_KEYS.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...INVOICE_KEYS.lists(), { filters }] as const,
  details: () => [...INVOICE_KEYS.all, "detail"] as const,
  detail: (id: string) => [...INVOICE_KEYS.details(), id] as const,
  stats: (filters?: Record<string, unknown>) => [...INVOICE_KEYS.all, "stats", { filters }] as const,
  charts: (filters?: Record<string, unknown>) => [...INVOICE_KEYS.all, "charts", { filters }] as const,
  topCompanies: (filters?: Record<string, unknown>) => [...INVOICE_KEYS.all, "topCompanies", { filters }] as const,
  creditNotes: (id: string) => [...INVOICE_KEYS.detail(id), "creditNotes"] as const,
  debitNotes: (id: string) => [...INVOICE_KEYS.detail(id), "debitNotes"] as const,
};

export const useInvoices = (filters: Record<string, unknown>) => {
  return useQuery({
    queryKey: INVOICE_KEYS.list(filters),
    queryFn: async () => {
      const response = await invoiceApi.getAll(filters);
      return response.data;
    },
  });
};

export const useInvoice = (id: string) => {
  return useQuery({
    queryKey: INVOICE_KEYS.detail(id),
    queryFn: async () => {
      const response = await invoiceApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useInvoiceStats = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: INVOICE_KEYS.stats(filters),
    queryFn: async () => {
      const response = await invoiceApi.getDashboardStats(filters);
      return response.data.data;
    },
  });
};

export const useInvoiceCharts = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: INVOICE_KEYS.charts(filters),
    queryFn: async () => {
      const response = await invoiceApi.getDashboardCharts(filters);
      return response.data.data;
    },
  });
};

export const useTopCompanies = (filters?: Record<string, unknown>) => {
  return useQuery({
    queryKey: INVOICE_KEYS.topCompanies(filters),
    queryFn: async () => {
      const response = await invoiceApi.getTopCompanies(filters);
      return response.data.data;
    },
  });
};

export const useUpdateInvoiceStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateInvoiceStatusPayload }) =>
      invoiceApi.updateStatus(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Invoice status updated successfully");
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.stats() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update invoice status");
    },
  });
};

export const useGenerateCreditNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GenerateNotePayload }) =>
      invoiceApi.generateCreditNote(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Credit note generated successfully");
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.stats() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate credit note");
    },
  });
};

export const useGenerateDebitNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: GenerateNotePayload }) =>
      invoiceApi.generateDebitNote(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Debit note generated successfully");
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.stats() });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to generate debit note");
    },
  });
};

export const useEmailInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { to: string; cc?: string; message?: string } }) =>
      invoiceApi.resendEmail(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Invoice email sent successfully");
      queryClient.invalidateQueries({ queryKey: INVOICE_KEYS.detail(variables.id) });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to send invoice email");
    },
  });
};

export const useCreditNotes = (invoiceId: string) => {
  return useQuery({
    queryKey: INVOICE_KEYS.creditNotes(invoiceId),
    queryFn: async () => {
      if (!invoiceId) return [];
      const response = await invoiceApi.getCreditNotes(invoiceId);
      return response.data.data;
    },
    enabled: !!invoiceId,
  });
};

export const useDebitNotes = (invoiceId: string) => {
  return useQuery({
    queryKey: INVOICE_KEYS.debitNotes(invoiceId),
    queryFn: async () => {
      if (!invoiceId) return [];
      const response = await invoiceApi.getDebitNotes(invoiceId);
      return response.data.data;
    },
    enabled: !!invoiceId,
  });
};
