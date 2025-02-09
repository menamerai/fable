import { PartialTheme } from '@/lib/theme';
import { createContext, useContext, useEffect, useState } from 'react';

// Default theme values
const DEFAULT_THEME: PartialTheme = {};

const STORAGE_KEY = 'app-theme';

// Get theme from localStorage
const getStoredTheme = (): PartialTheme => {
  try {
    const theme = localStorage.getItem(STORAGE_KEY);
    return theme ? JSON.parse(theme) : DEFAULT_THEME;
  } catch (error) {
    console.error('Error reading theme from localStorage:', error);
    return DEFAULT_THEME;
  }
};

// Update theme in localStorage
const setStoredTheme = (theme: PartialTheme) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
  } catch (error) {
    console.error('Error saving theme to localStorage:', error);
  }
};

type ArticleThemeContextType = {
  theme: PartialTheme;
  setTheme: (theme: PartialTheme) => void;
};

const ArticleThemeContext = createContext<ArticleThemeContextType | undefined>(
  undefined
);

export function ArticleThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<PartialTheme>(getStoredTheme);

  function mergePartialTheme(
    baseTheme: PartialTheme,
    partialTheme: PartialTheme
  ) {
    return {
      ...baseTheme,
      ...partialTheme,
      heading: { ...baseTheme.heading, ...partialTheme.heading },
      paragraph: { ...baseTheme.paragraph, ...partialTheme.paragraph },
    };
  }

  useEffect(() => {
    const afterDelay = setTimeout(() => {
      setStoredTheme(theme);
    }, 2000);
    return () => clearTimeout(afterDelay);
  }, [theme]);

  return (
    <ArticleThemeContext.Provider
      value={{
        theme,
        setTheme: (partialTheme) =>
          setTheme(mergePartialTheme(theme, partialTheme)),
      }}
    >
      {children}
    </ArticleThemeContext.Provider>
  );
}

export const useArticleTheme = () => {
  const context = useContext(ArticleThemeContext);
  if (!context) {
    throw new Error(
      'useArticleTheme must be used within an ArticleThemeProvider'
    );
  }
  return context;
};
