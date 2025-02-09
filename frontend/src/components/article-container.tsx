import { defaultTheme, Theme } from '@/lib/theme';

export const ArticleContainer = ({
  theme = defaultTheme,
  children,
}: {
  theme?: Theme;
  children: React.ReactNode;
}) => {
  const themeVariables = {
    '--heading-font-family': theme.heading.fontFamily,
    '--heading-color': theme.heading.color,
    '--heading-line-height': theme.heading.lineHeight,
    '--heading-letter-spacing': theme.heading.letterSpacing,
    '--heading-font-size': theme.heading.fontSize,
    '--paragraph-font-family': theme.paragraph.fontFamily,
    '--paragraph-color': theme.paragraph.color,
    '--paragraph-line-height': theme.paragraph.lineHeight,
    '--paragraph-letter-spacing': theme.paragraph.letterSpacing,
    '--paragraph-font-size': theme.paragraph.fontSize,
  } as React.CSSProperties;

  return (
    <article className='theme' style={themeVariables}>
      {children}
    </article>
  );
};
