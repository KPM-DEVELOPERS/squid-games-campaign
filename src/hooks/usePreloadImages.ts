import { useEffect } from 'react';

// قائمة الصور الكبيرة في مجلد assets (استخدم المسار النسبي من جذر المشروع)
const imageList = [
  '/src/assets/ingot 1.svg',
  '/src/assets/X elements.svg',
  '/src/assets/x-button.svg',
  '/src/assets/o-button.svg',
  '/src/assets/ingot frame.svg',
  '/src/assets/confetti.svg',
  '/src/assets/BG.svg',
  '/src/assets/background.svg',
  '/src/assets/collection.svg',
  '/src/assets/landing-page.svg',
];

const usePreloadImages = () => {
  useEffect(() => {
    imageList.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);
};

export default usePreloadImages;
