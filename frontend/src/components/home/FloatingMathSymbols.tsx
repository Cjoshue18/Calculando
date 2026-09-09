import React, { useEffect, useState } from 'react';

interface MathSymbolConfig {
  id: string;
  char: string;
  side: 'left' | 'right';
  top: string;
  sideOffset: string;
  size: string;
  font: string;
  animationClass: string;
  animationDelay: string;
  baseRotation: number; // Tilted angle in degrees (not upright)
  rotDrift: number;     // Additional rotational spin during scroll dispersion
  baseOpacity: number;  // Increased opacity per user request
  driftX: number;       // Outward horizontal flight
  driftY: number;       // Diagonal vertical flight
  hideOnMobile?: boolean;
}

const MATH_SYMBOLS: MathSymbolConfig[] = [
  // ─── Left Side (Organic zigzag, tilted diagonally) ───
  {
    id: 'sqrt-left',
    char: '√',
    side: 'left',
    top: '7%',
    sideOffset: '3.5%',
    size: 'text-4xl sm:text-5xl md:text-6xl',
    font: 'font-serif font-light',
    animationClass: 'animate-float-slow',
    animationDelay: '0s',
    baseRotation: -18,
    rotDrift: -30,
    baseOpacity: 0.58,
    driftX: -320,
    driftY: -55,
  },
  {
    id: 'sum-left',
    char: '∑',
    side: 'left',
    top: '25%',
    sideOffset: '14%',
    size: 'text-2xl sm:text-3xl md:text-4xl',
    font: 'font-serif font-medium',
    animationClass: 'animate-float-gentle',
    animationDelay: '1.4s',
    baseRotation: 15,
    rotDrift: 25,
    baseOpacity: 0.50,
    driftX: -290,
    driftY: -35,
    hideOnMobile: true,
  },
  {
    id: 'plus-left',
    char: '+',
    side: 'left',
    top: '45%',
    sideOffset: '2.5%',
    size: 'text-3xl sm:text-4xl md:text-5xl',
    font: 'font-sans font-light',
    animationClass: 'animate-float-reverse',
    animationDelay: '0.7s',
    baseRotation: 22,
    rotDrift: 35,
    baseOpacity: 0.54,
    driftX: -340,
    driftY: 35,
  },
  {
    id: 'euler-left',
    char: 'e',
    side: 'left',
    top: '66%',
    sideOffset: '13%',
    size: 'text-3xl sm:text-4xl md:text-5xl',
    font: 'font-serif italic font-semibold',
    animationClass: 'animate-float-slow',
    animationDelay: '2.1s',
    baseRotation: -16,
    rotDrift: -28,
    baseOpacity: 0.60,
    driftX: -300,
    driftY: 45,
  },
  {
    id: 'div-left',
    char: '÷',
    side: 'left',
    top: '85%',
    sideOffset: '4%',
    size: 'text-3xl sm:text-4xl md:text-5xl',
    font: 'font-sans font-semibold',
    animationClass: 'animate-float-gentle',
    animationDelay: '3.2s',
    baseRotation: -20,
    rotDrift: -32,
    baseOpacity: 0.52,
    driftX: -330,
    driftY: 65,
  },

  // ─── Right Side (Organic zigzag, tilted diagonally) ───
  {
    id: 'pi-right',
    char: 'π',
    side: 'right',
    top: '9%',
    sideOffset: '4%',
    size: 'text-3xl sm:text-4xl md:text-5xl',
    font: 'font-serif italic font-normal',
    animationClass: 'animate-float-gentle',
    animationDelay: '0.4s',
    baseRotation: 16,
    rotDrift: 28,
    baseOpacity: 0.58,
    driftX: 320,
    driftY: -50,
  },
  {
    id: 'minus-right',
    char: '−',
    side: 'right',
    top: '28%',
    sideOffset: '15%',
    size: 'text-3xl sm:text-4xl md:text-5xl',
    font: 'font-sans font-medium',
    animationClass: 'animate-float-slow',
    animationDelay: '1.8s',
    baseRotation: -22,
    rotDrift: -30,
    baseOpacity: 0.50,
    driftX: 290,
    driftY: -25,
    hideOnMobile: true,
  },
  {
    id: 'integral-right',
    char: '∫',
    side: 'right',
    top: '49%',
    sideOffset: '2.5%',
    size: 'text-4xl sm:text-5xl md:text-6xl',
    font: 'font-serif italic font-light',
    animationClass: 'animate-float-reverse',
    animationDelay: '1.1s',
    baseRotation: -15,
    rotDrift: -24,
    baseOpacity: 0.60,
    driftX: 350,
    driftY: -30,
  },
  {
    id: 'percent-right',
    char: '%',
    side: 'right',
    top: '69%',
    sideOffset: '14%',
    size: 'text-2xl sm:text-3xl md:text-4xl',
    font: 'font-mono font-medium',
    animationClass: 'animate-float-gentle',
    animationDelay: '3.6s',
    baseRotation: 20,
    rotDrift: 32,
    baseOpacity: 0.52,
    driftX: 300,
    driftY: 45,
  },
  {
    id: 'infinity-right',
    char: '∞',
    side: 'right',
    top: '87%',
    sideOffset: '5%',
    size: 'text-3xl sm:text-4xl md:text-5xl',
    font: 'font-sans font-normal',
    animationClass: 'animate-float-slow',
    animationDelay: '2.6s',
    baseRotation: -18,
    rotDrift: -28,
    baseOpacity: 0.54,
    driftX: 330,
    driftY: 60,
  },
];

export const FloatingMathSymbols: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // By 280px of vertical scroll, symbols have dispersed completely out of the viewport
          const maxScroll = 280;
          const current = window.scrollY;
          const progress = Math.min(1, Math.max(0, current / maxScroll));
          setScrollProgress(progress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {MATH_SYMBOLS.map((sym) => {
        // Calculate outward diagonal displacement and rotation on scroll
        const translateX = sym.driftX * scrollProgress;
        const translateY = sym.driftY * scrollProgress;
        const currentRotation = sym.baseRotation + sym.rotDrift * scrollProgress;
        const opacity = Math.max(0, sym.baseOpacity * (1 - scrollProgress * 1.15));
        const isHidden = scrollProgress >= 1;

        return (
          <div
            key={sym.id}
            className={`absolute ${sym.hideOnMobile ? 'hidden sm:block' : 'block'}`}
            style={{
              top: sym.top,
              ...(sym.side === 'left' ? { left: sym.sideOffset } : { right: sym.sideOffset }),
              transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${currentRotation}deg)`,
              opacity: isHidden ? 0 : opacity,
              visibility: isHidden ? 'hidden' : 'visible',
              transition: 'transform 0.08s ease-out, opacity 0.08s ease-out',
            }}
          >
            {/* Inner span handles the multi-axis diagonal float animation */}
            <span
              className={`inline-block ${sym.size} ${sym.font} ${sym.animationClass} text-[#234968] dark:text-[#7bb2d1] drop-shadow-xs`}
              style={{
                animationDelay: sym.animationDelay,
              }}
            >
              {sym.char}
            </span>
          </div>
        );
      })}
    </div>
  );
};
