import { useEffect, useRef } from 'react';
import { DEFAULT_GAME_CONFIG } from '../types';

interface ControlPanelProps {
  pyramidCount: number;
  speedMultiplier: number;
  onPyramidCountChange: (delta: number) => void;
  onSpeedChange: (delta: number) => void;
}

export function ControlPanel({
  pyramidCount,
  speedMultiplier,
  onPyramidCountChange,
  onSpeedChange,
}: ControlPanelProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          if (pyramidCount < DEFAULT_GAME_CONFIG.maxPyramids) {
            onPyramidCountChange(1);
          }
          break;
        case 'ArrowDown':
          if (pyramidCount > DEFAULT_GAME_CONFIG.minPyramids) {
            onPyramidCountChange(-1);
          }
          break;
        case 'ArrowRight':
          if (speedMultiplier < DEFAULT_GAME_CONFIG.maxSpeed) {
            onSpeedChange(1);
          }
          break;
        case 'ArrowLeft':
          if (speedMultiplier > DEFAULT_GAME_CONFIG.minSpeed) {
            onSpeedChange(-1);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [pyramidCount, speedMultiplier, onPyramidCountChange, onSpeedChange]);

  return (
    <>
      {/* Info Display */}
      <div className="fixed top-2.5 left-2.5 text-white z-[1000] text-xs bg-black/70 p-2.5 rounded">
        <div>The Wireframe Pyramids are Interactive, Enjoy!</div>
        <div>
          Pyramids: <span>{pyramidCount}</span>
        </div>
        <div>
          Speed: <span>{speedMultiplier}</span>x
        </div>
        <div>
          {isMobile ? (
            <>
              Tap/Hold top/bottom: + / - pyramids
              <br />
              Tap/Hold left/right: + / - speed
            </>
          ) : (
            <>
              ↑ ↓ arrows: + / - pyramids
              <br />← → arrows: + / - speed
            </>
          )}
        </div>
      </div>

      {/* Touch zones for mobile */}
      {isMobile && (
        <TouchZones
          pyramidCount={pyramidCount}
          speedMultiplier={speedMultiplier}
          onPyramidCountChange={onPyramidCountChange}
          onSpeedChange={onSpeedChange}
        />
      )}
    </>
  );
}

interface TouchZonesProps {
  pyramidCount: number;
  speedMultiplier: number;
  onPyramidCountChange: (delta: number) => void;
  onSpeedChange: (delta: number) => void;
}

function TouchZones({
  pyramidCount,
  speedMultiplier,
  onPyramidCountChange,
  onSpeedChange,
}: TouchZonesProps) {
  const holdTimeoutRef = useRef<number | null>(null);
  const holdIntervalRef = useRef<number | null>(null);

  const executeAction = (action: string) => {
    switch (action) {
      case 'pyramid-up':
        if (pyramidCount < DEFAULT_GAME_CONFIG.maxPyramids) {
          onPyramidCountChange(1);
        }
        break;
      case 'pyramid-down':
        if (pyramidCount > DEFAULT_GAME_CONFIG.minPyramids) {
          onPyramidCountChange(-1);
        }
        break;
      case 'speed-up':
        if (speedMultiplier < DEFAULT_GAME_CONFIG.maxSpeed) {
          onSpeedChange(1);
        }
        break;
      case 'speed-down':
        if (speedMultiplier > DEFAULT_GAME_CONFIG.minSpeed) {
          onSpeedChange(-1);
        }
        break;
    }
  };

  const handleTouchStart = (action: string) => {
    executeAction(action);

    holdTimeoutRef.current = window.setTimeout(() => {
      holdIntervalRef.current = window.setInterval(() => {
        executeAction(action);
      }, 100);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (holdTimeoutRef.current !== null) {
      clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
    if (holdIntervalRef.current !== null) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (holdTimeoutRef.current !== null) {
        clearTimeout(holdTimeoutRef.current);
      }
      if (holdIntervalRef.current !== null) {
        clearInterval(holdIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none">
      {/* Top zone */}
      <div
        className="absolute top-0 left-1/4 w-1/2 h-[35%] z-[12] pointer-events-auto opacity-0"
        onTouchStart={() => {
          handleTouchStart('pyramid-up');
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
      {/* Bottom zone */}
      <div
        className="absolute bottom-0 left-1/4 w-1/2 h-[35%] z-[12] pointer-events-auto opacity-0"
        onTouchStart={() => {
          handleTouchStart('pyramid-down');
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
      {/* Left zone */}
      <div
        className="absolute top-[35%] left-0 w-2/5 h-[30%] z-[11] pointer-events-auto opacity-0"
        onTouchStart={() => {
          handleTouchStart('speed-down');
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
      {/* Right zone */}
      <div
        className="absolute top-[35%] right-0 w-2/5 h-[30%] z-[11] pointer-events-auto opacity-0"
        onTouchStart={() => {
          handleTouchStart('speed-up');
        }}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      />
    </div>
  );
}
