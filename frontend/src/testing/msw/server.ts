import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW Node server for Vitest tests
export const server = setupServer(...handlers);
