import App from '@/App';
import { ArticleThemeProvider } from '@/components/article-theme-provider.tsx';
import { OnboardProvider } from '@/components/onboard-provider';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import ThemeSettings from '@/components/theme-settings.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ArticleThemeProvider>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <BrowserRouter>
            <OnboardProvider>
              <div className='fixed top-4 left-4 flex gap-2'>
                <ThemeSettings />
              </div>
              <App />
            </OnboardProvider>
          </BrowserRouter>
        </ThemeProvider>
      </ArticleThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
