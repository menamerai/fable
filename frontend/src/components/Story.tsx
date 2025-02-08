import { SAMPLE_MD_STORY } from '@/lib/data';
import { markdownToHtml } from '@/lib/markdown';

export default function Story() {
  return (
    <div
      className='prose mt-12'
      dangerouslySetInnerHTML={{ __html: markdownToHtml(SAMPLE_MD_STORY) }}
    />
  );
}
