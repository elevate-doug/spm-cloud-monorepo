import { ReactElement, ReactNode } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../components/toast';
import { ThemeProvider } from '../components/theme';

interface WrapperProps {
  children: ReactNode;
}

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  queryClient?: QueryClient;
}

function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

function AllTheProviders({ children }: WrapperProps) {
  const queryClient = createTestQueryClient();

  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function createWrapper(options?: CustomRenderOptions) {
  const queryClient = options?.queryClient ?? createTestQueryClient();

  const Wrapper = ({ children }: WrapperProps) => {
    const Router = options?.initialRoute ? MemoryRouter : BrowserRouter;
    const routerProps = options?.initialRoute
      ? { initialEntries: [options.initialRoute] }
      : {};

    return (
      <Router {...routerProps}>
        <ThemeProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ToastProvider>
        </ThemeProvider>
      </Router>
    );
  };

  return Wrapper;
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return render(ui, {
    wrapper: createWrapper(options),
    ...options,
  });
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { customRender as render, createTestQueryClient };
