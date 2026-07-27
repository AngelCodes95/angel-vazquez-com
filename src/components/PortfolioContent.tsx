import { DEFAULT_GAME_CONFIG } from '../types';
import type { Theme } from './PortfolioApp';

interface PortfolioContentProps {
  pyramidCount: number;
  speedMultiplier: number;
  onPyramidCountChange: (delta: number) => void;
  onSpeedChange: (delta: number) => void;
  theme: Theme;
  onThemeToggle: () => void;
  isMobileMenuOpen: boolean;
  onMobileMenuToggle: () => void;
  showTechInfo: boolean;
}

export function PortfolioContent({
  pyramidCount,
  speedMultiplier,
  onPyramidCountChange,
  onSpeedChange,
  theme,
  onThemeToggle,
  isMobileMenuOpen,
  onMobileMenuToggle,
  showTechInfo,
}: PortfolioContentProps) {
  const textColor = theme === 'light' ? 'text-black' : 'text-white';
  const bgColor = theme === 'light' ? 'bg-black' : 'bg-white';
  const strokeColor = theme === 'light' ? 'black' : 'white';

  return (
    <>
      {/* Backdrop overlay - mobile only, when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-overlay transition-opacity duration-300"
          onClick={onMobileMenuToggle}
        />
      )}

      {/* Hamburger menu button - mobile only */}
      <button
        onClick={onMobileMenuToggle}
        className={`xl:hidden fixed top-4 left-4 z-nav-button pointer-events-auto ${textColor} transition-opacity hover:opacity-80`}
        aria-label="Toggle menu"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="6" y1="10" x2="26" y2="10" />
          <line x1="6" y1="16" x2="26" y2="16" />
          <line x1="6" y1="22" x2="26" y2="22" />
        </svg>
      </button>

      {/* Triangle content - always visible on desktop, toggleable on mobile */}
      <div
        className={`${isMobileMenuOpen ? 'flex' : 'hidden'} xl:flex fixed ${
          isMobileMenuOpen
            ? 'top-[60px] left-4 max-w-[min(90vw,400px)] transition-transform duration-300 ease-out'
            : 'top-[clamp(1.25rem,3.75vw,2.5rem)] left-[clamp(1.25rem,3.75vw,2.5rem)]'
        } ${textColor} text-center z-nav pointer-events-none flex-col items-center`}
        style={{
          transform: isMobileMenuOpen ? 'translateY(0)' : undefined,
        }}
      >
        <h1
          className={`${
            isMobileMenuOpen
              ? 'text-[clamp(1.5rem,7vw,3.5rem)] mb-[clamp(0.25rem,1.5vw,0.75rem)] opacity-100'
              : 'text-[clamp(1rem,4vw,2rem)] mb-[clamp(0.25rem,1vw,0.5rem)] opacity-0 animate-neon-reveal [animation-delay:1s]'
          } font-light m-0 whitespace-nowrap lg:text-[clamp(1.25rem,5vw,2.5rem)] lg:mb-[clamp(0.313rem,1.25vw,0.625rem)] lg:opacity-0 lg:animate-neon-reveal lg:[animation-delay:1s]`}
          style={{
            fontFamily: "'Syne Mono', monospace",
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          ANGEL VAZQUEZ
        </h1>

        <h2
          className={`${
            isMobileMenuOpen
              ? 'text-[clamp(1rem,4vw,2rem)] mb-[clamp(0.25rem,2vw,1rem)] opacity-100'
              : 'text-[clamp(0.5rem,2vw,1rem)] mb-[clamp(0.375rem,1.5vw,0.75rem)] opacity-0 animate-neon-reveal [animation-delay:2s]'
          } font-light m-0 tracking-[0.1em] whitespace-nowrap lg:text-[clamp(0.625rem,2.5vw,1.25rem)] lg:mb-[clamp(0.469rem,1.875vw,0.938rem)] lg:opacity-0 lg:animate-neon-reveal lg:[animation-delay:2s]`}
          style={{
            fontFamily: "'Syne Mono', monospace",
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          }}
        >
          SOFTWARE ENGINEER
        </h2>

        <div
          className={`${
            isMobileMenuOpen
              ? 'w-[clamp(150px,35vw,300px)] mb-[clamp(0.25rem,2vw,1rem)] opacity-100'
              : 'w-[clamp(75px,15vw,150px)] mb-[clamp(0.375rem,1.5vw,0.75rem)] opacity-0 animate-neon-reveal [animation-delay:2.5s]'
          } h-0.5 ${bgColor} mx-auto lg:w-[clamp(94px,18.75vw,188px)] lg:mb-[clamp(0.469rem,1.875vw,0.938rem)] lg:opacity-0 lg:animate-neon-reveal lg:[animation-delay:2.5s]`}
        />

        <div
          className={`${
            isMobileMenuOpen
              ? 'gap-[clamp(0.25rem,2vw,1rem)] opacity-100'
              : 'gap-[clamp(0.375rem,1.5vw,0.75rem)] opacity-0 animate-neon-reveal [animation-delay:3s]'
          } flex flex-col items-center lg:gap-[clamp(0.469rem,1.875vw,0.938rem)] lg:opacity-0 lg:animate-neon-reveal lg:[animation-delay:3s]`}
        >
          <div
            className={`${
              isMobileMenuOpen
                ? 'gap-[clamp(0.5rem,3vw,1.5rem)]'
                : 'gap-[clamp(0.5rem,2vw,1rem)]'
            } flex justify-center items-center whitespace-nowrap lg:gap-[clamp(0.625rem,2.5vw,1.25rem)]`}
          >
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
              <span
                className={`${
                  isMobileMenuOpen
                    ? 'text-[clamp(0.75rem,3vw,1.5rem)]'
                    : 'text-[clamp(0.4375rem,1.75vw,0.875rem)]'
                } lg:text-[clamp(0.547rem,2.188vw,1.094rem)]`}
              >
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
              <span
                className={`${
                  isMobileMenuOpen
                    ? 'text-[clamp(0.75rem,3vw,1.5rem)]'
                    : 'text-[clamp(0.4375rem,1.75vw,0.875rem)]'
                } lg:text-[clamp(0.547rem,2.188vw,1.094rem)]`}
              >
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
            <span
              className={`${
                isMobileMenuOpen
                  ? 'text-[clamp(0.875rem,3.5vw,1.75rem)]'
                  : 'text-[clamp(0.4375rem,1.75vw,0.875rem)]'
              } lg:text-[clamp(0.547rem,2.188vw,1.094rem)]`}
            >
              PORTFOLIO
            </span>
          </a>

          {/* Theme toggle button */}
          <button
            onClick={onThemeToggle}
            className={`${
              isMobileMenuOpen
                ? 'mt-[clamp(0.25rem,1.5vw,0.75rem)]'
                : 'mt-[clamp(0.125rem,0.5vw,0.25rem)]'
            } pointer-events-auto transition-all duration-300 hover:scale-110 lg:mt-[clamp(0.156rem,0.625vw,0.313rem)]`}
            aria-label="Toggle theme"
          >
            <svg
              viewBox="0 0 50 40"
              className={`${
                isMobileMenuOpen
                  ? 'w-[clamp(20px,5vw,35px)] h-[clamp(16px,4vw,28px)]'
                  : 'w-[clamp(15px,3.5vw,22.5px)] h-[clamp(12px,2.8vw,18px)]'
              } lg:w-[clamp(15px,3.5vw,22.5px)] lg:h-[clamp(12px,2.8vw,18px)]`}
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

      <div
        className={`fixed bottom-12 right-6 md:bottom-4 md:right-4 z-controls pointer-events-auto flex-col gap-4 w-[min(200px,25vw)] ${showTechInfo ? 'hidden xl:flex' : 'flex'}`}
      >
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
            step="1"
            value={pyramidCount}
            onChange={(e) => {
              const newCount = Math.round(parseFloat(e.target.value));
              const delta = newCount - pyramidCount;
              onPyramidCountChange(delta);
            }}
            className={`w-full h-1 ${theme === 'light' ? 'bg-black/30' : 'bg-white/30'} rounded-lg appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 ${theme === 'light' ? 'focus-visible:ring-black' : 'focus-visible:ring-white'} focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full ${theme === 'light' ? '[&::-webkit-slider-thumb]:bg-black' : '[&::-webkit-slider-thumb]:bg-white'} [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full ${theme === 'light' ? '[&::-moz-range-thumb]:bg-black' : '[&::-moz-range-thumb]:bg-white'} [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110`}
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
            step="1"
            value={speedMultiplier}
            onChange={(e) => {
              const newSpeed = Math.round(parseFloat(e.target.value));
              const delta = newSpeed - speedMultiplier;
              onSpeedChange(delta);
            }}
            className={`w-full h-1 ${theme === 'light' ? 'bg-black/30' : 'bg-white/30'} rounded-lg appearance-none cursor-pointer focus:outline-none focus-visible:ring-2 ${theme === 'light' ? 'focus-visible:ring-black' : 'focus-visible:ring-white'} focus-visible:ring-offset-2 focus-visible:ring-offset-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full ${theme === 'light' ? '[&::-webkit-slider-thumb]:bg-black' : '[&::-webkit-slider-thumb]:bg-white'} [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full ${theme === 'light' ? '[&::-moz-range-thumb]:bg-black' : '[&::-moz-range-thumb]:bg-white'} [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:transition-transform [&::-moz-range-thumb]:hover:scale-110`}
          />
        </div>
      </div>
    </>
  );
}
