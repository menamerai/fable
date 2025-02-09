import { useArticleTheme } from '@/components/article-theme-provider';
import FontsSearch from '@/components/fonts-search';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'motion/react';
import { createContext, useContext, useEffect, useState } from 'react';

interface OnboardContextType {
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
}

const OnboardContext = createContext<OnboardContextType | undefined>(undefined);

export function useOnboard() {
  const context = useContext(OnboardContext);
  if (!context) {
    throw new Error('useOnboard must be used within an OnboardProvider');
  }
  return context;
}

interface OnboardProviderProps {
  children: React.ReactNode;
}

export function OnboardProvider({ children }: OnboardProviderProps) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { theme } = useArticleTheme();

  useEffect(() => {
    const onboardingStatus = localStorage.getItem('hasCompletedOnboarding');
    if (onboardingStatus === 'true') {
      setHasCompletedOnboarding(true);
    }
  }, []);

  const completeOnboarding = () => {
    localStorage.setItem('hasCompletedOnboarding', 'true');
    setHasCompletedOnboarding(true);
  };

  const value = {
    hasCompletedOnboarding,
    completeOnboarding,
  };

  if (!hasCompletedOnboarding) {
    return (
      <OnboardContext.Provider value={value}>
        <div className='w-full h-screen flex justify-center items-center'>
          <div className='flex items-start gap-8'>
            <article className='w-80 mt-2'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className='text-2xl font-bold mb-3 px-3'
                style={{ fontFamily: theme.heading?.fontFamily }}
              >
                Welcome to Storytime
              </motion.h1>
              <div className='px-3'>
                {['To', 'begin', 'your', 'journey,'].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.4 + i * 0.22, duration: 0.25 }}
                    className='text-muted-foreground'
                    style={{ fontFamily: theme.paragraph?.fontFamily }}
                  >
                    {word}{' '}
                  </motion.span>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay:  3.4, duration: 2.0 }}
              >
                <Textarea
                  rows={1}
                  placeholder='tell us your ideal reading experience...'
                  className='w-full md:text-base border-none hover:bg-muted focus:bg-muted focus-visible:ring-0 focus-visible:outline-none transition-all'
                  style={{ fontFamily: theme.paragraph?.fontFamily }}
                />
              </motion.div>
            </article>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 5.0, duration: 1.2 }}
              className='w-80'
            >
              <FontsSearch />
            </motion.div>
          </div>
        </div>
      </OnboardContext.Provider>
    );
  }

  return (
    <OnboardContext.Provider value={value}>{children}</OnboardContext.Provider>
  );
}
