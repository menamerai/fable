import Library from '@/components/Library';
import Story from '@/components/Story';
import { Route, Routes } from 'react-router';

function App() {
  return (
    <div className='w-full flex justify-center'>
      <Routes>
        <Route path='/' element={<Library />} />
        <Route path='/story/:id' element={<Story />} />
      </Routes>
    </div>
  );
}

export default App;
