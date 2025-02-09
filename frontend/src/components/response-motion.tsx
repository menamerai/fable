import { Button } from '@/components/ui/button';
import { useStreamingText } from '@/hooks/useStreamingText';
import { PlayIcon } from 'lucide-react';
import { motion } from 'motion/react';

type ResponseMotionProps = {
  prompt: string;
};

export const ResponseMotion = ({ prompt }: ResponseMotionProps) => {
  const { displayText, start } = useStreamingText();

  return (
    <div className='flex flex-col gap-2'>
      <motion.span>{displayText}</motion.span>
      <div className='flex flex-row gap-2'>
        <Button variant='outline' onClick={() => start(prompt)}>
          <PlayIcon />
        </Button>
      </div>
    </div>
  );
};

