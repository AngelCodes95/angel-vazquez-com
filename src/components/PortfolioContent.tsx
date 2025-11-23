import { DEFAULT_GAME_CONFIG } from '../types';

interface PortfolioContentProps {
  pyramidCount: number;
  speedMultiplier: number;
  onPyramidCountChange: (delta: number) => void;
  onSpeedChange: (delta: number) => void;
}

export function PortfolioContent({
  pyramidCount,
  speedMultiplier,
  onPyramidCountChange,
  onSpeedChange,
}: PortfolioContentProps) {
  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-center z-[1001] pointer-events-none">
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

        <div className="w-[clamp(150px,30vw,300px)] h-0.5 bg-white mx-auto mb-[clamp(0.75rem,3vw,1.5rem)] opacity-0 animate-neon-reveal [animation-delay:2.5s]" />

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
        </div>
      </div>

      <div className="fixed bottom-4 right-4 z-[1001] pointer-events-auto flex flex-col gap-4 w-[min(200px,25vw)]">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="pyramid-count"
            className="text-[10px] text-white whitespace-nowrap"
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
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="speed"
            className="text-[10px] text-white whitespace-nowrap"
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
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
          />
        </div>
      </div>
    </>
  );
}
