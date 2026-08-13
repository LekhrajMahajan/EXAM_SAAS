import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectApi, type SubjectListParams } from '../api/subject.api';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';

export const subjectKeys = {
  all: ['subjects'] as const,
  lists: () => [...subjectKeys.all, 'list'] as const,
  list: (filters: string) => [...subjectKeys.lists(), { filters }] as const,
  details: () => [...subjectKeys.all, 'detail'] as const,
  detail: (id: string) => [...subjectKeys.details(), id] as const,
};

export const useSubjectList = (params?: SubjectListParams) => {
  return useQuery({
    queryKey: subjectKeys.list(JSON.stringify(params || {})),
    queryFn: () => subjectApi.getAll(params),
  });
};

export const useSubjectDetail = (id: string) => {
  return useQuery({
    queryKey: subjectKeys.detail(id),
    queryFn: () => subjectApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => subjectApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      toast({ title: 'Success', description: 'Subject created successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to create subject';
      toast({ title: 'Error', description: String(msg || 'Failed to create subject'), variant: 'destructive' });
    },
  });
};

export const useUpdateSubject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => subjectApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: subjectKeys.detail(id) });
      toast({ title: 'Success', description: 'Subject updated successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to update subject';
      toast({ title: 'Error', description: String(msg || 'Failed to update subject'), variant: 'destructive' });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => subjectApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
      toast({ title: 'Deleted', description: 'Subject deleted successfully', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to delete subject';
      toast({ title: 'Error', description: String(msg || 'Failed to delete subject'), variant: 'destructive' });
    },
  });
};
