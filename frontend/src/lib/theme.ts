export function applyTheme(theme: PartialTheme) {
  const headingElements = document.querySelectorAll(
    '.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6'
  );
  const paragraphElements = document.querySelectorAll('.prose p');

  const { heading, paragraph, backgroundColor } = theme;
  if (heading) {
    headingElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        if (heading.fontSize) {
          element.style.fontSize = heading.fontSize;
        }
        if (heading.fontFamily) {
          element.style.fontFamily = heading.fontFamily;
        }
        if (heading.lineHeight) {
          element.style.lineHeight = `${heading.lineHeight}em`;
        }
        if (heading.fontWeight) {
          element.style.fontWeight = heading.fontWeight;
        }
        if (heading.color) {
          element.style.color = heading.color;
        }
      }
    });
  }
  if (paragraph) {
    paragraphElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        if (paragraph.fontSize) {
          element.style.fontSize = paragraph.fontSize;
        }
        if (paragraph.fontFamily) {
          element.style.fontFamily = paragraph.fontFamily;
        }
        if (paragraph.lineHeight) {
          element.style.lineHeight = `${paragraph.lineHeight}em`;
        }
        if (paragraph.fontWeight) {
          element.style.fontWeight = paragraph.fontWeight;
        }
        if (paragraph.color) {
          element.style.color = paragraph.color;
        }
      }
    });
  }

  if (backgroundColor) {
    const root = document.documentElement;
    root.style.backgroundColor = backgroundColor;
  }

  const proseElement = document.querySelector('.prose');
  if (proseElement) {
    if (proseElement instanceof HTMLElement) {
      proseElement.style.maxWidth = `${theme.maxWidth}ch`;
    }
  }
}

type ElementThemeProperties = {
  fontSize: string;
  fontFamily: string;
  lineHeight: string;
  fontWeight: string;
  color: string;
};

export type Theme = {
  heading: ElementThemeProperties;
  paragraph: ElementThemeProperties;
  backgroundColor: string;
  maxWidth: number;
};

export type PartialTheme = {
  heading?: Partial<ElementThemeProperties>;
  paragraph?: Partial<ElementThemeProperties>;
  backgroundColor?: string;
  maxWidth?: number;
};
