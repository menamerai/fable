import { Sentences } from '@/lib/audio';

export function SentenceAudio({ sentences }: { sentences?: Sentences }) {
  if (!sentences) {
    return null;
  }

  return (
    <>
      {sentences.start && (
        <audio
          preload='metadata'
          loop
          id={sentences.start.audio_path}
          src={
            import.meta.env.VITE_BACKEND_URL +
            '/audio/' +
            sentences.start.audio_path
          }
        />
      )}
      {sentences.end && (
        <audio
          preload='metadata'
          loop
          id={sentences.end.audio_path}
          src={
            import.meta.env.VITE_BACKEND_URL +
            '/audio/' +
            sentences.end.audio_path
          }
        />
      )}
      {sentences.ambience.map((ambience) => (
        <audio
          key={ambience.audio_path}
          preload='metadata'
          loop
          id={ambience.audio_path}
          src={
            import.meta.env.VITE_BACKEND_URL +
            '/ambient_audio/' +
            ambience.audio_path
          }
        />
      ))}
    </>
  );
}
