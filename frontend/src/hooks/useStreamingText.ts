import { animate, useMotionValue } from 'motion/react';
import { useRef, useState } from 'react';

export const useStreamingText = (onUpdate?: (text: string) => void) => {
  const [displayText, setDisplayText] = useState('');
  const textRef = useRef('');
  const count = useMotionValue(0);

  const start = async (prompt: string) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/theme`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const stream = response.body;
    if (!stream) throw new Error('No response stream');

    const reader = stream.getReader();
    textRef.current = ''; // Reset text on new stream

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        const data = JSON.parse(text);

        textRef.current += data.choices[0]?.delta?.content || '';

        animate(count, textRef.current.length, {
          duration: 0.5,
          onUpdate: (latest) => {
            const newText = textRef.current.slice(0, Math.round(latest));
            setDisplayText(newText);
            onUpdate?.(newText);
          },
        });
      }
    } finally {
      reader.releaseLock();
    }
  };

  return {
    displayText,
    start,
  };
};
