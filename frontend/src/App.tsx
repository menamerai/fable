import Library from '@/components/Library';
import { ModeToggle } from '@/components/mode-toggle';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='absolute top-4 left-4'>
        <ModeToggle />
      </div>
      <div className='w-full flex justify-center'>
        <Library />
      </div>
    </ThemeProvider>
  );
}

export default App;
