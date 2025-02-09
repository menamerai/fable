import { useArticleTheme } from '@/components/article-theme-provider';
import FontsSearch from '@/components/fonts-search';
import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router';

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
  const navigate = useNavigate();

  const completeOnboarding = () => {
    navigate('/');
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
          <div className='flex items-start gap-4'>
            <article className='w-80 mt-2'>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className='text-2xl font-bold mb-3'
                style={{ fontFamily: theme.heading?.fontFamily }}
              >
                Welcome to Fable
              </motion.h1>
              <div className=''>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4, duration: 1.5 }}
                  className='text-muted-foreground'
                  style={{ fontFamily: theme.paragraph?.fontFamily }}
                >
                  To begin, select
                </motion.span>
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 1.5 }}
                className='text-muted-foreground'
                style={{ fontFamily: theme.paragraph?.fontFamily }}
              >
                a theme that suits you and
              </motion.span>
              <motion.div
                // className='rounded-sm'
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{ delay: 3.9, duration: 1.5 }}
                className='text-foreground underline group cursor-pointer'
                style={{ fontFamily: theme.paragraph?.fontFamily }}
                onClick={completeOnboarding}
              >
                continue your journey
                <ArrowRight className='ml-2 w-4 h-4 inline-block group-hover:translate-x-1 transition-transform duration-300' />
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
