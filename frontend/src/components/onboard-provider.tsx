import { useArticleTheme } from '@/components/article-theme-provider';
import FontsSearch from '@/components/fonts-search';
import { Textarea } from '@/components/ui/textarea';
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
              <h1
                className='text-2xl font-bold mb-3 px-3'
                style={{ fontFamily: theme.heading?.fontFamily }}
              >
                Welcome to Storytime
              </h1>
              <p
                className='text-muted-foreground px-3'
                style={{ fontFamily: theme.paragraph?.fontFamily }}
              >
                To begin your journey,
              </p>
              <Textarea
                rows={1}
                placeholder='tell us your ideal reading experience...'
                className='w-full md:text-base border-none hover:bg-muted focus:bg-muted focus-visible:ring-0 focus-visible:outline-none transition-all'
                style={{ fontFamily: theme.paragraph?.fontFamily }}
              />
            </article>
            <div className='w-80'>
              <FontsSearch />
            </div>
          </div>
        </div>

        {/* <div className='flex flex-col items-center justify-center min-h-screen p-4'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to the Library</h1>
          <p className='text-lg text-muted-foreground mb-8'>
            Your personal reading sanctuary
          </p>
          <button
            onClick={completeOnboarding}
            className='px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90'
          >
            Get Started
          </button>
        </div> */}
      </OnboardContext.Provider>
    );
  }

  return (
    <OnboardContext.Provider value={value}>{children}</OnboardContext.Provider>
  );
}
