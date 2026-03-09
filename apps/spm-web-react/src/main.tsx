import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastProvider } from './components/toast'
import { ThemeProvider } from './components/theme'
import { ConnectionStatusProvider } from './components/connection-status'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <QueryClientProvider client={queryClient}>
            {/*<ReactQueryDevtools />*/}
            <ConnectionStatusProvider>
              <App />
            </ConnectionStatusProvider>
          </QueryClientProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
