import { useArticleTheme } from '@/components/article-theme-provider';
import { useWebSocket } from '@/hooks/useWebsocket';
import { BOOKS } from '@/lib/data';
import { markdownToHtml } from '@/lib/markdown';
import { applyTheme } from '@/lib/theme';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();
  const book = BOOKS.find((book) => book.id === id);

  const { theme } = useArticleTheme();
  const html = markdownToHtml(
    book?.markdown ??
      `# ${book?.title}\n\n${book?.author}\n\n${'Book content not found'}`
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Process the HTML to wrap specific sentences with span tags
    const processHtml = (htmlContent: string) => {
      // Example sentences to match - you would customize this based on your needs
      const sentences = [
        'The artist',
        'dislike of Realism',
        'The studio was filled with',
        'long tussore-silk',
        'What odd chaps you painters are!',
        'Dorian Gray? Is that his name?'
      ];

      let processedHtml = htmlContent;
      sentences.forEach((sentence, index) => {
        const wrappedSentence = `<span data-highlight-id="${index}" class="highlight-target">${sentence}</span>`;
        processedHtml = processedHtml.replace(sentence, wrappedSentence);
      });

      return processedHtml;
    };

    const setupObservers = () => {
      if (!containerRef.current) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add glow effect class
              entry.target.classList.add('highlight-glow');
              entry.target.classList.add('highlight-transition');

              // Trigger custom event
              const highlightId = (entry.target as HTMLElement).dataset
                .highlightId;
              const event = new CustomEvent('highlightTriggered', {
                detail: { id: highlightId },
              });
              window.dispatchEvent(event);

              // // Optional: Remove observer after triggering
              // observer.unobserve(entry.target);
            } else {
              entry.target.classList.remove('highlight-glow');
              entry.target.classList.remove('highlight-transition');
            }
          });
        },
        {
          threshold: 0.5, // Trigger when element is 50% visible
          rootMargin: '-80px 0px -250px 0px',
        }
      );

      // Observe all highlight targets
      const targets =
        containerRef.current.querySelectorAll('.highlight-target');
      targets.forEach((target) => observer.observe(target));

      return observer;
    };

    // Set initial HTML content
    containerRef.current.innerHTML = processHtml(html);

    // Setup observers
    const observer = setupObservers();

    // Cleanup
    return () => observer?.disconnect();
  }, [html]);

  const onMessage = (message: string) => {
    const viewportHeight = window.innerHeight;
    const scrollAmount = viewportHeight * 0.8; // Scroll 80% of viewport
    const maxScroll = document.documentElement.scrollHeight - viewportHeight;

    if (message === 'GESTURE_UP') {
      const newPos = window.scrollY - scrollAmount;
      window.scrollTo({
        top: newPos >= 0 ? newPos : 0,
        behavior: 'smooth',
      });
    } else if (message === 'GESTURE_FIST') {
      const newPos = window.scrollY + scrollAmount;
      window.scrollTo({
        top: newPos <= maxScroll ? newPos : maxScroll,
        behavior: 'smooth',
      });
    }
  };

  useWebSocket({ onMessage });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className='w-full flex justify-center'>
      <div className='fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10' />
      <div className='flex items-start gap-4 -translate-x-12 my-20'>
        <button
          onClick={() => navigate('/')}
          className='p-2 hover:bg-muted rounded-full hover:-translate-x-2 transition-all cursor-pointer'
        >
          <ArrowLeft className='w-6 h-6' />
        </button>
        <div
          className='prose dark:prose-invert w-[800px] prose-headings:font-serif prose-headings:tracking-wide'
          ref={containerRef}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
      <div className='fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-30' />
    </div>
  );
}
