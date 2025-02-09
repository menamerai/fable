import { z } from 'zod';

export const sentencesSchema = z.object({
  start: z.object({
    text: z.string(),
    audio_path: z.string(),
  }),
  end: z.object({
    text: z.string(),
    audio_path: z.string(),
  }),
  ambience: z.array(
    z.object({
      text: z.string(),
      audio_path: z.string(),
    })
  ),
});

export type Sentences = z.infer<typeof sentencesSchema>;

export function playAudioById(id: string, fade?: 'fade-in' | 'fade-out') {
  const audio = document.getElementById(id) as HTMLAudioElement;
  if (!audio) {
    return;
  }

  (audio as HTMLAudioElement).play();
  if (fade === 'fade-in') {
    const fadeIn = setInterval(() => {
      if (audio.volume < 1) {
        audio.volume = Math.min(1, audio.volume + 0.1);
      } else {
        clearInterval(fadeIn);
      }
    }, 100);
  } else if (fade === 'fade-out') {
    const fadeOut = setInterval(() => {
      if (audio.volume > 0) {
        audio.volume = Math.max(0, audio.volume - 0.1);
      } else {
        audio.pause();
        clearInterval(fadeOut);
      }
    }, 100);
  }
}

export function hasAudioPathDataset(element: Element) {
  return (
    (element as HTMLElement).dataset.audioPath &&
    (element as HTMLElement).dataset.audioPath !== ''
  );
}

export function processAudioSentences(html: string, sentences: Sentences) {
  // Only take the first sentence because it's pretty long
  const startTextFirstSentence = sentences.start.text.split('.')[0];
  const wrappedStart = `<span data-highlight-id="start" data-audio-path="${sentences.start.audio_path}" class="highlight-target">${startTextFirstSentence}</span>`;
  const endTextFirstSentence = sentences.end.text.split('.')[0];
  const wrappedEnd = `<span data-highlight-id="end" data-audio-path="${sentences.end.audio_path}" class="highlight-target">${endTextFirstSentence}</span>`;

  let processedHtml = html
    .replace(startTextFirstSentence, wrappedStart)
    .replace(endTextFirstSentence, wrappedEnd);

  for (const ambience of sentences.ambience) {
    const firstSentence = ambience.text.split('.')[0];
    processedHtml = processedHtml.replace(
      firstSentence,
      `<span data-highlight-id="ambience" data-audio-path="${ambience.audio_path}" class="highlight-target">${firstSentence}</span>`
    );
  }

  return processedHtml;
}
