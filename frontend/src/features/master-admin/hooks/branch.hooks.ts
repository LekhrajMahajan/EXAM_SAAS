import { useQuery } from '@tanstack/react-query';
import { branchApi, type BranchSearchParams } from '../api/branch.api';

export const branchKeys = {
  all: ['branches'] as const,
  lists: () => [...branchKeys.all, 'list'] as const,
  list: (params: BranchSearchParams) => [...branchKeys.lists(), params] as const,
};

export const useBranches = (params: BranchSearchParams = {}) => {
  return useQuery({
    queryKey: branchKeys.list(params),
    queryFn: () => branchApi.getBranches(params),
    enabled: true, // Let the component decide if it wants to conditionally enable based on companyId
  });
};
