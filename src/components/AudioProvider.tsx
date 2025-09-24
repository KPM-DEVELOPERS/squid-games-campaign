import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAudio } from '@/hooks/useAudio';

interface AudioContextType {
  play: () => void;
  pause: () => void;
  toggle: () => void;
  isPlaying: boolean;
  isLoaded: boolean;
}

const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider = ({ children }: AudioProviderProps) => {
  // For now we'll use a placeholder URL - in production you'd host the Squid Game theme
  const audioUrl = "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"; // Placeholder
  const audio = useAudio(audioUrl);

  // Auto-play on mount (with user interaction)
  useEffect(() => {
    const handleUserInteraction = () => {
      if (audio.isLoaded && !audio.isPlaying) {
        audio.play();
      }
      // Remove listener after first interaction
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [audio.isLoaded, audio.isPlaying, audio.play]);

  return (
    <AudioContext.Provider value={audio}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudioContext = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioContext must be used within AudioProvider');
  }
  return context;
};