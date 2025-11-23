import { useEffect, useState, useRef } from 'react';
import type { FallingPyramidState } from '../types';
import { DEFAULT_GAME_CONFIG } from '../types';
import type { Theme } from './PortfolioApp';
import {
  getRandomRotationSpeed,
  createSmallPyramidGeometry,
  rotatePoint,
} from '../lib';

const MAX_FALLING_PYRAMIDS = 30;

interface FallingPyramidsBackgroundProps {
  theme: Theme;
}

export function FallingPyramidsBackground({
  theme,
}: FallingPyramidsBackgroundProps) {
  const [fallingPyramids, setFallingPyramids] = useState<FallingPyramidState[]>(
    []
  );
  const animationFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const intervalIdRef = useRef<number | null>(null);

  // Spawn new falling pyramids at intervals
  useEffect(() => {
    const spawnPyramid = () => {
      setFallingPyramids((prev) => {
        // Cap maximum pyramids to prevent memory buildup
        if (prev.length >= MAX_FALLING_PYRAMIDS) {
          return prev;
        }

        const newPyramid: FallingPyramidState = {
          id: nextIdRef.current++,
          x: Math.random() * (window.innerWidth - 30),
          y: -50,
          fallSpeed: Math.random() * 1 + 0.5,
          rotationX: 0,
          rotationY: 0,
          rotationSpeedX: getRandomRotationSpeed(0.01, 0.02) * 0.5,
          rotationSpeedY: getRandomRotationSpeed(0.01, 0.02),
          opacity: 0.7,
          size: 15,
        };

        return [...prev, newPyramid];
      });
    };

    const startInterval = () => {
      if (intervalIdRef.current === null) {
        intervalIdRef.current = window.setInterval(
          spawnPyramid,
          DEFAULT_GAME_CONFIG.fallingPyramidInterval
        );
      }
    };

    const stopInterval = () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopInterval();
      } else {
        // Clear accumulated pyramids when returning to tab
        setFallingPyramids([]);
        startInterval();
      }
    };

    startInterval();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopInterval();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const updateFallingPyramids = () => {
      setFallingPyramids((prev) => {
        return prev
          .map((pyramid) => ({
            ...pyramid,
            y: pyramid.y + pyramid.fallSpeed,
            rotationX: pyramid.rotationX + pyramid.rotationSpeedX,
            rotationY: pyramid.rotationY + pyramid.rotationSpeedY,
            opacity: pyramid.opacity - 0.001,
          }))
          .filter(
            (pyramid) =>
              pyramid.y <= window.innerHeight + 50 && pyramid.opacity > 0
          );
      });

      animationFrameRef.current = requestAnimationFrame(updateFallingPyramids);
    };

    animationFrameRef.current = requestAnimationFrame(updateFallingPyramids);

    return () => {
      if (animationFrameRef.current > 0) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {fallingPyramids.map((pyramid) => (
        <FallingPyramidSVG key={pyramid.id} pyramid={pyramid} theme={theme} />
      ))}
    </>
  );
}

interface FallingPyramidSVGProps {
  pyramid: FallingPyramidState;
  theme: Theme;
}

function FallingPyramidSVG({ pyramid, theme }: FallingPyramidSVGProps) {
  const canvasSize = 30;
  const geometry = createSmallPyramidGeometry(pyramid.size);

  // Rotate all vertices
  const rotatedBase = geometry.baseVertices.map((vertex) =>
    rotatePoint(vertex, pyramid.rotationX, pyramid.rotationY)
  );
  const rotatedApex = rotatePoint(
    geometry.apexVertex,
    pyramid.rotationX,
    pyramid.rotationY
  );

  // Project to 2D (centered at 15, 15)
  const projectedBase = rotatedBase.map((vertex) => ({
    x: vertex.x + 15,
    y: vertex.y + 15,
  }));
  const projectedApex = {
    x: rotatedApex.x + 15,
    y: rotatedApex.y + 15,
  };

  // Define edges
  const edges: Array<[{ x: number; y: number }, { x: number; y: number }]> = [
    // Base square
    [projectedBase[0], projectedBase[1]],
    [projectedBase[1], projectedBase[2]],
    [projectedBase[2], projectedBase[3]],
    [projectedBase[3], projectedBase[0]],
    // Apex to base
    [projectedApex, projectedBase[0]],
    [projectedApex, projectedBase[1]],
    [projectedApex, projectedBase[2]],
    [projectedApex, projectedBase[3]],
  ];

  return (
    <svg
      viewBox={`0 0 ${canvasSize.toString()} ${canvasSize.toString()}`}
      className="absolute pointer-events-none"
      style={{
        left: `${pyramid.x.toString()}px`,
        top: `${pyramid.y.toString()}px`,
        width: `${canvasSize.toString()}px`,
        height: `${canvasSize.toString()}px`,
        opacity: pyramid.opacity,
        zIndex: 0,
      }}
    >
      {edges.map(([start, end], index) => (
        <line
          key={index}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={theme === 'light' ? 'black' : 'white'}
          strokeWidth="1"
          fill="none"
        />
      ))}
    </svg>
  );
}
