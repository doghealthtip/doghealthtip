import React, { useEffect, useState } from 'react';

interface ReadingProgressBarProps {
  /** Optional title to show in a sticky mini-bar when scrolled down */
  title?: string;
  readTimeMinutes?: number;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  title,
  readTimeMinutes = 5,
}) => {
  const [progress, setProgress] = useState(0);
  const [isScrolledPastHero, setIsScrolledPastHero] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;

          if (docHeight > 0) {
            const currentProgress = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
            setProgress(currentProgress);
          } else {
            setProgress(0);
          }

          setIsScrolledPastHero(scrollTop > 260);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const remainingMinutes = Math.max(1, Math.ceil(readTimeMinutes * (1 - progress / 100)));

  return (
    <>
      {/* 1. Subtle Scroll-Based Reading Progress Bar fixed at the very top */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 h-1 sm:h-1.5 bg-[#E8E0D3]/60 backdrop-blur-xs pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      >
        <div
          className="h-full bg-linear-to-r from-[#315B2B] to-[#45793D] transition-[width] duration-150 ease-out rounded-r-full shadow-xs"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 2. Floating subtle reading indicator chip when reading long content */}
      <div
        className={`fixed bottom-5 right-5 z-40 transition-all duration-300 pointer-events-auto ${
          isScrolledPastHero && progress < 98
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#1c1c16]/85 backdrop-blur-md text-white text-xs rounded-full shadow-lg border border-white/10">
          <div className="relative w-4 h-4 flex items-center justify-center">
            <svg className="w-4 h-4 -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#CEECB4]"
                strokeDasharray={`${progress}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <span className="font-semibold text-[11px] text-[#CEECB4]">
            {Math.round(progress)}%
          </span>
          <span className="text-white/50 text-[10px] hidden sm:inline">•</span>
          <span className="text-white/80 text-[11px] hidden sm:inline">
            ~{remainingMinutes} min left
          </span>
        </div>
      </div>
    </>
  );
};
