import { ModeToggle } from '@/components/mode-toggle.tsx';
import Story from '@/components/Story.tsx';
import { ThemeProvider } from '@/components/theme-provider.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='absolute top-4 left-4'>
        <ModeToggle />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />} />
          <Route path='/story/:id' element={<Story />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
);
