import { useState, useEffect } from 'react';
import { PyramidCanvas } from './PyramidCanvas';
import { FallingPyramidsBackground } from './FallingPyramidsBackground';
import { PortfolioContent } from './PortfolioContent';
import { DEFAULT_GAME_CONFIG } from '../types';

export type Theme = 'light' | 'dark';

export function PortfolioApp() {
  const [pyramidCount, setPyramidCount] = useState(
    DEFAULT_GAME_CONFIG.initialPyramidCount
  );
  const [speedMultiplier, setSpeedMultiplier] = useState(
    DEFAULT_GAME_CONFIG.defaultSpeed
  );
  const [theme, setTheme] = useState<Theme>('dark');

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Update document body and localStorage when theme changes
  useEffect(() => {
    document.body.className = theme === 'light' ? 'bg-white' : 'bg-black';
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handlePyramidCountChange = (delta: number) => {
    setPyramidCount((prev) => {
      const newCount = prev + delta;
      return Math.max(
        DEFAULT_GAME_CONFIG.minPyramids,
        Math.min(DEFAULT_GAME_CONFIG.maxPyramids, newCount)
      );
    });
  };

  const handleSpeedChange = (delta: number) => {
    setSpeedMultiplier((prev) => {
      const newSpeed = prev + delta;
      return Math.max(
        DEFAULT_GAME_CONFIG.minSpeed,
        Math.min(DEFAULT_GAME_CONFIG.maxSpeed, newSpeed)
      );
    });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <>
      <FallingPyramidsBackground theme={theme} />
      <PyramidCanvas
        pyramidCount={pyramidCount}
        speedMultiplier={speedMultiplier}
      />
      <PortfolioContent
        pyramidCount={pyramidCount}
        speedMultiplier={speedMultiplier}
        onPyramidCountChange={handlePyramidCountChange}
        onSpeedChange={handleSpeedChange}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
    </>
  );
}
