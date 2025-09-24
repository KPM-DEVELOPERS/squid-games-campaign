import { useEffect, useRef, useState } from 'react';

export const useAudio = (url?: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (url) {
      audioRef.current = new Audio(url);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.3;
      
      const audio = audioRef.current;
      
      const handleCanPlay = () => setIsLoaded(true);
      const handleEnded = () => setIsPlaying(false);
      
      audio.addEventListener('canplaythrough', handleCanPlay);
      audio.addEventListener('ended', handleEnded);
      
      return () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('ended', handleEnded);
        audio.pause();
      };
    }
  }, [url]);

  const play = () => {
    if (audioRef.current && isLoaded) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log('Audio play failed:', error);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  return { play, pause, toggle, isPlaying, isLoaded };
};