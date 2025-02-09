import App from '@/App';
import { ArticleThemeProvider } from '@/components/article-theme-provider.tsx';
import { OnboardProvider } from '@/components/onboard-provider';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import ThemeSettings from '@/components/theme-settings.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArticleThemeProvider>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <OnboardProvider>
          <div className='fixed top-4 left-4 flex gap-2'>
            <ThemeSettings />
          </div>
          <App />
        </OnboardProvider>
      </ThemeProvider>
    </ArticleThemeProvider>
  </StrictMode>
);
