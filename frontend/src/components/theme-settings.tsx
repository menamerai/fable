import { Button, buttonVariants } from '@/components/ui/button';

import { useArticleTheme } from '@/components/article-theme-provider';
import { useTheme } from '@/components/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Paintbrush } from 'lucide-react';

const ThemeSettings = () => {
  const { theme, setTheme } = useArticleTheme();
  const { theme: colourTheme, setTheme: setColourTheme } = useTheme();

  const setHeadingFontFamily = (fontFamily: string) => {
    setTheme({
      heading: { fontFamily },
    });
  };

  const setParagraphFontFamily = (fontFamily: string) => {
    setTheme({
      paragraph: { fontFamily },
    });
  };

  const setHeadingFontSize = (fontSize: number) => {
    setTheme({
      heading: { fontSize: `${fontSize}px` },
    });
  };

  const setParagraphFontSize = (fontSize: number) => {
    setTheme({
      paragraph: { fontSize: `${fontSize}px` },
    });
  };

  const setHeadingLineHeight = (lineHeight: number) => {
    setTheme({
      heading: { lineHeight: `${lineHeight}` },
    });
  };

  const setParagraphLineHeight = (lineHeight: number) => {
    setTheme({
      paragraph: { lineHeight: `${lineHeight}` },
    });
  };

  const FontFamilySelector = ({
    currentFont,
    setFontFamily,
  }: {
    currentFont: string | undefined;
    setFontFamily: (font: string) => void;
  }) => (
    <div className='grid grid-cols-2 gap-2 mb-6'>
      <Button
        variant={currentFont === 'sans-serif' ? 'outline' : 'secondary'}
        className={cn(
          'h-20 cursor-pointer',
          currentFont === 'sans-serif' &&
            'border-2 border-blue-400 bg-background hover:bg-background'
        )}
        onClick={() => setFontFamily('sans-serif')}
      >
        <div className='flex flex-col items-center'>
          <span className='text-sm'>Sans</span>
          <span className='text-2xl'>Aa</span>
        </div>
      </Button>
      <Button
        variant={currentFont === 'serif' ? 'outline' : 'secondary'}
        className={cn(
          'h-20 cursor-pointer',
          currentFont === 'serif' &&
            'border-2 border-blue-400 bg-background hover:bg-background'
        )}
        onClick={() => setFontFamily('serif')}
      >
        <div className='flex flex-col items-center'>
          <span className='text-sm font-serif'>Serif</span>
          <span className='text-2xl font-serif'>Aa</span>
        </div>
      </Button>
    </div>
  );

  const TextControls = ({
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
  }: {
    fontSize: string | undefined;
    setFontSize: (size: number) => void;
    lineHeight: string | undefined;
    setLineHeight: (height: number) => void;
  }) => {
    const lineHeightToSliderValue = (heightString: string | undefined) => {
      const height = parseFloat(heightString || '1.5');
      if (height === 0.8) return 0;
      if (height === 1) return 1;
      if (height === 1.25) return 2;
      if (height === 1.5) return 3;
      if (height === 2) return 4;
      return 5;
    };

    const onLineHeightSliderChange = (value: number) => {
      if (value === 0) {
        setLineHeight(0.8);
      } else if (value === 1) {
        setLineHeight(1);
      } else if (value === 2) {
        setLineHeight(1.25);
      } else if (value === 3) {
        setLineHeight(1.5);
      } else if (value === 4) {
        setLineHeight(2);
      } else if (value === 5) {
        setLineHeight(2.5);
      }
    };

    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <span
            className='text-lg cursor-pointer'
            onClick={() => setFontSize(parseInt(fontSize || '16') - 1)}
          >
            A
          </span>
          <Slider
            defaultValue={[parseInt(fontSize || '16')]}
            max={32}
            min={10}
            className='w-40 mx-4 cursor-pointer'
            onValueChange={(value) => setFontSize(value[0])}
          />
          <span
            className='text-2xl'
            onClick={() => setFontSize(parseInt(fontSize || '16') + 1)}
          >
            A
          </span>
        </div>

        <div className='flex items-center justify-between'>
          <div
            className='w-4 h-4 flex flex-col justify-center gap-0.5 cursor-pointer'
            onClick={() =>
              onLineHeightSliderChange(
                Math.max(0, lineHeightToSliderValue(lineHeight) - 1)
              )
            }
          >
            <div className='h-0.5 bg-foreground w-full' />
            <div className='h-0.5 bg-foreground w-full' />
            <div className='h-0.5 bg-foreground w-full' />
          </div>
          <Slider
            defaultValue={[lineHeightToSliderValue(lineHeight || '1.5')]}
            max={5}
            min={0}
            step={1}
            className='w-40 mx-4'
            onValueChange={(value) => onLineHeightSliderChange(value[0])}
          />
          <div
            className='w-4 h-4 flex flex-col justify-between cursor-pointer'
            onClick={() =>
              onLineHeightSliderChange(
                Math.min(5, 1 + lineHeightToSliderValue(lineHeight))
              )
            }
          >
            <div className='h-0.5 bg-foreground w-full' />
            <div className='h-0.5 bg-foreground w-full' />
            <div className='h-0.5 bg-foreground w-full' />
          </div>
        </div>
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(buttonVariants({ variant: 'outline' }), 'w-14 h-14')}
      >
        <Paintbrush className='!w-5 !h-5' />
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-64 p-4'>
        <Tabs defaultValue='content' className='w-full'>
          <TabsList className='grid w-full grid-cols-2 mb-2'>
            <TabsTrigger value='content' className='text-sm font-medium'>
              Content
            </TabsTrigger>
            <TabsTrigger value='headings' className='text-sm font-medium'>
              Headings
            </TabsTrigger>
          </TabsList>

          <TabsContent value='content'>
            <FontFamilySelector
              currentFont={theme.paragraph?.fontFamily}
              setFontFamily={setParagraphFontFamily}
            />
            <TextControls
              fontSize={theme.paragraph?.fontSize}
              setFontSize={setParagraphFontSize}
              lineHeight={theme.paragraph?.lineHeight}
              setLineHeight={setParagraphLineHeight}
            />
          </TabsContent>

          <TabsContent value='headings'>
            <FontFamilySelector
              currentFont={theme.heading?.fontFamily}
              setFontFamily={setHeadingFontFamily}
            />
            <TextControls
              fontSize={theme.heading?.fontSize}
              setFontSize={setHeadingFontSize}
              lineHeight={theme.heading?.lineHeight}
              setLineHeight={setHeadingLineHeight}
            />
          </TabsContent>
        </Tabs>

        {/* Color Selection */}
        <div className='flex gap-4 mb-6 justify-center mt-6'>
          <Button
            variant={colourTheme === 'light' ? 'outline' : 'secondary'}
            className={cn(
              'w-12 h-12 rounded-full bg-white hover:bg-white/80',
              colourTheme === 'light' && 'border-2 border-blue-400'
            )}
            onClick={() => setColourTheme('light')}
          ></Button>

          <Button
            variant={colourTheme === 'dark' ? 'outline' : 'secondary'}
            className={cn(
              'w-12 h-12 rounded-full bg-black hover:bg-black/80',
              colourTheme === 'dark' && 'border-2 border-blue-400'
            )}
            onClick={() => setColourTheme('dark')}
          ></Button>
        </div>

        {/* Max Width Slider */}
        <div className='flex items-center justify-between'>
          <div
            className='w-4 h-4 flex flex-col justify-between items-center cursor-pointer'
            onClick={() =>
              setTheme({
                maxWidth: Math.max((theme.maxWidth || 65) - 5, 50),
              })
            }
          >
            <div className='h-0.5 bg-foreground w-2' />
            <div className='h-0.5 bg-foreground w-2' />
            <div className='h-0.5 bg-foreground w-2' />
          </div>
          <Slider
            defaultValue={[theme.maxWidth || 65]}
            value={[theme.maxWidth || 65]}
            max={120}
            min={50}
            step={5}
            className='w-40 mx-4'
            onValueChange={(value) => setTheme({ maxWidth: value[0] })}
          />
          <div
            className='w-4 h-4 flex flex-col justify-between cursor-pointer'
            onClick={() =>
              setTheme({
                maxWidth: Math.min((theme.maxWidth || 65) + 5, 120),
              })
            }
          >
            <div className='h-0.5 bg-foreground w-full' />
            <div className='h-0.5 bg-foreground w-full' />
            <div className='h-0.5 bg-foreground w-full' />
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSettings;
