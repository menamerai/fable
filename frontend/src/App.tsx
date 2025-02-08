import { ModeToggle } from '@/components/mode-toggle';
import Story from '@/components/Story';
import { ThemeProvider } from '@/components/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='absolute top-4 right-4'>
        <ModeToggle />
      </div>
      <div className='w-full flex justify-center pt-16 pb-24'>
        <Story />
      </div>
    </ThemeProvider>
  );
}

export default App;
