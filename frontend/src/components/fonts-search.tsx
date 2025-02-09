import { useArticleTheme } from '@/components/article-theme-provider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SYSTEM_FONTS } from '@/lib/system-fonts';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function FontsSearch() {
  const [search, setSearch] = useState('');
  const { theme, setTheme } = useArticleTheme();

  const fontNames = Object.keys(SYSTEM_FONTS);
  const filteredFonts = fontNames.filter((name) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  function onFontSelect(fontName: keyof typeof SYSTEM_FONTS) {
    setTheme({
      heading: {
        fontFamily: SYSTEM_FONTS[fontName],
      },
      paragraph: {
        fontFamily: SYSTEM_FONTS[fontName],
      },
    });
  }

  return (
    <div className='w-full space-y-2'>
      <Input
        type='text'
        placeholder='Search fonts...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='w-full border-none hover:bg-muted focus:bg-muted focus-visible:ring-0 focus-visible:outline-none transition-all md:text-base'
        style={{ fontFamily: theme.paragraph?.fontFamily }}
      />

      <div className='relative'>
        <ScrollArea className='space-y-2 h-56 overflow-y-auto pr-2'>
          <ul className='space-y-2 h-full'>
            {filteredFonts.map((fontName, i) => (
              <li
                key={fontName}
                style={{ fontFamily: SYSTEM_FONTS[fontName] }}
                className={cn(
                  'ml-1 p-2 hover:bg-secondary rounded-md cursor-pointer',
                  i === filteredFonts.length - 1 && 'mb-8'
                )}
                onClick={() => onFontSelect(fontName)}
              >
                {fontName}
              </li>
            ))}
          </ul>
        </ScrollArea>
        <div className='absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-background to-transparent pointer-events-none' />
      </div>
    </div>
  );
}

export default FontsSearch;
