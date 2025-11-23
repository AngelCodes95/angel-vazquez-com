import { useState } from 'react';
import { PyramidCanvas } from './PyramidCanvas';
import { FallingPyramidsBackground } from './FallingPyramidsBackground';
import { PortfolioContent } from './PortfolioContent';
import { DEFAULT_GAME_CONFIG } from '../types';

export function PortfolioApp() {
  const [pyramidCount, setPyramidCount] = useState(
    DEFAULT_GAME_CONFIG.initialPyramidCount
  );
  const [speedMultiplier, setSpeedMultiplier] = useState(
    DEFAULT_GAME_CONFIG.defaultSpeed
  );

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

  return (
    <>
      <FallingPyramidsBackground />
      <PyramidCanvas
        pyramidCount={pyramidCount}
        speedMultiplier={speedMultiplier}
      />
      <PortfolioContent
        pyramidCount={pyramidCount}
        speedMultiplier={speedMultiplier}
        onPyramidCountChange={handlePyramidCountChange}
        onSpeedChange={handleSpeedChange}
      />
    </>
  );
}
