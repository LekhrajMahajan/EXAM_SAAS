import { useState, useCallback } from 'react';

type ApiFunction<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

export function useApi<TArgs extends any[], TResult>(apiFunction: ApiFunction<TArgs, TResult>) {
  const [data, setData] = useState<TResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: TArgs) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  return {
    data,
    isLoading,
    error,
    execute,
    setData
  };
}

export function useMutation<TArgs extends any[], TResult>(apiFunction: ApiFunction<TArgs, TResult>) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (...args: TArgs) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [apiFunction]);

  return {
    mutate,
    isLoading,
    error,
  };
}
