import { useArticleTheme } from '@/components/article-theme-provider';
import { SentenceAudio } from '@/components/audio';
import { useMemoryDb } from '@/hooks/useMemoryDb';
import { defaultSentences, useSentences } from '@/hooks/useSentences';
import { useStreamingText } from '@/hooks/useStreamingText';
import { useWebSocket } from '@/hooks/useWebsocket';
import {
  hasAudioPathDataset,
  playAudioById,
  processAudioSentences,
} from '@/lib/audio';
import { markdownToHtml } from '@/lib/markdown';
import { applyTheme } from '@/lib/theme';
import { cn } from '@/lib/utils';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

export default function Story() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { books } = useMemoryDb();
  const book = books.find((book) => book.id === id);

  const { data: sentences = defaultSentences } = useSentences(
    book?.id ?? ''
  );

  const { theme } = useArticleTheme();
  const html = markdownToHtml(
    book?.markdown ??
      `# ${book?.title}\n\n${book?.author}\n\n${'Book content not found'}`
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (!sentences.start) return;

    const processHtml = (htmlContent: string) => {
      const processedHtml = htmlContent;
      return processAudioSentences(processedHtml, sentences);
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
            } else {
              entry.target.classList.remove('highlight-glow');
              entry.target.classList.remove('highlight-transition');
            }

            if (hasAudioPathDataset(entry.target)) {
              if (entry.isIntersecting) {
                playAudioById(
                  (entry.target as HTMLElement).dataset.audioPath ?? 'no-id',
                  'fade-in'
                );
              } else {
                playAudioById(
                  (entry.target as HTMLElement).dataset.audioPath ?? 'no-id',
                  'fade-out'
                );
              }
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
  }, [html, sentences]);

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

  const { start: startStreaming, displayText } = useStreamingText();

  const [selectedText, setSelectedText] = useState('');
  const [showDyslexiaText, setShowDyslexiaText] = useState(false);
  const [dyslexiaTextPosition, setDyslexiaTextPosition] = useState({
    top: 0,
    left: 0,
  });

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') {
      setShowDyslexiaText(false);
      return;
    }

    const text = selection.toString();
    setSelectedText(text);
    setShowDyslexiaText(true);
    setDyslexiaTextPosition({
      top: selection.getRangeAt(0).getBoundingClientRect().bottom + 20,
      left: selection.getRangeAt(0).getBoundingClientRect().left,
    });
    startStreaming(text);
  };

  return (
    <div className='w-full flex justify-center'>
      <div className='fixed top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10' />

      <SentenceAudio sentences={sentences} />

      { (
        <div
          className={cn(
            'fixed bg-background border rounded-lg p-4 shadow-lg z-40 max-w-2xl',
            showDyslexiaText ? 'opacity-100' : 'opacity-0'
          )}
          style={{
            top: dyslexiaTextPosition.top,
            left: dyslexiaTextPosition.left,
          }}
        >
          <div className='flex flex-col items-start gap-2'>
            <div className='flex items-center justify-start gap-2'>
              <Lightbulb className='w-5 h-5 text-cyan-500' strokeWidth={2} />
              <h1 className='text-lg font-bold'>Dyslexia Help</h1>
            </div>
            <div className='text-lg'>{displayText}</div>
          </div>
        </div>
      )}

      <div className='flex items-start gap-4 -translate-x-12 my-20'>
        <button
          onClick={() => navigate('/')}
          className='p-2 hover:bg-muted rounded-full hover:-translate-x-2 transition-all cursor-pointer'
        >
          <ArrowLeft className='w-6 h-6' />
        </button>

        <div
          className='prose dark:prose-invert w-[800px] prose-headings:font-serif prose-headings:tracking-wide prose-p:text-[24px]'
          ref={containerRef}
          onMouseUp={handleTextSelection}
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      </div>
      <div className='fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-30' />
    </div>
  );
}
