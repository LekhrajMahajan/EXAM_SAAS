import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Setup MSW Browser worker for local development without backend
export const worker = setupWorker(...handlers);
