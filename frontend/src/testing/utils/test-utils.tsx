import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ThemeProvider } from '@/features/theme/ThemeProvider';

/**
 * Custom render function that wraps components with necessary providers (Router, Query, Theme, Auth, etc.)
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  // const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <BrowserRouter>
      {/* <QueryClientProvider client={queryClient}> */}
        {children}
      {/* </QueryClientProvider> */}
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
