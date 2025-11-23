import { DEFAULT_GAME_CONFIG } from '../types';
import type { Theme } from './PortfolioApp';

interface PortfolioContentProps {
  pyramidCount: number;
  speedMultiplier: number;
  onPyramidCountChange: (delta: number) => void;
  onSpeedChange: (delta: number) => void;
  theme: Theme;
  onThemeToggle: () => void;
}

export function PortfolioContent({
  pyramidCount,
  speedMultiplier,
  onPyramidCountChange,
  onSpeedChange,
  theme,
  onThemeToggle,
}: PortfolioContentProps) {
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  const bgColor = theme === 'light' ? 'bg-black' : 'bg-white';
  const strokeColor = theme === 'light' ? 'black' : 'white';

  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${textColor} text-center z-[1001] pointer-events-none`}
      >
        <h1
          className="text-[clamp(2rem,8vw,4rem)] font-light m-0 mb-[clamp(0.5rem,2vw,1rem)] opacity-0 animate-neon-reveal [animation-delay:1s] whitespace-nowrap"
          style={{
            fontFamily: "'Syne Mono', monospace",
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          ANGEL VAZQUEZ
        </h1>

        <h2
          className="text-[clamp(1rem,4vw,2rem)] font-light m-0 mb-[clamp(0.75rem,3vw,1.5rem)] opacity-0 tracking-[0.1em] animate-neon-reveal [animation-delay:2s] whitespace-nowrap"
          style={{
            fontFamily: "'Syne Mono', monospace",
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          SOFTWARE ENGINEER
        </h2>

        <div
          className={`w-[clamp(150px,30vw,300px)] h-0.5 ${bgColor} mx-auto mb-[clamp(0.75rem,3vw,1.5rem)] opacity-0 animate-neon-reveal [animation-delay:2.5s]`}
        />

        <div className="flex flex-col items-center gap-[clamp(0.75rem,3vw,1.5rem)] opacity-0 animate-neon-reveal [animation-delay:3s]">
          <div className="flex gap-[clamp(1rem,4vw,2rem)] justify-center items-center whitespace-nowrap">
            <a
              href="https://github.com/AngelCodes95"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="inline-block transition-all duration-300 pointer-events-auto hover:-translate-y-1"
              style={{
                fontFamily: "'Syne Mono', monospace",
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              <span className="text-[clamp(0.875rem,3.5vw,1.75rem)]">
                GITHUB
              </span>
            </a>

            <a
              href="https://linkedin.com/in/angelthedev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="inline-block transition-all duration-300 pointer-events-auto hover:-translate-y-1"
              style={{
                fontFamily: "'Syne Mono', monospace",
                WebkitFontSmoothing: 'antialiased',
                MozOsxFontSmoothing: 'grayscale',
              }}
            >
              <span className="text-[clamp(0.875rem,3.5vw,1.75rem)]">
                LINKEDIN
              </span>
            </a>
          </div>

          <a
            href="https://portfolio.angel-vazquez.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Portfolio Documentation"
            className="inline-block transition-all duration-300 pointer-events-auto hover:-translate-y-1 whitespace-nowrap"
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            <span className="text-[clamp(0.875rem,3.5vw,1.75rem)]">
              PORTFOLIO
            </span>
          </a>

          {/* Theme toggle button */}
          <button
            onClick={onThemeToggle}
            className="pointer-events-auto mt-[clamp(0.25rem,1vw,0.5rem)] transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
          >
            <svg
              viewBox="0 0 50 40"
              className="w-[clamp(30px,7vw,45px)] h-[clamp(24px,5.6vw,36px)]"
            >
              {/* Wireframe upside-down triangle */}
              <path
                d="M 25 35 L 8 10 L 42 10 Z"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1.5"
              />
              {/* Icon inside - sun (light mode) or moon (dark mode) */}
              {theme === 'light' ? (
                // Moon icon for light mode (click to go dark)
                <path
                  d="M 27 17 A 4.5 4.5 0 1 1 23 21.5 A 3.5 3.5 0 0 0 27 17 Z"
                  fill={strokeColor}
                  transform="translate(-2, 0)"
                />
              ) : (
                // Sun icon for dark mode (click to go light)
                <>
                  <circle cx="25" cy="19" r="3.5" fill={strokeColor} />
                  <line
                    x1="25"
                    y1="13"
                    x2="25"
                    y2="15"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="25"
                    y1="23"
                    x2="25"
                    y2="25"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="19"
                    y1="19"
                    x2="21"
                    y2="19"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="29"
                    y1="19"
                    x2="31"
                    y2="19"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="20.5"
                    y1="14.5"
                    x2="22"
                    y2="16"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="28"
                    y1="22"
                    x2="29.5"
                    y2="23.5"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="29.5"
                    y1="14.5"
                    x2="28"
                    y2="16"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                  <line
                    x1="22"
                    y1="22"
                    x2="20.5"
                    y2="23.5"
                    stroke={strokeColor}
                    strokeWidth="1"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-[1001] pointer-events-auto flex flex-col gap-4 w-[min(200px,25vw)]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="pyramid-count"
            className={`text-[10px] ${textColor} whitespace-nowrap`}
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            PYRAMIDS: {pyramidCount}
          </label>
          <input
            id="pyramid-count"
            type="range"
            min={DEFAULT_GAME_CONFIG.minPyramids}
            max={DEFAULT_GAME_CONFIG.maxPyramids}
            step="0.01"
            value={pyramidCount}
            onChange={(e) => {
              const newCount = Math.round(parseFloat(e.target.value));
              const delta = newCount - pyramidCount;
              onPyramidCountChange(delta);
            }}
            className={`w-full h-1 ${theme === 'light' ? 'bg-black/30' : 'bg-white/30'} rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full ${theme === 'light' ? '[&::-webkit-slider-thumb]:bg-black' : '[&::-webkit-slider-thumb]:bg-white'} [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full ${theme === 'light' ? '[&::-moz-range-thumb]:bg-black' : '[&::-moz-range-thumb]:bg-white'} [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="speed"
            className={`text-[10px] ${textColor} whitespace-nowrap`}
            style={{
              fontFamily: "'Syne Mono', monospace",
              WebkitFontSmoothing: 'antialiased',
              MozOsxFontSmoothing: 'grayscale',
            }}
          >
            SPEED: {speedMultiplier}x
          </label>
          <input
            id="speed"
            type="range"
            min={DEFAULT_GAME_CONFIG.minSpeed}
            max={DEFAULT_GAME_CONFIG.maxSpeed}
            step="0.01"
            value={speedMultiplier}
            onChange={(e) => {
              const newSpeed = Math.round(parseFloat(e.target.value));
              const delta = newSpeed - speedMultiplier;
              onSpeedChange(delta);
            }}
            className={`w-full h-1 ${theme === 'light' ? 'bg-black/30' : 'bg-white/30'} rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full ${theme === 'light' ? '[&::-webkit-slider-thumb]:bg-black' : '[&::-webkit-slider-thumb]:bg-white'} [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full ${theme === 'light' ? '[&::-moz-range-thumb]:bg-black' : '[&::-moz-range-thumb]:bg-white'} [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0`}
          />
        </div>
      </div>
    </>
  );
}
