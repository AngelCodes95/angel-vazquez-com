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
  const [pyramids, setPyramids] = useState<PyramidState[]>([]);
  const animationFrameRef = useRef<number>(0);
  const pyramidsRef = useRef<PyramidState[]>([]);

  // Initialize pyramids on mount and when count changes
  useEffect(() => {
    const size = calculatePyramidSize();
    const geometry = createPyramidGeometry(size);
    const collisionBounds = calculateCollisionBounds(size);

    const createPyramid = (id: number): PyramidState => ({
      id,
      x: getRandomInt(0, window.innerWidth - collisionBounds.width),
      y: getRandomInt(0, window.innerHeight - collisionBounds.height),
      velocityX: getRandomVelocity(1, 2),
      velocityY: getRandomVelocity(1, 2),
      rotationX: 0,
      rotationY: 0,
      rotationSpeedX: getRandomRotationSpeed(0.005, 0.02) * 0.5,
      rotationSpeedY: getRandomRotationSpeed(0.005, 0.02),
      color: getRandomColor(),
      size,
      collisionBounds,
      geometry,
    });

    const newPyramids = Array.from({ length: pyramidCount }, (_, i) =>
      createPyramid(i)
    );
    setPyramids(newPyramids);
    pyramidsRef.current = newPyramids;
  }, [pyramidCount]);

  // Apply speed multiplier changes
  useEffect(() => {
    setPyramids((prev) =>
      prev.map((pyramid) => ({
        ...pyramid,
        velocityX:
          (pyramid.velocityX / (pyramidsRef.current[0]?.velocityX || 1)) *
          speedMultiplier,
        velocityY:
          (pyramid.velocityY / (pyramidsRef.current[0]?.velocityY || 1)) *
          speedMultiplier,
      }))
    );
  }, [speedMultiplier]);

  // Animation loop
  useEffect(() => {
    const updatePyramids = () => {
      setPyramids((prev) => {
        return prev.map((pyramid) => {
          let nextX = pyramid.x + pyramid.velocityX;
          let nextY = pyramid.y + pyramid.velocityY;
          let newVelocityX = pyramid.velocityX;
          let newVelocityY = pyramid.velocityY;
          let newColor = pyramid.color;

          // Wall collision detection
          if (nextX <= 0) {
            nextX = 0;
            newVelocityX = Math.abs(pyramid.velocityX);
            newColor = getRandomColor();
          } else if (
            nextX + pyramid.collisionBounds.width >=
            window.innerWidth
          ) {
            nextX = window.innerWidth - pyramid.collisionBounds.width;
            newVelocityX = -Math.abs(pyramid.velocityX);
            newColor = getRandomColor();
          }

          if (nextY <= 0) {
            nextY = 0;
            newVelocityY = Math.abs(pyramid.velocityY);
            newColor = getRandomColor();
          } else if (
            nextY + pyramid.collisionBounds.height >=
            window.innerHeight
          ) {
            nextY = window.innerHeight - pyramid.collisionBounds.height;
            newVelocityY = -Math.abs(pyramid.velocityY);
            newColor = getRandomColor();
          }

          return {
            ...pyramid,
            x: nextX,
            y: nextY,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
            rotationX: pyramid.rotationX + pyramid.rotationSpeedX,
            rotationY: pyramid.rotationY + pyramid.rotationSpeedY,
            color: newColor,
          };
        });
      });

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

      setPyramids((prev) =>
        prev.map((pyramid) => ({
          ...pyramid,
          size: newSize,
          geometry: newGeometry,
          collisionBounds: newCollisionBounds,
          x: Math.min(pyramid.x, window.innerWidth - newCollisionBounds.width),
          y: Math.min(
            pyramid.y,
            window.innerHeight - newCollisionBounds.height
          ),
        }))
      );
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {pyramids.map((pyramid) => (
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
