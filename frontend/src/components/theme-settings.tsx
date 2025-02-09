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
  }) => (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <span className='text-lg'>A</span>
        <Slider
          defaultValue={[parseInt(fontSize || '16')]}
          max={32}
          min={10}
          className='w-40 mx-4'
          onValueChange={(value) => setFontSize(value[0])}
        />
        <span className='text-2xl'>A</span>
      </div>

      <div className='flex items-center justify-between'>
        <div className='w-4 h-4 flex flex-col justify-center gap-0.5'>
          <div className='h-0.5 bg-foreground w-full' />
          <div className='h-0.5 bg-foreground w-full' />
          <div className='h-0.5 bg-foreground w-full' />
        </div>
        <Slider
          defaultValue={[
            parseFloat(lineHeight || '1.5') === 0.8
              ? 0
              : parseFloat(lineHeight || '1.5') === 1
              ? 1
              : parseFloat(lineHeight || '1.5') === 1.25
              ? 2
              : parseFloat(lineHeight || '1.5') === 1.5
              ? 3
              : 4,
          ]}
          max={4}
          min={0}
          step={1}
          className='w-40 mx-4'
          onValueChange={(value) => {
            if (value[0] === 0) {
              setLineHeight(0.8);
            } else if (value[0] === 1) {
              setLineHeight(1);
            } else if (value[0] === 2) {
              setLineHeight(1.25);
            } else if (value[0] === 3) {
              setLineHeight(1.5);
            } else if (value[0] === 4) {
              setLineHeight(2);
            }
          }}
        />
        <div className='w-4 h-4 flex flex-col justify-between'>
          <div className='h-0.5 bg-foreground w-full' />
          <div className='h-0.5 bg-foreground w-full' />
          <div className='h-0.5 bg-foreground w-full' />
        </div>
      </div>
    </div>
  );

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

          {/* {Object.keys(colorSchemes).map((color, index) => (
            <Button
              key={index}
              variant={
                theme.backgroundColor === color ? 'outline' : 'secondary'
              }
              className={cn(
                'w-8 h-8 rounded-full border-2 border-transparent',
                theme.backgroundColor === color && 'border-blue-400'
              )}
              style={{
                backgroundColor: colorSchemes[color as ColorScheme].background,
              }}
              onClick={() =>
                setTheme({
                  backgroundColor: color as ColorScheme,
                })
              }
            />
          ))} */}
        </div>

        {/* Max Width Slider */}
        <div className='flex items-center justify-between'>
          <div className='w-4 h-4 flex flex-col justify-between items-center'>
            <div className='h-0.5 bg-foreground w-2' />
            <div className='h-0.5 bg-foreground w-2' />
            <div className='h-0.5 bg-foreground w-2' />
          </div>
          <Slider
            defaultValue={[theme.maxWidth || 65]}
            max={120}
            min={50}
            step={5}
            className='w-40 mx-4'
            onValueChange={(value) => setTheme({ maxWidth: value[0] })}
          />
          <div className='w-4 h-4 flex flex-col justify-between'>
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
