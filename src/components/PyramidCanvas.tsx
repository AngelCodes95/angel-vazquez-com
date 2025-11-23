import { useEffect, useRef, useState } from 'react';
import type { PyramidState } from '../types';
import {
  getRandomInt,
  getRandomColor,
  calculatePyramidSize,
  getRandomVelocity,
  getRandomRotationSpeed,
  createPyramidGeometry,
  calculateCollisionBounds,
  rotatePoint,
  project3D,
  calculateCanvasSize,
} from '../lib';

interface PyramidCanvasProps {
  pyramidCount: number;
  speedMultiplier: number;
}

export function PyramidCanvas({
  pyramidCount,
  speedMultiplier,
}: PyramidCanvasProps) {
  const [, forceUpdate] = useState({});
  const pyramidsRef = useRef<PyramidState[]>([]);
  const animationFrameRef = useRef<number>(0);
  const nextIdRef = useRef(0);
  const previousSpeedRef = useRef(1.0);

  // Handle pyramid count changes
  useEffect(() => {
    const current = pyramidsRef.current;
    const size = calculatePyramidSize();
    const geometry = createPyramidGeometry(size);
    const collisionBounds = calculateCollisionBounds(size);

    if (current.length < pyramidCount) {
      // Add pyramids
      const toAdd = pyramidCount - current.length;
      for (let i = 0; i < toAdd; i++) {
        current.push({
          id: nextIdRef.current++,
          x: getRandomInt(0, window.innerWidth - collisionBounds.width),
          y: getRandomInt(0, window.innerHeight - collisionBounds.height),
          velocityX: getRandomVelocity(1, 2) * speedMultiplier,
          velocityY: getRandomVelocity(1, 2) * speedMultiplier,
          rotationX: 0,
          rotationY: 0,
          rotationSpeedX:
            getRandomRotationSpeed(0.005, 0.02) * 0.5 * speedMultiplier,
          rotationSpeedY: getRandomRotationSpeed(0.005, 0.02) * speedMultiplier,
          color: getRandomColor(),
          size,
          collisionBounds,
          geometry,
        });
      }
      forceUpdate({});
    } else if (current.length > pyramidCount) {
      // Remove pyramids
      pyramidsRef.current = current.slice(0, pyramidCount);
      forceUpdate({});
    }
  }, [pyramidCount, speedMultiplier]);

  // Handle speed multiplier changes
  useEffect(() => {
    const multiplier = speedMultiplier / previousSpeedRef.current;
    pyramidsRef.current.forEach((pyramid) => {
      pyramid.velocityX *= multiplier;
      pyramid.velocityY *= multiplier;
      pyramid.rotationSpeedX *= multiplier;
      pyramid.rotationSpeedY *= multiplier;
    });
    previousSpeedRef.current = speedMultiplier;
  }, [speedMultiplier]);

  // Animation loop
  useEffect(() => {
    const updatePyramids = () => {
      pyramidsRef.current.forEach((pyramid) => {
        let nextX = pyramid.x + pyramid.velocityX;
        let nextY = pyramid.y + pyramid.velocityY;

        // Wall collision detection
        if (nextX <= 0) {
          nextX = 0;
          pyramid.velocityX = Math.abs(pyramid.velocityX);
          pyramid.color = getRandomColor();
        } else if (nextX + pyramid.collisionBounds.width >= window.innerWidth) {
          nextX = window.innerWidth - pyramid.collisionBounds.width;
          pyramid.velocityX = -Math.abs(pyramid.velocityX);
          pyramid.color = getRandomColor();
        }

        if (nextY <= 0) {
          nextY = 0;
          pyramid.velocityY = Math.abs(pyramid.velocityY);
          pyramid.color = getRandomColor();
        } else if (
          nextY + pyramid.collisionBounds.height >=
          window.innerHeight
        ) {
          nextY = window.innerHeight - pyramid.collisionBounds.height;
          pyramid.velocityY = -Math.abs(pyramid.velocityY);
          pyramid.color = getRandomColor();
        }

        pyramid.x = nextX;
        pyramid.y = nextY;
        pyramid.rotationX += pyramid.rotationSpeedX;
        pyramid.rotationY += pyramid.rotationSpeedY;
      });

      forceUpdate({});
      animationFrameRef.current = requestAnimationFrame(updatePyramids);
    };

    animationFrameRef.current = requestAnimationFrame(updatePyramids);

    return () => {
      if (animationFrameRef.current > 0) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const newSize = calculatePyramidSize();
      const newGeometry = createPyramidGeometry(newSize);
      const newCollisionBounds = calculateCollisionBounds(newSize);

      pyramidsRef.current.forEach((pyramid) => {
        pyramid.size = newSize;
        pyramid.geometry = newGeometry;
        pyramid.collisionBounds = newCollisionBounds;
        pyramid.x = Math.min(
          pyramid.x,
          window.innerWidth - newCollisionBounds.width
        );
        pyramid.y = Math.min(
          pyramid.y,
          window.innerHeight - newCollisionBounds.height
        );
      });
      forceUpdate({});
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {pyramidsRef.current.map((pyramid) => (
        <PyramidSVG key={pyramid.id} pyramid={pyramid} />
      ))}
    </>
  );
}

interface PyramidSVGProps {
  pyramid: PyramidState;
}

function PyramidSVG({ pyramid }: PyramidSVGProps) {
  const canvasSize = calculateCanvasSize(pyramid.size);

  // Rotate all vertices
  const rotatedBase = pyramid.geometry.baseVertices.map((vertex) =>
    rotatePoint(vertex, pyramid.rotationX, pyramid.rotationY)
  );
  const rotatedApex = rotatePoint(
    pyramid.geometry.apexVertex,
    pyramid.rotationX,
    pyramid.rotationY
  );

  // Project to 2D
  const projectedBase = rotatedBase.map((vertex) =>
    project3D(vertex.x, vertex.y, vertex.z, canvasSize)
  );
  const projectedApex = project3D(
    rotatedApex.x,
    rotatedApex.y,
    rotatedApex.z,
    canvasSize
  );

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
        zIndex: 1,
      }}
    >
      {edges.map(([start, end], index) => (
        <line
          key={index}
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
          stroke={pyramid.color}
          strokeWidth="1.5"
          fill="none"
        />
      ))}
    </svg>
  );
}
