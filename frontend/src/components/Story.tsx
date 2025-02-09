import { useArticleTheme } from '@/components/article-theme-provider';
import { useWebSocket } from '@/hooks/useWebsocket';
import { BOOKS } from '@/lib/data';
import { markdownToHtml } from '@/lib/markdown';
import { applyTheme } from '@/lib/theme';
import { ArrowLeft } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = BOOKS.find((book) => book.id === id);
  const { theme } = useArticleTheme();

  const onMessage = (message: string) => {
    if (message === 'GESTURE_UP') {
      window.scrollBy({
        top: -400,
        behavior: 'smooth',
      });
    } else if (message === 'GESTURE_FIST') {
      window.scrollBy({
        top: 400,
        behavior: 'smooth',
      });
    }
  };

  useWebSocket({ onMessage });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className='w-full flex justify-center relative'>
      <div className='fixed top-0 left-20 right-0 h-28 bg-gradient-to-b from-background to-transparent pointer-events-none z-30' />
      <div className='flex items-start gap-4 -translate-x-12 my-20'>
        <button
          onClick={() => navigate('/')}
          className='p-2 hover:bg-muted rounded-full hover:-translate-x-2 transition-all cursor-pointer'
        >
          <ArrowLeft className='w-6 h-6' />
        </button>
        <div
          className='prose dark:prose-invert w-[800px] prose-headings:font-serif prose-headings:tracking-wide'
          dangerouslySetInnerHTML={{
            __html: markdownToHtml(
              book?.markdown ??
                `# ${book?.title}\n\n${
                  book?.author
                }\n\n${'Book content not found'}`
            ),
          }}
        />
      </div>
      <div className='fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent pointer-events-none z-30' />
    </div>
  );
}
