import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import backgroundSvg from '@/assets/BG.svg';
import ingotFrame from '@/assets/ingot frame.svg';
import ingot from '@/assets/ingot 1.svg';
import redX from '@/assets/X elements.svg';
import confetti from '@/assets/confetti.svg';

interface Ingot {
  id: number;
  scale: number;
}

const SCALE_SPEED = 0.009;

// Win ranges
const WIN_RANGE_W = [70, 80];
const WIN_RANGE_H = [120, 130];

const Game = () => {
  const navigate = useNavigate();
  const [ingotState, setIngotState] = useState<Ingot | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'win' | 'lose'>('playing');
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(3);

  const animationRef = useRef<number>();
  const gameLoopRef = useRef<boolean>(true);

  const frameRef = useRef<HTMLDivElement>(null);
  const ingotRef = useRef<HTMLImageElement>(null);

  // Generate new ingot
  const generateNewIngot = useCallback(() => {
    setIngotState({
      id: Math.random(),
      scale: 0.5,
    });
    setGameState('playing');
  }, []);

  const stopScaling = useCallback(() => {
    if (!ingotState || gameState !== 'playing') return;
    gameLoopRef.current = false;

    const frame = frameRef.current?.getBoundingClientRect();
    const ingotEl = ingotRef.current?.getBoundingClientRect();

    let won = false;

    if (frame && ingotEl) {
      const widthDiffPercent = ((ingotEl.width - frame.width) / frame.width) * 100;
      const heightDiffPercent = ((ingotEl.height - frame.height) / frame.height) * 100;

      won =
        widthDiffPercent >= WIN_RANGE_W[0] &&
        widthDiffPercent <= WIN_RANGE_W[1] &&
        heightDiffPercent >= WIN_RANGE_H[0] &&
        heightDiffPercent <= WIN_RANGE_H[1];
    }

    if (won) {
      setGameState('win');
      setScore(prev => prev + 1);

      // navigate to form after 3 seconds
      setTimeout(() => {
        navigate('/form', { state: { won: true, score: score + 1 } });
      }, 3000);
    } else {
      setGameState('lose');
      setAttempts(prev => prev - 1);

      if (attempts - 1 <= 0) {
        // end attempts → navigate to form
        setTimeout(() => {
          navigate('/form', { state: { won: false, score } });
        }, 3000);
      } else {
        // have attempts → play again
        setTimeout(() => {
          generateNewIngot();
        }, 3000);
      }
    }
  }, [ingotState, gameState, navigate, score, attempts, generateNewIngot]);

  // Game loop
  useEffect(() => {
    setIsLoaded(true);
    if (!ingotState || gameState !== 'playing') return;

    gameLoopRef.current = true;

    const animate = () => {
      if (!gameLoopRef.current) return;

      setIngotState(currentIngot => {
        if (!currentIngot) return null;

        const newScale = currentIngot.scale + SCALE_SPEED;
        if (newScale > 2.0) {
          setTimeout(generateNewIngot, 100);
          return null;
        }

        return { ...currentIngot, scale: newScale };
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [ingotState?.id, gameState, generateNewIngot]);

  // Keyboard events
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.key === 'Enter') {
        event.preventDefault();
        stopScaling();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [stopScaling]);

  // First init
  useEffect(() => {
    generateNewIngot();

    return () => {
      gameLoopRef.current = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [generateNewIngot]);

  const renderIngot = () => {
    if (!ingotState) return null;

    return (
      <img
        ref={ingotRef}
        src={ingot}
        alt="Golden Ingot"
        className="object-contain mb-2"
        style={{
          width: '650px',
          height: '650px',
          transform: `scale(${ingotState.scale})`,
          transformOrigin: 'center center',
          transition: 'transform 0.05s linear',
        }}
      />
    );
  };

  // Result screen (Win/Lose)
  const renderResult = () => {
    const isWin = gameState === 'win';

    return (
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-6">
        <h1
          className={`text-6xl md:text-7xl font-bold ${isWin ? 'text-green-400' : 'text-red-500'
            } animate-pulse`}
          style={{
            textShadow: isWin
              ? '0 0 12px rgba(34,197,94,0.9), 0 0 30px rgba(34,197,94,0.6)'
              : '0 0 12px rgba(239,68,68,0.9), 0 0 30px rgba(239,68,68,0.6)',
          }}
        >
          {isWin ? 'Win' : 'Lose'}
        </h1>

        {isWin ? (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          
            <img
              src={confetti}
              alt="confetti"
              className="absolute w-40 h-40 -top-6 animate-bounce"
            />
          </div>
        ) : (
          <div className="absolute top-0 left-0 right-0 w-full h-1/2 z-20 pointer-events-none">
         
            <img
              src={redX}
              alt="Red X"
              className="absolute w-full h-32 -top-8 animate-pulse"
            />
          </div>
        )}



      </div>
    );
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center relative overflow-hidden ${isLoaded ? 'animate-fade-in' : 'opacity-0'
        }`}
    >
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundSvg})` }}
      />

      {/* Attempts counter */}
      <div className="absolute top-6 text-white text-lg font-semibold z-20">
        Attempts left: {attempts}
      </div>

      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Frame */}
        <div ref={frameRef} className="relative flex items-center justify-center w-full max-w-[360px]">
          <img src={ingotFrame} alt="Ingot Frame" className="w-full h-auto" />
          <div className="absolute inset-0 flex mt-32 ms-4 items-center justify-center">
            {renderIngot()}
          </div>
        </div>

        {/* Stop button OR result */}
        {gameState === 'playing' ? (
          <Button
            onClick={stopScaling}
            disabled={gameState !== 'playing' || !ingotState}
            className="px-16 py-4 text-xl font-bold bg-pink-300 hover:bg-pink-400 text-black rounded-full border-0 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Stop
          </Button>
        ) : (
          renderResult()
        )}
      </div>
    </div>
  );
};

export default Game;
