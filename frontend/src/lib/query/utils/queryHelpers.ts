import { queryClient } from '../client/queryClient';

export const prefetchEntity = async (queryKey: any[], queryFn: () => Promise<any>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
};

export const invalidateEntity = (queryKey: any[]) => {
  return queryClient.invalidateQueries({
    queryKey,
  });
};

export const resetEntityQueries = (queryKey: any[]) => {
  return queryClient.resetQueries({
    queryKey,
  });
};

export const setOptimisticData = (queryKey: any[], updater: (oldData: any) => any) => {
  queryClient.setQueryData(queryKey, updater);
};
