import { useArticleTheme } from '@/components/article-theme-provider';
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

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className='w-full flex justify-center py-16 '>
      <div className='flex items-start gap-4 -translate-x-12'>
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
    </div>
  );
}
