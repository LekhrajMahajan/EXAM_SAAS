import { QueryClient } from '@tanstack/react-query';
import { queryConfig } from '../config/query.config';

export const queryClient = new QueryClient(queryConfig);
