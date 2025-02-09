import { useQuery } from '@tanstack/react-query';
import { sentencesSchema, type Sentences } from '@/lib/audio';

export const defaultSentences = {
  start: {
    text: '',
    audio_path: '',
  },
  end: {
    text: '',
    audio_path: '',
  },
  ambience: [],
} satisfies Sentences;

export function useSentences(filename: string) {
  const jsonFilename = filename.endsWith('.json')
    ? filename
    : `${filename}.json`;

  return useQuery({
    queryKey: ['sentences', jsonFilename],
    queryFn: async () => {
      if (jsonFilename === '') {
        return defaultSentences;
      }

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/selection/${jsonFilename}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch sentences');
      }
      const data = await response.json();
      return sentencesSchema.parse(data);
    },
  });
}
