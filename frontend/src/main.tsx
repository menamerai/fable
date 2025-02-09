import { ArticleThemeProvider } from '@/components/article-theme-provider.tsx';
import { ModeToggle } from '@/components/mode-toggle.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import ThemeSettings from '@/components/theme-settings.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from '@/App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArticleThemeProvider>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <div className='absolute top-4 left-4 flex gap-2'>
          <ThemeSettings />
          <ModeToggle />
        </div>
        <App />
      </ThemeProvider>
    </ArticleThemeProvider>
  </StrictMode>
);
