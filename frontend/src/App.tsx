import { useArticleTheme } from '@/components/article-theme-provider';
import Library from '@/components/Library';
import Story from '@/components/Story';
import { BrowserRouter, Route, Routes } from 'react-router';

function App() {
  const { theme, setTheme } = useArticleTheme();

  return (
    <BrowserRouter>
      <div className='w-full flex justify-center'>
        <Routes>
          <Route path='/' element={<Library />} />
          <Route path='/story/:id' element={<Story />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
