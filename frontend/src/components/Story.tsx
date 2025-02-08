import { SAMPLE_MD_STORY } from '@/lib/data';
import { markdownToHtml } from '@/lib/markdown';

export default function Story() {
  return (
    <div
      className='prose dark:prose-invert'
      dangerouslySetInnerHTML={{ __html: markdownToHtml(SAMPLE_MD_STORY) }}
    />
  );
}
