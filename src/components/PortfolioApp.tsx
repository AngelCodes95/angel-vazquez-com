import { useState } from 'react';
import { DEFAULT_GAME_CONFIG } from '../types';
import { PyramidCanvas } from './PyramidCanvas';
import { FallingPyramidsBackground } from './FallingPyramidsBackground';
import { ControlPanel } from './ControlPanel';
import { PortfolioContent } from './PortfolioContent';

export function PortfolioApp() {
  const [pyramidCount, setPyramidCount] = useState(
    DEFAULT_GAME_CONFIG.initialPyramidCount
  );
  const [speedMultiplier, setSpeedMultiplier] = useState(
    DEFAULT_GAME_CONFIG.defaultSpeed
  );

  const handlePyramidCountChange = (delta: number) => {
    setPyramidCount((prev) => {
      const next = prev + delta;
      return Math.max(
        DEFAULT_GAME_CONFIG.minPyramids,
        Math.min(DEFAULT_GAME_CONFIG.maxPyramids, next)
      );
    });
  };

  const handleSpeedChange = (delta: number) => {
    setSpeedMultiplier((prev) => {
      const next = prev + delta;
      return Math.max(
        DEFAULT_GAME_CONFIG.minSpeed,
        Math.min(DEFAULT_GAME_CONFIG.maxSpeed, next)
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
      <PortfolioContent />
      <ControlPanel
        pyramidCount={pyramidCount}
        speedMultiplier={speedMultiplier}
        onPyramidCountChange={handlePyramidCountChange}
        onSpeedChange={handleSpeedChange}
      />
    </>
  );
}
