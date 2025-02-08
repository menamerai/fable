import { BOOKS } from '@/lib/data';
import { markdownToHtml } from '@/lib/markdown';
import { useParams } from 'react-router';

export default function Story() {
  const { id } = useParams();
  const book = BOOKS.find((book) => book.id === id);

  return (
    <div className='w-full flex justify-center py-16'>
      <div
        className='prose dark:prose-invert'
        dangerouslySetInnerHTML={{
          __html: markdownToHtml(book?.markdown ?? 'Book not found'),
        }}
      />
    </div>
  );
}
