import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import landingPageSvg from '@/assets/landing-page.svg';
import backgroundSvg from '@/assets/background.svg';
import oButtonSvg from '@/assets/o-button.svg';
import xButtonSvg from '@/assets/x-button.svg';

const Landing = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleButtonClick = () => {
    navigate('/game');
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden ${isLoaded ? 'animate-fade-in' : 'opacity-0'}`}>
      {/* Background using provided SVG */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundSvg})`,
        }}
      />

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Landing Page Design */}
        <div
          className="relative w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-screen bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${landingPageSvg})`,
          }}
        >
          {/* Interactive Button Areas */}
          <div className="absolute inset-0 flex items-center justify-center mt-4">

            <div className="flex flex-row items-center justify-center ">

              {/* X Button */}
              <img
                src={xButtonSvg}
                onClick={handleButtonClick}
                alt="X Button"
                className="relative left-40 cursor-pointer w-full z-10  duration-300"
              />

              {/* O Button (Circle) */}
              <img
                src={oButtonSvg}
                onClick={handleButtonClick}
                alt="O Button"
                className="relative right-40 duration-300 w-full z-20 cursor-pointer"
              />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;