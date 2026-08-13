import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionApi, type QuestionQueryParams } from '../api/question.api';
import { toast } from '@/hooks/use-toast';
import { AxiosError } from 'axios';
import type { Question } from '../types';

export const questionKeys = {
  all: ['questions'] as const,
  lists: () => [...questionKeys.all, 'list'] as const,
  list: (filters: string) => [...questionKeys.lists(), { filters }] as const,
  details: () => [...questionKeys.all, 'detail'] as const,
  detail: (id: string) => [...questionKeys.details(), id] as const,
  statistics: () => [...questionKeys.all, 'statistics'] as const,
};

export const useQuestionList = (params?: QuestionQueryParams) => {
  return useQuery({
    queryKey: questionKeys.list(JSON.stringify(params)),
    queryFn: () => questionApi.getAll(params),
  });
};

export const useQuestionDetail = (id: string) => {
  return useQuery({
    queryKey: questionKeys.detail(id),
    queryFn: () => questionApi.getById(id),
    enabled: !!id,
  });
};

export const useQuestionStatistics = () => {
  return useQuery({
    queryKey: questionKeys.statistics(),
    queryFn: () => questionApi.getStatistics(),
  });
};

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => questionApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      toast({ title: 'Question Created', description: 'Question added to the bank successfully.', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to create question';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useUpdateQuestion = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => questionApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: questionKeys.detail(id) });
      toast({ title: 'Question Updated', description: 'Question updated successfully.', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to update question';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => questionApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: questionKeys.lists() });
      toast({ title: 'Question Deleted', description: 'Question removed from the bank.', variant: 'success' });
    },
    onError: (error: unknown) => {
      const msg = error instanceof AxiosError ? error.response?.data?.message : 'Failed to delete question';
      toast({ title: 'Error', description: String(msg), variant: 'destructive' });
    },
  });
};

/** Extracts a Question[] array from the varied backend response shapes */
export function extractQuestions(data: ReturnType<typeof useQuestionList>['data']): Question[] {
  if (!data) return [];
  const inner = data.data;
  if (Array.isArray(inner)) return inner as Question[];
  if (inner && 'questions' in inner && Array.isArray(inner.questions)) return inner.questions;
  if (inner && 'items' in inner && Array.isArray(inner.items)) return inner.items;
  return [];
}

export function extractQuestionsTotal(data: ReturnType<typeof useQuestionList>['data']): number {
  if (!data) return 0;
  const inner = data.data;
  if (Array.isArray(inner)) return inner.length;
  if (inner && !Array.isArray(inner) && 'total' in inner) return inner.total || 0;
  return 0;
}
